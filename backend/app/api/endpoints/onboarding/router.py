# app/api/endpoints/onboarding/router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import AIService


router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])
ai_service = AIService()


class OnboardingRequest(BaseModel):
    learning_topic: str
    end_goal: str


class Answer(BaseModel):
    question: str
    answer: str


def get_initial_questions() -> list[dict]:
    """Return the initial set of onboarding questions."""
    return [
        {
            "id": "q1",
            "question": "What's your current experience level?",
            "type": "select",
            "options": [
                {"value": "beginner", "label": "Beginner - New to programming"},
                {"value": "intermediate", "label": "Intermediate - Some programming experience"},
                {"value": "advanced", "label": "Advanced - Experienced programmer"},
            ],
        },
        {
            "id": "q2",
            "question": "How much time can you dedicate per week?",
            "type": "select",
            "options": [
                {"value": "2-4", "label": "2-4 hours"},
                {"value": "5-10", "label": "5-10 hours"},
                {"value": "10+", "label": "10+ hours"},
            ],
        },
        {
            "id": "q3",
            "question": "What's your preferred learning style?",
            "type": "select",
            "options": [
                {"value": "practical", "label": "Hands-on projects"},
                {"value": "theoretical", "label": "Theory first, then practice"},
                {"value": "mixed", "label": "Mix of both"},
            ],
        },
    ]


@router.get("/start")
async def get_onboarding():
    """Get the initial onboarding questions."""
    return get_initial_questions()


@router.post("/start")
async def start_onboarding(request: OnboardingRequest) -> list[dict]:
    """Start the onboarding process with initial topic and goal."""
    return get_initial_questions()


@router.post("/generate-roadmap")
async def generate_roadmap(request: OnboardingRequest) -> dict:
    """Generate the final learning roadmap."""
    try:
        # Format the context
        context = "\n".join(
            [
                f"Learning Topic: {request.learning_topic}",
                f"End Goal: {request.end_goal}",
            ],
        )

        prompt = f"""Based on this context, create a detailed learning roadmap:
        {context}

        Create a step-by-step learning plan that includes:
        1. Clear milestones and lessons
        2. Brief descriptions of what will be learned
        3. Specific tasks or exercises to practice
        4. Estimated time commitments
        5. Prerequisites and dependencies between topics
        6. Key concepts to master

        Focus on practical, hands-on learning with clear progression.
        """

        # Use the ai service to generate the roadmap
        response = await ai_service.generate(prompt)
        return {"content": response}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
