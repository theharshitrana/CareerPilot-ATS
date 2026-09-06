import re

from app.services.skill_extractor import extract_skills


def clean_requirement(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def unique_preserve_order(items: list[str]) -> list[str]:
    seen = set()
    result = []

    for item in items:
        key = item.lower().strip()

        if key and key not in seen:
            seen.add(key)
            result.append(item.strip())

    return result


def analyze_job_requirements(
    job_title: str,
    job_description: str = "",
    required_keywords: list[str] | None = None,
    preferred_keywords: list[str] | None = None,
    education: list[str] | None = None,
    experience_min: int = 0,
    experience_max: int | None = None
):
    required_keywords = required_keywords or []
    preferred_keywords = preferred_keywords or []
    education = education or []

    job_title = clean_requirement(job_title)
    job_description = clean_requirement(job_description)

    required = [
        clean_requirement(item)
        for item in required_keywords
        if item and item.strip()
    ]

    preferred = [
        clean_requirement(item)
        for item in preferred_keywords
        if item and item.strip()
    ]

    education_requirements = [
        clean_requirement(item)
        for item in education
        if item and item.strip()
    ]

    # Automatically detect known skills from the job description.
    description_skills = extract_skills(job_description)

    # Combine explicit HR requirements with skills detected
    # from the description, while avoiding duplicates.
    all_job_skills = unique_preserve_order(
        required
        + preferred
        + description_skills
    )

    return {
        "job_title": job_title,
        "job_description": job_description,

        "required_keywords": unique_preserve_order(required),

        "preferred_keywords": unique_preserve_order(preferred),

        "description_detected_skills": description_skills,

        "all_detected_job_skills": all_job_skills,

        "education": unique_preserve_order(
            education_requirements
        ),

        "experience": {
            "minimum_years": experience_min,
            "maximum_years": experience_max
        }
    }
