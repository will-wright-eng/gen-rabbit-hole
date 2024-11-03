from typing import Dict, Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from pydantic import BaseModel, Field

class UserProgress(BaseModel):
    completed_nodes: List[UUID] = Field(default_factory=list)
    current_node_id: Optional[UUID] = None
    last_interaction: datetime = Field(default_factory=datetime.now)

class LearningSession(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: str
    tree_id: UUID
    progress: UserProgress = Field(default_factory=UserProgress)
    context: Dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    def mark_node_completed(self, node_id: UUID):
        if node_id not in self.progress.completed_nodes:
            self.progress.completed_nodes.append(node_id)
            self.progress.last_interaction = datetime.now()
            self.updated_at = datetime.now()
    
    def set_current_node(self, node_id: UUID):
        self.progress.current_node_id = node_id
        self.progress.last_interaction = datetime.now()
        self.updated_at = datetime.now()
    
    def update_context(self, new_context: Dict):
        self.context.update(new_context)
        self.updated_at = datetime.now()

class SessionManager:
    def __init__(self):
        self.sessions: Dict[UUID, LearningSession] = {}
    
    def create_session(self, user_id: str, tree_id: UUID) -> LearningSession:
        session = LearningSession(
            user_id=user_id,
            tree_id=tree_id
        )
        self.sessions[session.id] = session
        return session
    
    def get_session(self, session_id: UUID) -> Optional[LearningSession]:
        return self.sessions.get(session_id)
    
    def get_user_sessions(self, user_id: str) -> List[LearningSession]:
        return [
            session for session in self.sessions.values()
            if session.user_id == user_id
        ]
    
    def update_session(self, session: LearningSession):
        if session.id in self.sessions:
            self.sessions[session.id] = session
            return True
        return False
    
    def delete_session(self, session_id: UUID) -> bool:
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
