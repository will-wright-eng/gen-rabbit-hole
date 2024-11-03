# app/api/endpoints/tree/router.py

from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel

from app.services.ai_service import AIService
from app.services.tree_service import TreeService


router = APIRouter(prefix="/api/tree", tags=["tree"])
ai_service = AIService()
tree_service = TreeService(ai_service)


class TreeNode(BaseModel):
    id: str
    title: str
    content: str
    type: str = "lesson"
    children: list[str] = []
    status: str = "pending"
    prerequisites: list[str] = []
    depth: int = 0


class TreeResponse(BaseModel):
    root: TreeNode
    nodes: dict[str, TreeNode]


class NodeIdRequest(BaseModel):
    node_id: str


@router.get("/{user_id}")
async def get_tree(user_id: str) -> TreeResponse:
    """Get the current learning tree for a user."""
    try:
        tree_data = await tree_service.get_tree(user_id)
        return TreeResponse(
            root=TreeNode(**tree_data["root"]), nodes={k: TreeNode(**v) for k, v in tree_data["nodes"].items()},
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{user_id}/expand")
async def expand_node(user_id: str, node_id: str = Body(..., embed=True)) -> list[str]:
    """Dynamically expand a node in the tree."""
    try:
        return await tree_service.expand_node(user_id, node_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
