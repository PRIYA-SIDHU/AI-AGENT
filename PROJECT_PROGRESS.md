# Project Progress: GovAssist AI

This document details the development progress of **GovAssist AI** – an AI-Powered Government Scheme Recommendation Assistant (Phase 1).

---

## 📂 Current Folder Structure

```
AI-AGENT/
├── backend/
│   ├── data/
│   │   └── dummy_schemes.json         # 30 detailed government schemes JSON
│   ├── database/
│   │   ├── __init__.py
│   │   └── mongodb.py                 # Async MongoDB connection via Motor
│   ├── models/
│   │   ├── __init__.py
│   │   └── chat.py                    # Pydantic schemas mapping DB to Frontend
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── chat.py                    # Chat creation, deletion, details, message post
│   │   └── history.py                 # Sidebar history retriever
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py              # Groq API integration (with history + schemes)
│   │   ├── chat_service.py            # DB persistence and orchestration logic
│   │   └── rag_service.py             # Semantic search retrieval from vector DB
│   ├── vector_db/
│   │   ├── __init__.py
│   │   ├── chroma_db_store/           # Local persistent store files
│   │   ├── chroma_loader.py           # Populates and queries the vector store
│   │   └── chromadb_fallback.py       # Pure-Python fallback vector store (TF-IDF)
│   ├── .env                           # Environment configuration
│   ├── .env.example                   # Environment configuration template
│   ├── main.py                        # FastAPI entrypoint, lifespan and CORS setup
│   └── requirements.txt               # Locked Python dependencies (Pydantic v1, Python 3.14 compatible)
├── frontend/                          # Pre-built React web application
└── PROJECT_PROGRESS.md                # Phase 1 milestones and status report
```

---

## ✅ Completed Features (Phase 1)

1. **Modular FastAPI Backend**: Developed structured API endpoints for chat session lifecycle management.
2. **MongoDB Chat History**: Configured asynchronous DB client utilizing Motor to write and retrieve chats and messages.
3. **ChromaDB Vector Loader & Query Engine**: Loaded 30 comprehensive, dummy schemes spanning key categories (Scholarships, Agriculture, Loans, Healthcare, Social Welfare) into a vector index.
4. **Pure-Python ChromaDB Fallback**: Built a custom TF-IDF semantic query engine inside the vector loader that activates if native chromadb fails to compile, maintaining full search capabilities in Python 3.14.
5. **Groq SDK Integration**: Integrated Groq API client supporting conversational model inferences (`llama-3.3-70b-versatile`) with formatted RAG prompts.
6. **Adaptive Schemes mapping**: Mapped database variables (`role`, `content`) to frontend models (`sender`, `text`) to ensure zero-modification compatibility.
7. **Swagger Documentation**: Self-generating API endpoints visualizer at `/docs`.
8. **Dynamic Title Generation**: Automatically updates the chat session title based on the first user message.
9. **Chat Lifecycle deletion**: Wipes the chat metadata and all underlying nested messages.

---

## ❌ Pending Features (Future Phases)

- **Schemes Listing Page Backend**: Endpoints to list and filter all 30+ schemes in a grid.
- **Scheme Details Page API**: Single fetcher for detailed profiles.
- **Eligibility Engine**: Form-based user assessment logic matching income, age, category, and land boundaries.
- **User Profile & Personal Dashboard**: Profile collection to pre-fill scheme application forms.
- **OCR Documents Upload**: Extracts data from ID cards (Aadhaar, PAN) using computer vision.
- **WhatsApp Integration**: Sends application status alerts and scheme reminders.
- **Email Reminders**: Automated reminders for scholarship deadlines or installment dates.
- **Real Government Dataset**: Scraping and cleaning actual state/national scheme details.
- **Government API Integration**: Live API hooks to fetch status updates.
- **Analytics & Admin Dashboard**: Platform usage data and scheme request metrics.

---

## 🗄️ Database Schema

Our database uses two MongoDB collections:

### 1. `chats`
Represents individual conversation sessions.
```json
{
  "_id": "ObjectId",
  "title": "String",
  "is_pinned": "Boolean",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### 2. `messages`
Represents individual messages exchanged within a chat.
```json
{
  "_id": "ObjectId",
  "chat_id": "String (Hex)",
  "role": "String ('user' | 'assistant')",
  "content": "String (Markdown)",
  "timestamp": "ISODate"
}
```

---

## 🌐 API Documentation

FastAPI auto-generates interactive docs at `http://127.0.0.1:8000/docs`.

| Method | Endpoint | Request Body | Response Body | Description |
|---|---|---|---|---|
| **POST** | `/new-chat` | None | `{"chat_id": "string"}` | Starts a new chat session |
| **POST** | `/chat` | `{"chat_id": "string", "message": "string"}` | `{"sender": "ai", "text": "string", "timestamp": "string"}` | Submits message, runs search + LLM, saves response |
| **GET** | `/history` | None | `[{"id": "string", "title": "string", "timestamp": "string", "isPinned": false}]` | Gets all chat metadata for sidebar |
| **GET** | `/chat/{chat_id}` | None | `{"id": "string", "title": "string", "timestamp": "string", "isPinned": false, "messages": [{"sender": "string", "text": "string", "timestamp": "string"}]}` | Returns full message log for a chat |
| **DELETE** | `/chat/{chat_id}`| None | `{"status": "success", "message": "string"}` | Deletes chat session and messages |
| **POST** | `/chat/{chat_id}/pin`| None | `{"status": "success", "isPinned": true}` | Toggles pinned state of chat session |

---

## 🧠 RAG Pipeline & Prompt Structure

1. **User Query**: User submits a query (e.g. *"I'm an OBC student looking for scholarships"*).
2. **Retrieval**: Query text is processed against ChromaDB (or the TF-IDF Fallback) to find the top 4 most semantically similar scheme documents.
3. **Context Construction**: Schemes are structured into a clean Markdown system context block.
4. **Prompt assembly**:
   - **System Prompt**: Directs the LLM to act as GovAssist AI, forbids inventing schemes, and enforces Markdown styling.
   - **Chat History**: Appends the last 20 messages.
   - **Retrieved Schemes Context**: Inserts retrieved schemes.
   - **Current Query**: Appends the active question.
5. **Groq Inference**: Sent to `llama-3.3-70b-versatile` on Groq for sub-second, highly structured response generation.
6. **Save**: Message and reply are saved, and the response is formatted back to the client.

---

## 🔮 Next Development Phase

1. **Frontend Integration**: Update `frontend/src/App.jsx` state management functions (`handleSendMessage`, `handleNewChat`, `handleDeleteConfirm`, `handleSelectChat`, `handlePinChat`) to query the backend endpoints using `fetch` or `axios` instead of local mock arrays.
2. **MongoDB Indexing**: Create indices on `messages.chat_id` and `chats.is_pinned` to optimize retrieval speeds.
3. **Model Fine-Tuning**: Incorporate temperature toggles in the settings panel to allow user choice between reasoning models (`qwen/qwen3-32b`) and conversational models.
