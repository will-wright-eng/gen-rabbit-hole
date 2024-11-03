from typing import List, Dict, Optional
from uuid import UUID, uuid4
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class NodeType(str, Enum):
    CHAT = "chat"
    LESSON = "lesson"
    TASK = "task"
    QUIZ = "quiz"

class NodeStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Node(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    title: str
    content: str
    type: NodeType
    status: NodeStatus = NodeStatus.PENDING
    children: List[UUID] = Field(default_factory=list)
    parent_id: Optional[UUID] = None
    context: Dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    depth: int = 0

    def add_child(self, node: 'Node'):
        node.depth = self.depth + 1  # Set child depth
        self.children.append(node)

class Tree(BaseModel):
    root_id: UUID
    nodes: Dict[UUID, Node] = Field(default_factory=dict)
    
    def add_node(self, node: Node, parent_id: Optional[UUID] = None) -> UUID:
        if parent_id and parent_id in self.nodes:
            node.parent_id = parent_id
            self.nodes[parent_id].children.append(node.id)
        
        self.nodes[node.id] = node
        return node.id
    
    def get_node(self, node_id: UUID) -> Optional[Node]:
        return self.nodes.get(node_id)
    
    def get_children(self, node_id: UUID) -> List[Node]:
        node = self.nodes.get(node_id)
        if not node:
            return []
        return [self.nodes[child_id] for child_id in node.children]
    
    def update_node_status(self, node_id: UUID, status: NodeStatus) -> bool:
        if node_id in self.nodes:
            self.nodes[node_id].status = status
            self.nodes[node_id].updated_at = datetime.now()
            return True
        return False
