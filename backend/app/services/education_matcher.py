EDUCATION_ALIASES = {
    "b.tech": [
        "b.tech",
        "btech",
        "b tech",
        "bachelor of technology"
    ],
    "computer science": [
        "computer science",
        "computer science engineering",
        "computer engineering",
        "cse"
    ],
    "b.e": [
        "b.e",
        "be",
        "b e",
        "bachelor of engineering"
    ],
    "information technology": [
        "information technology",
        "information tech",
        "it"
    ],
    "m.tech": [
        "m.tech",
        "mtech",
        "m tech",
        "master of technology"
    ],
    "mca": [
        "mca",
        "master of computer applications"
    ],
    "bca": [
        "bca",
        "bachelor of computer applications"
    ]
}


def education_matches(resume_text: str, education_requirements: list[str]):
    resume_lower = resume_text.lower()

    matched = []
    missing = []

    for requirement in education_requirements:
        requirement_clean = requirement.strip().lower()

        if not requirement_clean:
            continue

        aliases = EDUCATION_ALIASES.get(
            requirement_clean,
            [requirement_clean]
        )

        found = any(
            alias in resume_lower
            for alias in aliases
        )

        if found:
            matched.append(requirement)
        else:
            missing.append(requirement)

    total = len(education_requirements)

    score = (
        round((len(matched) / total) * 100, 2)
        if total > 0
        else 100.0
    )

    return matched, missing, score
