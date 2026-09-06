from fastapi import APIRouter, HTTPException

from app.models.schemas import JobMatchRequest
from app.services.job_matcher import match_job


router = APIRouter()


@router.post("/match")
def job_match(request: JobMatchRequest):

    if not request.resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text is required."
        )

    return match_job(
        request.resume_text,
        request.job
    )
