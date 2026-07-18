from fastapi import APIRouter, HTTPException, Depends
from backend.models.chat import NewChatResponse, ChatMessageRequest, ChatMessageResponse, ChatDetailResponse
from backend.services.chat_service import chat_service

router = APIRouter()

@router.post("/new-chat", response_model=NewChatResponse, summary="Create a new chat session")
async def new_chat():
    try:
        chat_id = await chat_service.create_new_chat()
        return NewChatResponse(chat_id=chat_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create chat: {str(e)}")

@router.post("/chat", response_model=ChatMessageResponse, summary="Send message and receive RAG-enhanced AI reply")
async def send_message(request: ChatMessageRequest):
    # Validation for empty messages
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    try:
        reply = await chat_service.generate_chat_reply(request.chat_id, request.message)
        return ChatMessageResponse(**reply)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.get("/chat/{chat_id}", response_model=ChatDetailResponse, summary="Retrieve a full chat conversation detail")
async def get_chat(chat_id: str):
    try:
        chat_detail = await chat_service.get_chat_detail(chat_id)
        return ChatDetailResponse(**chat_detail)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat details: {str(e)}")

@router.delete("/chat/{chat_id}", summary="Delete a chat session and all its messages")
async def delete_chat(chat_id: str):
    try:
        await chat_service.delete_chat(chat_id)
        return {"status": "success", "message": f"Chat {chat_id} and related messages deleted successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chat: {str(e)}")

@router.post("/chat/{chat_id}/pin", summary="Toggle pin state of a chat session")
async def toggle_pin(chat_id: str):
    try:
        pinned_state = await chat_service.toggle_pin_chat(chat_id)
        return {"status": "success", "isPinned": pinned_state}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle pin state: {str(e)}")
