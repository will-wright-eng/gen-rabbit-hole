from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from pydantic import BaseModel
from models.session import SessionManager
from models.tree import NodeStatus
from services.tree_service import TreeService
from services.llm_service import LLMService

router = APIRouter()
session_manager = SessionManager()
llm_service = LLMService()
tree_service = TreeService(llm_service)

class NodeUpdateRequest(BaseModel):
    status: NodeStatus

@router.post("/{tree_id}/nodes/{node_id}/expand")
async def expand_node(tree_id: UUID, node_id: UUID):
    """Expand a node to generate next steps"""
    try:
        # Create a new tree if not exists (temporary for demo)
        tree = await tree_service.create_tree([])
        expanded_nodes = await tree_service.expand_node(tree, node_id)
        return {"nodes": expanded_nodes}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{tree_id}/nodes/{node_id}")
async def update_node_status(
    tree_id: UUID,
    node_id: UUID,
    request: NodeUpdateRequest
):
    """Update node status (e.g., mark as completed)"""
    try:
        tree = await tree_service.create_tree([])
        success = tree_service.update_progress(tree, node_id, request.status)
        
        if not success:
            raise HTTPException(status_code=404, detail="Node not found")
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 