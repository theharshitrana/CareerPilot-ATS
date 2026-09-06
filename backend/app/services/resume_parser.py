import re
from pathlib import Path

import fitz
from docx import Document


def extract_pdf_text(file_path: str) -> str:
    text = []

    document = fitz.open(file_path)

    for page in document:
        page_text = page.get_text()

        if page_text:
            text.append(page_text)

    document.close()

    return "\n".join(text).strip()


def extract_docx_text(file_path: str) -> str:
    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            paragraphs.append(paragraph.text.strip())

    return "\n".join(paragraphs).strip()


def extract_text(file_path: str) -> str:

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError("Resume file not found.")

    extension = path.suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(str(path))

    if extension == ".docx":
        return extract_docx_text(str(path))

    raise ValueError(
        "Unsupported file format. Only PDF and DOCX are supported."
    )


def extract_email(text: str) -> str | None:

    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:

    match = re.search(
        r"(?:\+91[\s-]?)?[6-9]\d{9}",
        text
    )

    return match.group(0) if match else None


def detect_sections(text: str) -> dict:

    section_patterns = {
        "summary": [
            "summary",
            "professional summary",
            "profile",
            "objective"
        ],

        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment"
        ],

        "education": [
            "education",
            "academic background",
            "qualifications"
        ],

        "skills": [
            "skills",
            "technical skills",
            "core skills",
            "technologies"
        ],

        "projects": [
            "projects",
            "academic projects",
            "personal projects"
        ],

        "certifications": [
            "certifications",
            "certificates"
        ],

        "achievements": [
            "achievements",
            "accomplishments"
        ]
    }

    text_lower = text.lower()

    detected = {}

    for section, headings in section_patterns.items():

        found = False

        for heading in headings:

            pattern = r"\b" + re.escape(heading) + r"\b"

            if re.search(pattern, text_lower):
                found = True
                break

        detected[section] = found

    return detected


def analyze_resume_text(text: str) -> dict:

    sections = detect_sections(text)

    email = extract_email(text)

    phone = extract_phone(text)

    word_count = len(text.split())

    section_score = (
        sum(sections.values()) /
        len(sections)
    ) * 100

    contact_score = 0

    if email:
        contact_score += 50

    if phone:
        contact_score += 50

    if word_count >= 150:
        length_score = 100
    elif word_count >= 80:
        length_score = 75
    elif word_count >= 40:
        length_score = 50
    else:
        length_score = 25

    resume_score = round(
        section_score * 0.45
        + contact_score * 0.30
        + length_score * 0.25,
        2
    )

    return {
        "resume_score": resume_score,

        "word_count": word_count,

        "contact_information": {
            "email": email,
            "phone": phone
        },

        "sections_detected": sections,

        "section_score": round(section_score, 2),

        "contact_score": contact_score,

        "length_score": length_score
    }
