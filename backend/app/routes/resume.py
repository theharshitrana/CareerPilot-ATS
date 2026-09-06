from pathlib import Path
from app.services.skill_extractor import extract_skill_details
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.resume_parser import (
    extract_text,
    analyze_resume_text
)

from app.services.skill_extractor import (
    extract_skill_details
)


router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    allowed_extensions = {".pdf", ".docx"}

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX resumes are supported."
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required."
        )

    file_path = UPLOAD_DIR / file.filename

    try:

        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded resume is empty."
            )

        file_path.write_bytes(content)

        # Extract resume text
        resume_text = extract_text(
            str(file_path)
        )

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the resume."
            )

        # Resume structure analysis
        analysis = analyze_resume_text(
            resume_text
        )

        # Automatic skill detection
        skill_details = extract_skill_details(
            resume_text
        )

        # Add skills to analysis
        analysis.update(
            skill_details
        )

        return {
            "success": True,

            "filename": file.filename,

            "text_length": len(
                resume_text
            ),

            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(e)}"
        )
