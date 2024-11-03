from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from uuid import UUID

from services.tree_service import TreeService
from services.llm_service import LLMService
from models.session import SessionManager
from models.tree import NodeStatus, Tree, Node
from models.context import LearningContext

# Initialize services
router = APIRouter()
session_manager = SessionManager()
llm_service = LLMService()
tree_service = TreeService(llm_service)

# Request/Response Models
from pydantic import BaseModel

class ChatMessage(BaseModel):
    content: str

class CreateSessionRequest(BaseModel):
    user_id: str
    chat_history: List[Dict[str, str]]

class NodeUpdateRequest(BaseModel):
    status: NodeStatus

@router.post("/chat/questions")
async def generate_next_question(messages: List[ChatMessage]):
    """Generate follow-up question based on chat history"""
    context = LearningContext()
    for msg in messages:
        context.add_message("user" if msg.role == "user" else "assistant", msg.content)
    
    next_question = await llm_service.generate_next_question(context)
    return {"question": next_question}

@router.post("/sessions")
async def create_session(request: CreateSessionRequest):
    """Create new learning session with generated tree"""
    try:
        # Create learning context from chat history
        context = LearningContext()
        for msg in request.chat_history:
            context.add_message(msg["role"], msg["content"])
        
        # Generate learning tree using context
        tree = await tree_service.create_tree(context)
        
        # Create session
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

@router.get("/sessions/{session_id}")
async def get_session(session_id: UUID):
    """Get session details"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/nodes/{node_id}/expand")
async def expand_node(session_id: UUID, node_id: UUID):
    """Expand a node to generate next steps"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        # Create a new tree if not exists (temporary for demo)
        tree = await tree_service.create_tree([])
        expanded_nodes = await tree_service.expand_node(tree, node_id)
        return {"nodes": expanded_nodes}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/sessions/{session_id}/nodes/{node_id}")
async def update_node_status(
    session_id: UUID,
    node_id: UUID,
    request: NodeUpdateRequest
):
    """Update node status (e.g., mark as completed)"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Create a new tree if not exists (temporary for demo)
    tree = await tree_service.create_tree([])
    success = tree_service.update_progress(tree, node_id, request.status)
    
    if not success:
        raise HTTPException(status_code=404, detail="Node not found")
    
    if request.status == NodeStatus.COMPLETED:
        session.mark_node_completed(node_id)
    
    return {"status": "success"}

@router.get("/sessions/{session_id}/progress")
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
