from typing import Any

from app.schemas.onboarding import OnboardingState, Question


class OnboardingService:
    async def get_initial_questions(self, topic: str, goal: str) -> list[Question]:
        """Generate dynamic questions based on the topic and goal."""
        # This would typically call the AI service to generate relevant questions
        # For now, returning a sample question
        return [
            Question(
                id="experience_level",
                question=f"What's your current experience level with {topic}?",
                type="select",
                options=[
                    {"value": "beginner", "label": "Beginner"},
                    {"value": "intermediate", "label": "Intermediate"},
                    {"value": "advanced", "label": "Advanced"},
                ],
                can_skip=True,
            ),
        ]

    async def get_next_questions(self, state: OnboardingState) -> list[Question]:
        """Generate next questions based on previous answers."""
        # This would analyze previous answers and generate relevant follow-up questions
        # For demonstration, returning a contextual question
        if not state.answers:
            return []

        last_answer = state.answers[-1]
        if last_answer.skipped:
            # If user skipped, generate alternative question path
            return []

        # Example of dynamic question generation based on previous answer
        if last_answer.question_id == "experience_level" and last_answer.answer == "beginner":
            return [
                Question(
                    id="learning_style",
                    question="How do you prefer to learn?",
                    type="select",
                    options=[
                        {"value": "visual", "label": "Visual learning"},
                        {"value": "practical", "label": "Hands-on projects"},
                        {"value": "theoretical", "label": "Theoretical concepts first"},
                    ],
                    can_skip=True,
                ),
            ]

        return []

    async def generate_roadmap(self, state: OnboardingState) -> dict[str, Any]:
        """Generate final roadmap based on all answers."""
        return {
            "topic": state.learning_topic,
            "goal": state.end_goal,
            "answers": [answer.dict() for answer in state.answers],
            # This would be expanded with AI-generated roadmap
            "steps": [],
        }
