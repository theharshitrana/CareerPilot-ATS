from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.interview_service import (
    generate_questions,
    evaluate_answer,
)


router = APIRouter()


class InterviewStartRequest(BaseModel):
    resume_text: str = Field(..., min_length=10)
    role: str = "Software Engineer"
    job_description: str = ""
    required_keywords: list[str] = []
    preferred_keywords: list[str] = []


class InterviewEvaluateRequest(BaseModel):
    question: str = Field(..., min_length=3)
    answer: str = Field(..., min_length=1)


@router.post("/start")
def start_interview(
    request: InterviewStartRequest
):

    if not request.resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text is required.",
        )

    questions = generate_questions(
        resume_text=request.resume_text,
        role=request.role,
        job_description=request.job_description,
        required_keywords=request.required_keywords,
        preferred_keywords=request.preferred_keywords,
    )

    return {
        "success": True,
        "role": request.role,
        "total_questions": len(questions),
        "questions": questions,
    }


@router.post("/evaluate")
def evaluate_interview(
    request: InterviewEvaluateRequest
):

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer is required.",
        )

    return evaluate_answer(
        request.question,
        request.answer,
    )
