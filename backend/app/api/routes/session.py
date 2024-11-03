from fastapi import APIRouter, HTTPException
from typing import List, Dict
from uuid import UUID
from pydantic import BaseModel
from models.session import SessionManager
from models.context import LearningContext
from services.tree_service import TreeService
from services.llm_service import LLMService

router = APIRouter()
session_manager = SessionManager()
llm_service = LLMService()
tree_service = TreeService(llm_service)

class CreateSessionRequest(BaseModel):
    user_id: str
    chat_history: List[Dict[str, str]]

@router.post("")
async def create_session(request: CreateSessionRequest):
    """Create new learning session with generated tree"""
    try:
        context = LearningContext()
        for msg in request.chat_history:
            context.add_message(msg["role"], msg["content"])
        
        tree = await tree_service.create_tree(context)
        session = session_manager.create_session(
            user_id=request.user_id,
            tree_id=tree.root_id
        )
        
        return {
            "session_id": session.id,
            "tree": tree,
            "assessment": await llm_service.generate_initial_assessment(context)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}")
async def get_session(session_id: UUID):
    """Get session details"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/{session_id}/progress")
async def get_progress(session_id: UUID):
    """Get learning progress for a session"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "completed_nodes": session.progress.completed_nodes,
        "current_node": session.progress.current_node_id,
        "last_interaction": session.progress.last_interaction
    } 