import logging
from datetime import datetime
from bson import ObjectId
from typing import List, Dict, Any, Optional
from fastapi import HTTPException

from backend.database.mongodb import get_db
from backend.services.ai_service import ai_service
from backend.services.rag_service import rag_service

logger = logging.getLogger(__name__)

def format_timestamp(dt: datetime) -> str:
    """Formats datetime to a human-friendly string for the sidebar."""
    now = datetime.now()
    diff = now - dt
    if diff.days == 0:
        if now.day == dt.day:
            return "Today"
        return "Yesterday"
    elif diff.days == 1:
        return "Yesterday"
    elif diff.days < 7:
        return dt.strftime("%A")  # e.g., "Monday"
    else:
        return dt.strftime("%B %d")  # e.g., "July 18"

def format_message_time(dt: datetime) -> str:
    """Formats message datetime to match the frontend's '10:30 AM' style."""
    return dt.strftime("%I:%M %p").lstrip('0')

class ChatService:
    async def create_new_chat(self, title: str = "New Assistant Chat") -> str:
        """Creates a new empty chat in MongoDB and returns its ID."""
        db = get_db()
        now = datetime.now()
        chat_doc = {
            "title": title,
            "is_pinned": False,
            "created_at": now,
            "updated_at": now
        }
        result = await db.chats.insert_one(chat_doc)
        logger.info(f"Created new chat in DB with ID: {result.inserted_id}")
        return str(result.inserted_id)

    async def get_chats_history(self) -> List[Dict[str, Any]]:
        """Returns all chats sorted by pinned state and updated time, formatted for sidebar."""
        db = get_db()
        
        # Sort by is_pinned descending, then updated_at descending
        cursor = db.chats.find().sort([("is_pinned", -1), ("updated_at", -1)])
        chats = await cursor.to_list(length=100)
        
        history = []
        for chat in chats:
            history.append({
                "id": str(chat["_id"]),
                "title": chat.get("title", "New Assistant Chat"),
                "timestamp": format_timestamp(chat.get("updated_at", datetime.now())),
                "isPinned": chat.get("is_pinned", False)
            })
        return history

    async def get_chat_detail(self, chat_id: str) -> Dict[str, Any]:
        """Returns the full chat metadata and list of messages for a chat ID."""
        db = get_db()
        
        try:
            oid = ObjectId(chat_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Chat ID format")
            
        chat = await db.chats.find_one({"_id": oid})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        # Get messages for this chat
        cursor = db.messages.find({"chat_id": chat_id}).sort("timestamp", 1)
        messages_docs = await cursor.to_list(length=200)
        
        messages = []
        for msg in messages_docs:
            sender = "ai" if msg.get("role") == "assistant" else "user"
            messages.append({
                "sender": sender,
                "text": msg.get("content", ""),
                "timestamp": format_message_time(msg.get("timestamp", datetime.now()))
            })
            
        return {
            "id": str(chat["_id"]),
            "title": chat.get("title", "New Assistant Chat"),
            "timestamp": format_timestamp(chat.get("updated_at", datetime.now())),
            "isPinned": chat.get("is_pinned", False),
            "messages": messages
        }

    async def delete_chat(self, chat_id: str) -> bool:
        """Deletes a chat and all its related messages."""
        db = get_db()
        try:
            oid = ObjectId(chat_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Chat ID format")
            
        # Verify chat exists
        chat = await db.chats.find_one({"_id": oid})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        # Delete messages first
        await db.messages.delete_many({"chat_id": chat_id})
        # Delete chat
        await db.chats.delete_one({"_id": oid})
        logger.info(f"Deleted chat {chat_id} and all related messages.")
        return True

    async def save_message(self, chat_id: str, role: str, content: str) -> Dict[str, Any]:
        """Saves a single message to MongoDB and updates the chat's updated_at field."""
        db = get_db()
        now = datetime.now()
        
        message_doc = {
            "chat_id": chat_id,
            "role": role,  # "user" or "assistant"
            "content": content,
            "timestamp": now
        }
        await db.messages.insert_one(message_doc)
        
        # Update chat updated_at timestamp
        try:
            await db.chats.update_one(
                {"_id": ObjectId(chat_id)},
                {"$set": {"updated_at": now}}
            )
        except Exception as e:
            logger.error(f"Failed to update chat timestamp: {e}")
            
        return message_doc

    async def generate_chat_reply(self, chat_id: str, message_text: str) -> Dict[str, Any]:
        """
        Orchestrates the entire message flow:
        1. Save User Message
        2. Retrieve Chat History Context
        3. Search Vector Database (ChromaDB) for schemes
        4. Call Groq API
        5. Save Assistant Message
        6. Update title dynamically if it's the first message
        """
        db = get_db()
        try:
            oid = ObjectId(chat_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Chat ID format")
            
        chat = await db.chats.find_one({"_id": oid})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        # 1. Save user message
        await self.save_message(chat_id, "user", message_text)
        
        # 2. Get past chat messages to provide context to Groq
        cursor = db.messages.find({"chat_id": chat_id}).sort("timestamp", 1)
        history_docs = await cursor.to_list(length=20) # Keep history concise
        
        # Formulate history for Groq
        chat_history = []
        # Exclude the message we just added to keep it separate or include it
        # Actually, let's include all previous messages (except the current one if we pass it separately,
        # but the prompt says: system prompt -> chat history -> retrieved documents -> current user question.
        # So chat_history should have all previous messages, excluding the current one).
        for doc in history_docs[:-1]:
            chat_history.append({
                "role": doc.get("role"),
                "content": doc.get("content")
            })

        # 3. Retrieve relevant government schemes using RAG Service
        retrieved_schemes = await rag_service.retrieve_relevant_schemes(message_text, limit=4)
        
        # 4. Generate response using Groq AI Service
        try:
            ai_reply = await ai_service.generate_response(
                user_message=message_text,
                chat_history=chat_history,
                retrieved_schemes=retrieved_schemes
            )
        except Exception as e:
            logger.error(f"Failed to generate AI reply: {e}")
            # Save a friendly error message
            ai_reply = (
                "### ⚠️ Connection Error\n\n"
                "I'm sorry, I'm currently having trouble connecting to my AI brain (Groq). "
                "Please make sure the GROQ_API_KEY environment variable is configured correctly and try again."
            )
            
        # 5. Save assistant message
        saved_ai_msg = await self.save_message(chat_id, "assistant", ai_reply)
        
        # 6. Update title dynamically if this was the first message
        # Let's count how many user messages are in this chat
        user_msg_count = await db.messages.count_documents({"chat_id": chat_id, "role": "user"})
        if user_msg_count == 1:
            # First message, update title
            new_title = message_text[:30] + "..." if len(message_text) > 30 else message_text
            await db.chats.update_one(
                {"_id": oid},
                {"$set": {"title": new_title}}
            )
            logger.info(f"Updated title of chat {chat_id} to '{new_title}'")

        # Return formatted message response
        return {
            "sender": "ai",
            "text": ai_reply,
            "timestamp": format_message_time(saved_ai_msg["timestamp"])
        }

    async def toggle_pin_chat(self, chat_id: str) -> bool:
        """Toggles the pinned status of a chat."""
        db = get_db()
        try:
            oid = ObjectId(chat_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Chat ID format")
            
        chat = await db.chats.find_one({"_id": oid})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        new_pinned = not chat.get("is_pinned", False)
        await db.chats.update_one(
            {"_id": oid},
            {"$set": {"is_pinned": new_pinned}}
        )
        logger.info(f"Toggled pin state for chat {chat_id} to {new_pinned}")
        return new_pinned

chat_service = ChatService()
