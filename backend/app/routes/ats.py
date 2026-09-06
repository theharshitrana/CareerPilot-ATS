from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.resume_parser import extract_text, analyze_resume_text
from app.services.skill_extractor import extract_skills
from app.services.education_matcher import education_matches
from app.services.job_requirement_analyzer import analyze_job_requirements
from app.services.job_matcher import find_matches, calculate_keyword_score
from app.services.experience_matcher import match_experience
from app.services.contextual_matcher import contextual_match


router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def semantic_requirement_analysis(
    resume_text: str,
    requirements: list[str],
    exact_matched: list[str],
    threshold: float = 55.0
):
    """
    Use contextual semantic matching only for requirements
    that were not already matched exactly.

    This prevents double-counting exact matches.
    """

    semantic_matches = []
    semantic_missing = []
    semantic_details = []

    exact_set = {
        item.lower().strip()
        for item in exact_matched
    }

    for requirement in requirements:

        if not requirement.strip():
            continue

        if requirement.lower().strip() in exact_set:
            continue

        result = contextual_match(
            resume_text,
            requirement,
            threshold
        )

        semantic_details.append(result)

        if result["matched"]:
            semantic_matches.append(requirement)
        else:
            semantic_missing.append(requirement)

    return (
        semantic_matches,
        semantic_missing,
        semantic_details
    )


@router.post("/analyze")
async def analyze_resume_for_job(
    file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(""),
    required_keywords: str = Form(""),
    preferred_keywords: str = Form(""),
    education: str = Form(""),
    experience_min: int = Form(0),
    experience_max: int | None = Form(None)
):

    # -----------------------------------------
    # Validate file
    # -----------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required."
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    # -----------------------------------------
    # Convert HR strings to lists
    # -----------------------------------------

    required = [
        item.strip()
        for item in required_keywords.split(",")
        if item.strip()
    ]

    preferred = [
        item.strip()
        for item in preferred_keywords.split(",")
        if item.strip()
    ]

    education_list = [
        item.strip()
        for item in education.split(",")
        if item.strip()
    ]

    # -----------------------------------------
    # Analyze job requirements
    # -----------------------------------------

    job_requirements = analyze_job_requirements(
        job_title=job_title,
        job_description=job_description,
        required_keywords=required,
        preferred_keywords=preferred,
        education=education_list,
        experience_min=experience_min,
        experience_max=experience_max
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

        # -------------------------------------
        # Extract resume
        # -------------------------------------

        resume_text = extract_text(
            str(file_path)
        )

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from resume."
            )

        # -------------------------------------
        # Resume analysis
        # -------------------------------------

        resume_analysis = analyze_resume_text(
            resume_text
        )

        # -------------------------------------
        # Detect skills
        # -------------------------------------

        detected_skills = extract_skills(
            resume_text
        )

        # -------------------------------------
        # Exact required matching
        # -------------------------------------

        required_matched, required_missing = find_matches(
            resume_text,
            required
        )

        # -------------------------------------
        # Semantic required matching
        # -------------------------------------

        (
            semantic_required_matched,
            semantic_required_missing,
            required_semantic_details
        ) = semantic_requirement_analysis(
            resume_text,
            required,
            required_matched
        )

        # Add semantic matches to the final matched list.
        required_matched = sorted(
            set(required_matched + semantic_required_matched)
        )

        # Recalculate missing requirements.
        required_missing = [
            item
            for item in required
            if item not in required_matched
        ]

        # -------------------------------------
        # Exact preferred matching
        # -------------------------------------

        preferred_matched, preferred_missing = find_matches(
            resume_text,
            preferred
        )

        # -------------------------------------
        # Semantic preferred matching
        # -------------------------------------

        (
            semantic_preferred_matched,
            semantic_preferred_missing,
            preferred_semantic_details
        ) = semantic_requirement_analysis(
            resume_text,
            preferred,
            preferred_matched
        )

        preferred_matched = sorted(
            set(
                preferred_matched
                + semantic_preferred_matched
            )
        )

        preferred_missing = [
            item
            for item in preferred
            if item not in preferred_matched
        ]

        # -------------------------------------
        # Keyword scores
        # -------------------------------------

        required_score = calculate_keyword_score(
            required_matched,
            len(required)
        )

        preferred_score = calculate_keyword_score(
            preferred_matched,
            len(preferred)
        )

        # -------------------------------------
        # Skill coverage
        # -------------------------------------

        all_job_keywords = required + preferred

        description_skills = job_requirements.get(
            "description_detected_skills",
            []
        )

        description_matched, _ = find_matches(
            resume_text,
            description_skills
        )

        if all_job_keywords:

            total_matched = (
                len(required_matched)
                + len(preferred_matched)
            )

            base_skill_coverage = (
                total_matched
                / len(all_job_keywords)
            ) * 100

        else:

            base_skill_coverage = 100.0

        if description_skills:

            description_skill_coverage = (
                len(description_matched)
                / len(description_skills)
            ) * 100

            skill_coverage = round(
                (
                    base_skill_coverage * 0.80
                    + description_skill_coverage * 0.20
                ),
                2
            )

        else:

            skill_coverage = round(
                base_skill_coverage,
                2
            )

        # -------------------------------------
        # Education
        # -------------------------------------

        education_matched, education_missing, education_score = (
            education_matches(
                resume_text,
                education_list
            )
        )

        # -------------------------------------
        # Experience
        # -------------------------------------

        experience_result = match_experience(
            resume_text,
            experience_min,
            experience_max
        )

        # -------------------------------------
        # Final ATS score
        # -------------------------------------

        ats_score = (
            required_score * 0.40
            + preferred_score * 0.15
            + education_score * 0.10
            + experience_result["score"] * 0.10
            + resume_analysis["resume_score"] * 0.10
            + skill_coverage * 0.15
        )

        ats_score = round(
            max(0, min(100, ats_score)),
            2
        )

        # -------------------------------------
        # Recommendation
        # -------------------------------------

        if ats_score >= 90:

            recommendation = (
                "Excellent match - highly recommended"
            )

        elif ats_score >= 80:

            recommendation = (
                "Strong match - recommended"
            )

        elif ats_score >= 70:

            recommendation = (
                "Good match - consider for screening"
            )

        elif ats_score >= 60:

            recommendation = (
                "Potential candidate - review skill gaps"
            )

        elif ats_score >= 40:

            recommendation = (
                "Weak match - significant gaps found"
            )

        else:

            recommendation = (
                "Low match - not recommended"
            )

        # -------------------------------------
        # Recommendations
        # -------------------------------------

        recommendations = []

        if required_missing:

            recommendations.append(
                "Add relevant required skills: "
                + ", ".join(required_missing)
            )

        if preferred_missing:

            recommendations.append(
                "Consider adding preferred skills: "
                + ", ".join(preferred_missing)
            )

        if education_missing:

            recommendations.append(
                "Education requirement not detected: "
                + ", ".join(education_missing)
            )

        if not experience_result[
            "minimum_requirement_met"
        ]:

            recommendations.append(
                "Candidate does not meet the minimum "
                "experience requirement."
            )

        if resume_analysis[
            "section_score"
        ] < 80:

            recommendations.append(
                "Improve resume section structure."
            )

        if resume_analysis[
            "contact_score"
        ] < 100:

            recommendations.append(
                "Add complete contact information."
            )

        if not recommendations:

            recommendations.append(
                "Resume is well aligned with this job."
            )

        # -------------------------------------
        # Final response
        # -------------------------------------

        return {

            "success": True,

            "candidate": {
                "filename": file.filename,
                "word_count": resume_analysis["word_count"]
            },

            "job": job_requirements,

            "ats_score": ats_score,

            "scores": {
                "required_keyword_score": required_score,
                "preferred_keyword_score": preferred_score,
                "education_score": education_score,
                "experience_score": experience_result["score"],
                "resume_quality_score": resume_analysis["resume_score"],
                "skill_coverage": skill_coverage
            },

            "required_keywords": {
                "matched": required_matched,
                "missing": required_missing,
                "semantic_analysis": required_semantic_details
            },

            "preferred_keywords": {
                "matched": preferred_matched,
                "missing": preferred_missing,
                "semantic_analysis": preferred_semantic_details
            },

            "education": {
                "matched": education_matched,
                "missing": education_missing
            },

            "experience": experience_result,

            "detected_skills": detected_skills,

            "resume_sections": resume_analysis[
                "sections_detected"
            ],

            "recommendation": recommendation,

            "improvement_recommendations": recommendations
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"ATS analysis failed: {str(e)}"
        )
