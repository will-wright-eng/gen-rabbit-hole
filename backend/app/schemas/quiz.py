
from pydantic import BaseModel


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    correct_answer: str

class Quiz(BaseModel):
    id: str
    lesson_id: str
    questions: list[QuizQuestion]
