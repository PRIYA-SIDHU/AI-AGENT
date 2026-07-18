from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.chat import ChatSidebarResponse
from backend.services.chat_service import chat_service

router = APIRouter()

@router.get("/history", response_model=List[ChatSidebarResponse], summary="Retrieve all chat sessions for the sidebar list")
async def get_history():
    try:
        chats = await chat_service.get_chats_history()
        return [ChatSidebarResponse(**chat) for chat in chats]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve chat history: {str(e)}")
