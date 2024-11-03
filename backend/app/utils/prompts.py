from typing import Dict, List
import json

class PromptTemplates:
    @staticmethod
    def initial_assessment() -> str:
        return """Based on the conversation history, create an initial learning assessment.
Return a JSON object summarizing the user's:
{
    "primary_goal": "Main learning objective",
    "knowledge_level": "Current expertise level",
    "learning_style": "Observed preferences",
    "session_length": "Estimated time per session",
    "engagement_style": "Preferred learning approach"
}"""

    @staticmethod
    def generate_curriculum() -> str:
        return """Based on the conversation history, create a structured learning path.
Each node should teach exactly ONE clear concept.

Return a JSON array of learning nodes:
[
    {
        "title": "Single clear concept",
        "content": "Focused explanation",
        "type": "lesson/task/quiz"
    }
]"""

    @staticmethod
    def expand_node(node_title: str, node_content: str, context: Dict) -> str:
        return f"""Current Learning Context:
Current Topic: {node_title}
Current Content: {node_content}
Node Depth: {context.get('node_depth', 0)}

User Profile:
- Goal: {context.get('primary_goal', 'Learning chess openings')}
- Level: {context.get('knowledge_level', 'Beginner')}
- Style: {context.get('learning_style', 'Interactive')}
- Session Length: {context.get('session_length', '10')} minutes

Generate exactly 3 follow-up learning nodes that build upon "{node_title}".
Each node should teach ONE clear concept and be formatted as a JSON object.

Return a JSON array of exactly 3 nodes:
[
    {{
        "title": "Clear, specific concept title",
        "content": "Detailed explanation of the concept",
        "type": "lesson"
    }},
    {{
        "title": "Next concept title",
        "content": "Explanation of this concept",
        "type": "task"
    }},
    {{
        "title": "Final concept title",
        "content": "Explanation of the concept",
        "type": "quiz"
    }}
]"""

    @staticmethod
    def generate_next_question() -> str:
        return """Based on the conversation so far, ask a relevant follow-up question to better understand the user's:
        - Learning goals
        - Current knowledge level
        - Learning style preferences
        - Time availability
        
        Ask only one clear, focused question.
        
        Chat history:
        {}"""