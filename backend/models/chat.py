from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class NewChatResponse(BaseModel):
    chat_id: str

class ChatCreate(BaseModel):
    title: Optional[str] = "New Assistant Chat"

class ChatMessageRequest(BaseModel):
    chat_id: str
    message: str

class ChatMessageResponse(BaseModel):
    sender: str  # "user" or "ai"
    text: str
    timestamp: str

class ChatSidebarResponse(BaseModel):
    id: str
    title: str
    timestamp: str  # e.g., "Today", "Yesterday", "July 18"
    isPinned: bool

class ChatDetailResponse(BaseModel):
    id: str
    title: str
    timestamp: str
    isPinned: bool
    messages: List[ChatMessageResponse] = []
