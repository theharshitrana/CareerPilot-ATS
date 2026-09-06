import re
from datetime import date


MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}


EXPERIENCE_HEADINGS = [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "internship experience",
    "internships",
    "internship",
]


OTHER_SECTION_HEADINGS = [
    "education",
    "academic background",
    "qualifications",
    "skills",
    "technical skills",
    "projects",
    "academic projects",
    "personal projects",
    "certifications",
    "certificates",
    "achievements",
    "accomplishments",
    "summary",
    "professional summary",
    "profile",
    "objective",
]


def parse_date(value: str):

    value = value.strip().lower()

    if value in {"present", "current", "now"}:
        today = date.today()
        return today.year, today.month

    match = re.fullmatch(
        r"([a-z]+)\s+(\d{4})",
        value
    )

    if match:

        month_name = match.group(1)
        year = int(match.group(2))

        if month_name in MONTHS:
            return year, MONTHS[month_name]

    match = re.fullmatch(
        r"(\d{4})",
        value
    )

    if match:
        return int(match.group(1)), 1

    return None


def extract_experience_section(text: str):

    lines = text.splitlines()

    start_index = None

    for index, line in enumerate(lines):

        cleaned = re.sub(
            r"[^a-zA-Z ]",
            " ",
            line
        )

        cleaned = re.sub(
            r"\s+",
            " ",
            cleaned
        ).strip().lower()

        if cleaned in EXPERIENCE_HEADINGS:
            start_index = index
            break

    if start_index is None:
        return ""

    end_index = len(lines)

    for index in range(start_index + 1, len(lines)):

        cleaned = re.sub(
            r"[^a-zA-Z ]",
            " ",
            lines[index]
        )

        cleaned = re.sub(
            r"\s+",
            " ",
            cleaned
        ).strip().lower()

        if cleaned in OTHER_SECTION_HEADINGS:
            end_index = index
            break

    return "\n".join(
        lines[start_index:end_index]
    )


def extract_experience_periods(text: str):

    normalized_text = (
        text
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
    )

    pattern = re.compile(
        r"([A-Za-z]+\s+\d{4}|\d{4})"
        r"\s*(?:-|to)\s*"
        r"(Present|Current|Now|[A-Za-z]+\s+\d{4}|\d{4})",
        re.IGNORECASE
    )

    periods = []

    for match in pattern.finditer(normalized_text):

        start_text = match.group(1)
        end_text = match.group(2)

        start = parse_date(start_text)
        end = parse_date(end_text)

        if not start or not end:
            continue

        start_year, start_month = start
        end_year, end_month = end

        total_months = (
            (end_year - start_year) * 12
            + (end_month - start_month)
        )

        if total_months < 0:
            continue

        periods.append({
            "start": start_text,
            "end": end_text,
            "months": total_months
        })

    return periods


def calculate_total_experience(text: str):

    experience_section = extract_experience_section(text)

    if not experience_section:
        return {
            "total_months": 0,
            "total_years": 0.0,
            "periods": []
        }

    periods = extract_experience_periods(
        experience_section
    )

    total_months = sum(
        period["months"]
        for period in periods
    )

    return {
        "total_months": total_months,
        "total_years": round(
            total_months / 12,
            2
        ),
        "periods": periods
    }
