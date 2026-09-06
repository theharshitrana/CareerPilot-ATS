from app.models.embedding_model import calculate_semantic_similarity
from app.models.schemas import JobRequirement
from app.services.skill_normalizer import normalize_skill


def find_matches(resume_text: str, keywords: list[str]):
    resume_lower = resume_text.lower()

    matched = []
    missing = []

    for keyword in keywords:
        original = keyword.strip()

        if not original:
            continue

        normalized = normalize_skill(original)

        # Direct match
        if original.lower() in resume_lower:
            matched.append(original)
            continue

        # Normalized match
        if normalized in resume_lower:
            matched.append(original)
            continue

        # Alias matching
        aliases = {
            "amazon web services": ["aws"],
            "javascript": ["js"],
            "machine learning": ["ml"],
            "natural language processing": ["nlp"],
            "postgresql": ["postgres"],
            "react": ["react.js", "reactjs"],
            "rest api": ["rest", "restful api"],
            "data structures and algorithms": ["dsa"]
        }

        found = False

        for alias in aliases.get(normalized, []):
            if alias in resume_lower:
                matched.append(original)
                found = True
                break

        if not found:
            missing.append(original)

    return matched, missing


def calculate_keyword_score(matched: list[str], total: int):
    if total == 0:
        return 100.0

    return round((len(matched) / total) * 100, 2)


def match_job(resume_text: str, job: JobRequirement):

    required_matched, required_missing = find_matches(
        resume_text,
        job.required_keywords
    )

    preferred_matched, preferred_missing = find_matches(
        resume_text,
        job.preferred_keywords
    )

    required_score = calculate_keyword_score(
        required_matched,
        len(job.required_keywords)
    )

    preferred_score = calculate_keyword_score(
        preferred_matched,
        len(job.preferred_keywords)
    )

    job_text = " ".join([
        job.job_title,
        *job.required_keywords,
        *job.preferred_keywords,
        *job.education
    ])

    semantic_score = calculate_semantic_similarity(
        resume_text,
        job_text
    )

    ats_score = (
        required_score * 0.50
        + preferred_score * 0.15
        + semantic_score * 0.35
    )

    ats_score = round(
        max(0, min(100, ats_score)),
        2
    )

    if ats_score >= 90:
        recommendation = "Excellent candidate match"
    elif ats_score >= 75:
        recommendation = "Strong candidate match"
    elif ats_score >= 60:
        recommendation = "Potential candidate"
    elif ats_score >= 40:
        recommendation = "Moderate match - skill gaps found"
    else:
        recommendation = "Low match - significant skill gaps"

    return {
        "job_title": job.job_title,

        "ats_score": ats_score,

        "required_keyword_score": required_score,

        "preferred_keyword_score": preferred_score,

        "semantic_score": semantic_score,

        "required_keywords": {
            "total": len(job.required_keywords),
            "matched": required_matched,
            "missing": required_missing
        },

        "preferred_keywords": {
            "total": len(job.preferred_keywords),
            "matched": preferred_matched,
            "missing": preferred_missing
        },

        "education_requirements": job.education,

        "experience_requirement": {
            "minimum_years": job.experience_min,
            "maximum_years": job.experience_max
        },

        "recommendation": recommendation
    }