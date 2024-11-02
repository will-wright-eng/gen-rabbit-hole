from typing import Any

from pydantic import BaseModel


class InitialResponse(BaseModel):
    learning_topic: str
    end_goal: str

class Question(BaseModel):
    id: str
    question: str
    type: str  # "text", "select", "multiselect"
    options: list[dict[str, str]] | None = None  # For select/multiselect
    info: str | None = None  # Additional info about the question

class OnboardingState(BaseModel):
    learning_topic: str
    end_goal: str
    answers: dict[str, Any] = {}
