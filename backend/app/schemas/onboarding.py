from typing import Any

from pydantic import BaseModel, Field


class InitialResponse(BaseModel):
    learning_topic: str = Field(..., description="What do you want to learn?")
    end_goal: str = Field(..., description="What is your end goal?")


class Question(BaseModel):
    id: str
    question: str
    type: str  # "text", "select", "multiselect"
    options: list[dict[str, str]] | None = None
    info: str | None = None
    can_skip: bool = True


class Answer(BaseModel):
    question_id: str
    answer: Any
    skipped: bool = False


class OnboardingState(BaseModel):
    learning_topic: str
    end_goal: str
    answers: list[Answer] = []
