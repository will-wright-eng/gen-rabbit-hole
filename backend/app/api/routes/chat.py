from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from models.context import LearningContext
from services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

class ChatMessage(BaseModel):
    role: str
    content: str

@router.post("/questions")
async def generate_next_question(messages: List[ChatMessage]):
    """Generate follow-up question based on chat history"""
    context = LearningContext()
    for msg in messages:
        context.add_message(msg.role, msg.content)
    
    next_question = await llm_service.generate_next_question(context)
    return {"question": next_question} 