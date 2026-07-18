# GovAssist AI – AI-Powered Government Scheme Recommendation Assistant

GovAssist AI is an AI-powered government scheme discovery and recommendation assistant designed to help users identify eligible schemes (Scholarships, Farming Subsidies, Business Loans, Healthcare Plans, and Welfare Schemes) through an interactive, semantic-search-driven chatbot.

---

## 🛠️ Project Architecture

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion + Lucide Icons (Pre-built)
- **Backend**: FastAPI + Uvicorn + Pydantic v1 (Python 3.14 compatible)
- **Database**: MongoDB (via async Motor driver)
- **Vector Database**: ChromaDB (with automatic pure-Python TF-IDF fallback when compiling is not supported)
- **AI Inference Engine**: Groq API (`llama-3.3-70b-versatile`)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python**: Version 3.10+ (UCRT64 / MSYS2 / standard distributions supported)
- **Node.js**: Version 18+ (for frontend)
- **MongoDB**: Installed and running locally on port `27017`

---

### 2. Backend Setup & Run

1. Navigate to the root directory and activate the virtual environment:
   ```powershell
   # If environment not created:
   python -m venv backend/venv
   
   # Activate:
   # On Windows (PowerShell):
   .\backend\venv\bin\Activate.ps1
   # On UNIX / Git Bash:
   source backend/venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Configure Environment Variables:
   - Create a copy of `backend/.env.example` named `backend/.env`.
   - Open `backend/.env` and add your **Groq API Key**:
     ```env
     GROQ_API_KEY=gsk_your_actual_groq_api_key
     GROQ_MODEL=llama-3.3-70b-versatile
     MONGODB_URI=mongodb://localhost:27017
     ```

4. Populate ChromaDB Vector Store:
   Run the database loader to load the 30 realistic dummy schemes into the local vector storage:
   ```bash
   python -m backend.vector_db.chroma_loader
   ```

5. Start the FastAPI Server:
   ```bash
   python -m uvicorn backend.main:app --port 8000 --reload
   ```
   The backend will start running on **`http://127.0.0.1:8000`**.
   - Access Swagger API documentation at: **`http://127.0.0.1:8000/docs`**
   - Access Redoc documentation at: **`http://127.0.0.1:8000/redoc`**

---

### 3. Frontend Setup & Run

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite Development Server:
   ```bash
   npm run dev
   ```
   The frontend will start running on **`http://localhost:5173`**.

---

## 🔗 Frontend to Backend Integration

In Phase 1, the frontend React application utilizes mock data defined in `frontend/src/data/dummyData.js` to manage chat sessions and messages locally inside `frontend/src/App.jsx`.

To integrate the frontend with this new FastAPI backend (which matches the React state interfaces perfectly):
- Replace the local functions (`handleSendMessage`, `handleNewChat`, `handleDeleteConfirm`, `handleSelectChat`, `handlePinChat`) in `frontend/src/App.jsx` with async `fetch` or `axios` calls pointing to the backend API (`http://localhost:8000`).
- The backend responses for chat detailed history and new message responses map directly to the frontend's schemas (`id`, `title`, `isPinned`, `timestamp`, and messages with `sender: "user"/"ai"` and `text`).

---

## 🔒 Error Handling
The backend is resilient to the following edge cases:
- **Missing API Keys**: Logs a clean warning on startup if `GROQ_API_KEY` is not set.
- **Empty Messages**: Returns a `400 Bad Request` if blank input is submitted.
- **Invalid IDs**: Validates that chat IDs conform to MongoDB `ObjectId` structure before querying the database, returning a `400 Bad Request` or `404 Not Found` rather than crashing.
- **Offline Services**: Fallbacks to human-friendly warning text if Groq requests fail.
