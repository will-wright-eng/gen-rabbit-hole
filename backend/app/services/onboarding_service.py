from typing import Any

from app.schemas.onboarding import OnboardingState, Question


class OnboardingService:
    def __init__(self) -> None:
        # This would eventually load from a database or files
        self.question_banks = self._load_question_banks()

    def _load_question_banks(self) -> dict:
        # Example hardcoded questions for demonstration
        return {
            "python": {
                "job": [
                    Question(
                        id="python_role",
                        question="What type of Python role interests you?",
                        type="select",
                        options=[
                            {"value": "backend", "label": "Backend Developer"},
                            {"value": "data", "label": "Data Analyst"},
                            {"value": "ml", "label": "Machine Learning Engineer"},
                        ],
                        info="Different Python roles require different skill sets",
                    ),
                ],
            },
        }

    def get_initial_questions(self, topic: str, goal: str) -> list[Question]:
        """Get the first set of questions based on topic and goal."""
        if topic.lower() not in self.question_banks:
            msg = f"No question bank found for topic: {topic}"
            raise ValueError(msg)

        return self.question_banks[topic.lower()].get(goal.lower(), [])

    def get_next_questions(self, state: OnboardingState) -> list[Question]:
        """Get next questions based on previous answers."""
        # This will be implemented based on logic we define
        return []

    def generate_roadmap(self, state: OnboardingState) -> dict[str, Any]:
        """Generate final roadmap based on all answers."""
        # This will be implemented with AI service integration
        return {
            "topic": state.learning_topic,
            "goal": state.end_goal,
            "steps": ["Step 1", "Step 2", "Step 3"],  # Placeholder
        }
