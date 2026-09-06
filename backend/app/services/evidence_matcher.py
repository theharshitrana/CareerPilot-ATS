import re


STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "in",
    "is",
    "of",
    "on",
    "or",
    "that",
    "the",
    "this",
    "to",
    "using",
    "with",
    "into",
    "through",
    "their",
    "your",
    "our",
    "required",
    "preferred",
    "experience",
    "experienced",
    "building",
    "developing",
    "developed",
    "development",
    "professional",
    "skills",
}


def normalize_text(text: str) -> str:

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_meaningful_terms(text: str):

    normalized = normalize_text(text)

    words = normalized.split()

    return [
        word
        for word in words
        if len(word) >= 3
        and word not in STOPWORDS
    ]


def find_evidence(
    resume_text: str,
    requirement: str
):
    """
    Find meaningful textual evidence in the resume.

    Generic words are ignored so that common language
    does not create false matches.
    """

    resume = normalize_text(resume_text)

    requirement_terms = extract_meaningful_terms(
        requirement
    )

    if not requirement_terms:

        return {
            "matched_terms": [],
            "evidence_score": 0.0
        }

    matched_terms = []

    for term in requirement_terms:

        if term in resume:
            matched_terms.append(term)

    evidence_score = (
        len(matched_terms)
        / len(requirement_terms)
    ) * 100

    return {
        "matched_terms": sorted(
            set(matched_terms)
        ),
        "evidence_score": round(
            evidence_score,
            2
        )
    }
