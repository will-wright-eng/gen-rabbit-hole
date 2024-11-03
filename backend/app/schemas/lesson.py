
from pydantic import BaseModel


class Lesson(BaseModel):
    id: str
    title: str
    content: str
    order: int
    milestone_id: str
    estimated_duration: int
    prerequisites: list[str]

class LessonProgress(BaseModel):
    lesson_id: str
    is_completed: bool
    checklist_items: list[str]
    user_ready: bool
