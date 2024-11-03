
from fastapi import APIRouter

from app.services.lesson_service import LessonService


router = APIRouter(prefix="/api/lessons", tags=["lessons"])
lesson_service = LessonService()


@router.get("/{lesson_id}")
async def get_lesson(lesson_id: str) -> dict:
    return await lesson_service.get_lesson(lesson_id)


@router.post("/{lesson_id}/complete")
async def complete_lesson(lesson_id: str) -> dict:
    return await lesson_service.mark_lesson_complete(lesson_id)


@router.post("/{lesson_id}/checklist")
async def update_checklist(lesson_id: str, checklist: list[str]) -> dict:
    return await lesson_service.update_checklist(lesson_id, checklist)


@router.get("/{lesson_id}/quiz")
async def get_lesson_quiz(lesson_id: str) -> dict:
    return await lesson_service.get_quiz(lesson_id)
