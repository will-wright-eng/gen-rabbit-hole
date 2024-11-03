from fastapi import APIRouter
from .session import router as session_router
from .tree import router as tree_router
from .chat import router as chat_router

# Create main router
router = APIRouter()

# Include sub-routers with prefixes
router.include_router(session_router, prefix="/sessions", tags=["Sessions"])
router.include_router(tree_router, prefix="/trees", tags=["Trees"])
router.include_router(chat_router, prefix="/chat", tags=["Chat"]) 