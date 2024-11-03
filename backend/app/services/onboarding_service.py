from typing import Any

from app.schemas.onboarding import OnboardingState, Question
from app.services.ai_service import AIService


class OnboardingService:
    def __init__(self) -> None:
        self.ai_service = AIService()

    async def get_initial_questions(self, topic: str, goal: str) -> list[Question]:
        """Generate dynamic questions based on the topic and goal."""
        context = {"topic": topic, "goal": goal, "answers": []}

        questions = await self.ai_service.generate_questions(context)
        return [Question(**q) for q in questions]

    async def get_next_questions(self, state: OnboardingState) -> list[Question]:
        """Generate next questions based on previous answers."""
        context = {
            "topic": state.learning_topic,
            "goal": state.end_goal,
            "answers": [answer.dict() for answer in state.answers],
        }

        questions = await self.ai_service.generate_questions(context)
        return [Question(**q) for q in questions]

    async def generate_roadmap(self, state: OnboardingState) -> dict[str, Any]:
        """Generate final roadmap based on all answers."""
        return await self.ai_service.generate_roadmap(state.dict())
