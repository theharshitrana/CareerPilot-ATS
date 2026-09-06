import re
from typing import Any


# =========================================================
# SKILL DATABASE
# =========================================================

SKILLS = {
    "Python",
    "Java",
    "C",
    "C++",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Express",
    "FastAPI",
    "Flask",
    "Django",
    "Spring Boot",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "Azure",
    "GCP",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "NLP",
    "Computer Vision",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Power BI",
    "Tableau",
    "Streamlit",
    "OpenCV",
    "LangChain",
    "RAG",
    "LLM",
    "Generative AI",
    "REST API",
    "Data Structures",
    "Algorithms",
    "OOP",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
}


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def find_email(text: str) -> str | None:
    pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"

    match = re.search(pattern, text)

    return match.group(0) if match else None


def find_phone(text: str) -> str | None:
    patterns = [
        r"\+91[\s-]?[6-9]\d{9}",
        r"\b[6-9]\d{9}\b",
        r"\+\d{1,3}[\s-]?\d{7,12}",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            return match.group(0)

    return None


def find_name(text: str) -> str | None:
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return None

    ignored_words = {
        "resume",
        "curriculum vitae",
        "cv",
        "profile",
        "summary",
        "contact",
        "objective",
    }

    for line in lines[:8]:

        lower = line.lower()

        if lower in ignored_words:
            continue

        if "@" in line:
            continue

        if re.search(r"\d", line):
            continue

        words = line.split()

        if 2 <= len(words) <= 5:
            return line

    return None


def find_skills(text: str) -> list[str]:
    text_lower = text.lower()

    found = []

    for skill in SKILLS:

        if skill.lower() in text_lower:
            found.append(skill)

    return sorted(
        found,
        key=str.lower
    )


def extract_section(
    text: str,
    section_names: list[str]
) -> str:

    lines = text.splitlines()

    start_index = None

    for i, line in enumerate(lines):

        normalized = line.strip().lower()

        for section in section_names:

            if normalized == section:
                start_index = i + 1
                break

        if start_index is not None:
            break

    if start_index is None:
        return ""

    stop_sections = {
        "education",
        "experience",
        "work experience",
        "employment",
        "projects",
        "skills",
        "technical skills",
        "certifications",
        "achievements",
        "awards",
        "summary",
        "objective",
    }

    collected = []

    for line in lines[start_index:]:

        normalized = line.strip().lower()

        if normalized in stop_sections:
            break

        if line.strip():
            collected.append(line.strip())

    return "\n".join(collected)


def count_section_presence(
    text: str,
    section_names: list[str]
) -> bool:

    text_lower = text.lower()

    return any(
        section.lower() in text_lower
        for section in section_names
    )


# =========================================================
# ATS SCORE
# =========================================================

def calculate_ats_score(
    text: str,
    skills: list[str]
) -> dict[str, Any]:

    score = 0

    checks = {}

    # Length
    word_count = len(text.split())

    if word_count >= 250:
        score += 15
        checks["content_length"] = True
    else:
        checks["content_length"] = False

    # Contact information
    has_email = find_email(text) is not None
    has_phone = find_phone(text) is not None

    if has_email:
        score += 10

    if has_phone:
        score += 10

    checks["email"] = has_email
    checks["phone"] = has_phone

    # Skills
    if len(skills) >= 8:
        score += 15
    elif len(skills) >= 4:
        score += 10
    elif len(skills) >= 1:
        score += 5

    checks["skills"] = len(skills) >= 4

    # Sections
    sections = {
        "education": [
            "education",
            "academic background",
        ],
        "experience": [
            "experience",
            "work experience",
            "employment",
        ],
        "projects": [
            "projects",
            "academic projects",
        ],
        "certifications": [
            "certifications",
            "certificates",
        ],
    }

    for section, names in sections.items():

        present = count_section_presence(
            text,
            names
        )

        checks[section] = present

        if present:
            score += 10

    # Keep score within 100
    score = min(score, 100)

    return {
        "score": score,
        "checks": checks,
        "word_count": word_count,
    }


# =========================================================
# STRENGTHS
# =========================================================

def generate_strengths(
    text: str,
    skills: list[str],
    ats: dict[str, Any]
) -> list[str]:

    strengths = []

    if len(skills) >= 8:
        strengths.append(
            "Strong technical skill coverage."
        )
    elif len(skills) >= 4:
        strengths.append(
            "Good variety of technical skills."
        )

    if ats["checks"]["projects"]:
        strengths.append(
            "Projects section detected."
        )

    if ats["checks"]["experience"]:
        strengths.append(
            "Professional experience section detected."
        )

    if ats["checks"]["education"]:
        strengths.append(
            "Education section detected."
        )

    if ats["checks"]["certifications"]:
        strengths.append(
            "Certifications section detected."
        )

    if ats["checks"]["email"] and ats["checks"]["phone"]:
        strengths.append(
            "Contact information is clearly available."
        )

    if not strengths:
        strengths.append(
            "Resume text was successfully extracted."
        )

    return strengths


# =========================================================
# WEAKNESSES
# =========================================================

def generate_weaknesses(
    text: str,
    skills: list[str],
    ats: dict[str, Any]
) -> list[str]:

    weaknesses = []

    if not ats["checks"]["email"]:
        weaknesses.append(
            "Email address was not detected."
        )

    if not ats["checks"]["phone"]:
        weaknesses.append(
            "Phone number was not detected."
        )

    if len(skills) < 4:
        weaknesses.append(
            "Add more relevant technical skills."
        )

    if not ats["checks"]["projects"]:
        weaknesses.append(
            "Projects section was not detected."
        )

    if not ats["checks"]["experience"]:
        weaknesses.append(
            "Experience section was not detected."
        )

    if not ats["checks"]["education"]:
        weaknesses.append(
            "Education section was not detected."
        )

    if ats["word_count"] < 250:
        weaknesses.append(
            "Resume appears short. Add measurable achievements and relevant details."
        )

    if not weaknesses:
        weaknesses.append(
            "No major structural weaknesses detected."
        )

    return weaknesses


# =========================================================
# MAIN ANALYZER
# =========================================================

def analyze_resume(text: str) -> dict[str, Any]:

    cleaned_text = text.strip()

    skills = find_skills(cleaned_text)

    ats = calculate_ats_score(
        cleaned_text,
        skills
    )

    education = extract_section(
        cleaned_text,
        [
            "education",
            "academic background",
        ]
    )

    experience = extract_section(
        cleaned_text,
        [
            "experience",
            "work experience",
            "employment",
        ]
    )

    projects = extract_section(
        cleaned_text,
        [
            "projects",
            "academic projects",
        ]
    )

    certifications = extract_section(
        cleaned_text,
        [
            "certifications",
            "certificates",
        ]
    )

    return {

        "candidate": {
            "name": find_name(cleaned_text),
            "email": find_email(cleaned_text),
            "phone": find_phone(cleaned_text),
        },

        "skills": skills,

        "education": education,

        "experience": experience,

        "projects": projects,

        "certifications": certifications,

        "ats": ats,

        "strengths": generate_strengths(
            cleaned_text,
            skills,
            ats
        ),

        "weaknesses": generate_weaknesses(
            cleaned_text,
            skills,
            ats
        ),

    }