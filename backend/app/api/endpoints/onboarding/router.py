
from fastapi import APIRouter, HTTPException

from schemas.onboarding import InitialResponse, OnboardingState, Question
from services.onboarding_service import OnboardingService


router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])
onboarding_service = OnboardingService()


@router.post("/start", response_model=list[Question])
async def start_onboarding(initial_response: InitialResponse) -> list[Question]:
    """Start the onboarding process with initial topic and goal."""
    try:
        return await onboarding_service.get_initial_questions(
            initial_response.learning_topic,
            initial_response.end_goal,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/next-questions", response_model=list[Question])
async def get_next_questions(state: OnboardingState) -> list[Question]:
    """Get next set of questions based on previous answers."""
    try:
        return await onboarding_service.get_next_questions(state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/generate-roadmap")
async def generate_roadmap(state: OnboardingState) -> dict:
    """Generate the final learning roadmap."""
    try:
        return await onboarding_service.generate_roadmap(state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
