from typing import Dict, List
from pydantic import BaseModel, Field
from datetime import datetime

class LearningContext(BaseModel):
    chat_history: List[Dict[str, str]] = Field(default_factory=list)
    
    def add_message(self, role: str, content: str):
        self.chat_history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
    
    def to_dict(self) -> Dict:
        """Convert context to a dictionary for prompt insertion"""
        return {
            "conversation_length": len(self.chat_history)
        } 