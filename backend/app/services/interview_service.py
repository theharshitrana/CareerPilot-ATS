import re
from typing import Any

from app.services.skill_extractor import extract_skills


def _extract_project_lines(resume_text: str) -> list[str]:
    lines = [
        line.strip()
        for line in resume_text.splitlines()
        if line.strip()
    ]

    project_lines = []

    for line in lines:
        lower = line.lower()

        if any(word in lower for word in [
            "project",
            "developed",
            "built",
            "implemented",
            "created",
            "designed"
        ]):
            project_lines.append(line)

    return project_lines[:5]


def generate_questions(
    resume_text: str,
    role: str = "Software Engineer",
    job_description: str = "",
    required_keywords: list[str] | None = None,
    preferred_keywords: list[str] | None = None,
) -> list[dict[str, Any]]:

    required_keywords = required_keywords or []
    preferred_keywords = preferred_keywords or []

    detected_skills = extract_skills(resume_text)

    all_skills = []

    for skill in (
        required_keywords
        + preferred_keywords
        + detected_skills
    ):
        cleaned = skill.strip()

        if cleaned and cleaned.lower() not in {
            item.lower() for item in all_skills
        }:
            all_skills.append(cleaned)

    questions = [
        {
            "id": 1,
            "type": "role",
            "difficulty": "easy",
            "question": (
                f"Why are you interested in the {role} role, "
                "and how does your background prepare you for it?"
            )
        },
        {
            "id": 2,
            "type": "resume",
            "difficulty": "medium",
            "question": (
                "Tell me about one project from your resume. "
                "What problem did it solve, what did you personally "
                "implement, and what was the outcome?"
            )
        }
    ]

    for skill in all_skills[:3]:
        questions.append({
            "id": len(questions) + 1,
            "type": "technical",
            "difficulty": "medium",
            "question": (
                f"Explain your experience with {skill}. "
                f"Where have you used it and what challenges did you face?"
            )
        })

    questions.extend([
        {
            "id": len(questions) + 1,
            "type": "behavioral",
            "difficulty": "medium",
            "question": (
                "Tell me about a difficult problem you faced. "
                "How did you analyze it, what action did you take, "
                "and what was the result?"
            )
        },
        {
            "id": len(questions) + 2,
            "type": "behavioral",
            "difficulty": "easy",
            "question": (
                "Describe a situation where you worked with a team "
                "to complete an important task."
            )
        }
    ])

    if job_description.strip():
        questions.append({
            "id": len(questions) + 1,
            "type": "role",
            "difficulty": "hard",
            "question": (
                f"Based on the requirements for this {role} position, "
                "which requirement do you consider your strongest, "
                "and which area would you improve?"
            )
        })

    return questions


def _detect_answer_topics(
    question: str,
    answer: str
) -> list[str]:

    answer_lower = answer.lower()

    # Technical terms from the answer.
    technical_terms = extract_skills(answer)

    # Important interview concepts.
    concepts = [
        "project",
        "internship",
        "experience",
        "challenge",
        "problem",
        "solution",
        "implemented",
        "developed",
        "built",
        "designed",
        "testing",
        "debugging",
        "database",
        "api",
        "backend",
        "frontend",
        "machine learning",
        "result",
        "impact",
        "achievement",
        "team",
        "learned"
    ]

    detected = list(technical_terms)

    for concept in concepts:
        if concept in answer_lower:
            detected.append(concept)

    return sorted(set(detected))


def evaluate_answer(
    question: str,
    answer: str
) -> dict[str, Any]:

    answer = answer.strip()
    word_count = len(answer.split())

    if word_count == 0:
        return {
            "success": True,
            "score": 0,
            "word_count": 0,
            "relevance_score": 0,
            "structure_score": 0,
            "content_score": 0,
            "matched_terms": [],
            "feedback": "Please provide an answer.",
            "question": question,
            "answer": answer
        }

    # Answer length.
    if word_count < 15:
        length_score = 35
    elif word_count < 30:
        length_score = 60
    elif word_count < 50:
        length_score = 80
    elif word_count <= 150:
        length_score = 100
    else:
        length_score = 90

    # Detect meaningful answer content.
    detected_topics = _detect_answer_topics(
        question,
        answer
    )

    # Technical/relevant content score.
    content_score = 40.0

    if detected_topics:
        content_score += min(
            60.0,
            len(detected_topics) * 10
        )

    content_score = min(100.0, content_score)

    # Structure: reward explanation, action and result.
    answer_lower = answer.lower()

    structure_indicators = [
        "because",
        "problem",
        "challenge",
        "solution",
        "implemented",
        "developed",
        "built",
        "result",
        "impact",
        "achieved",
        "learned"
    ]

    structure_matches = sum(
        1
        for indicator in structure_indicators
        if indicator in answer_lower
    )

    if structure_matches >= 4:
        structure_score = 100.0
    elif structure_matches == 3:
        structure_score = 85.0
    elif structure_matches == 2:
        structure_score = 70.0
    elif structure_matches == 1:
        structure_score = 55.0
    else:
        structure_score = 40.0

    # Relevance is based on meaningful content,
    # not simple question-word overlap.
    relevance_score = content_score

    overall_score = round(
        length_score * 0.25
        + relevance_score * 0.45
        + structure_score * 0.30,
        2
    )

    if overall_score >= 85:
        feedback = (
            "Excellent answer. It is detailed, relevant, "
            "and well structured."
        )
    elif overall_score >= 70:
        feedback = (
            "Good answer. Add a more specific example, "
            "technical detail, or measurable outcome."
        )
    elif overall_score >= 50:
        feedback = (
            "Decent answer, but it could be stronger. "
            "Explain what you personally did and the result."
        )
    else:
        feedback = (
            "Weak answer. Provide specific details, "
            "your actions, and the outcome."
        )

    return {
        "success": True,
        "score": overall_score,
        "word_count": word_count,
        "relevance_score": round(relevance_score, 2),
        "structure_score": round(structure_score, 2),
        "content_score": round(content_score, 2),
        "matched_terms": detected_topics,
        "feedback": feedback,
        "question": question,
        "answer": answer
    }
