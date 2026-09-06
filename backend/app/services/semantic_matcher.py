from app.models.embedding_model import calculate_semantic_similarity


def semantic_keyword_matches(
    resume_text: str,
    keywords: list[str],
    threshold: float = 55.0
):
    matched = []
    missing = []
    scores = {}

    for keyword in keywords:
        keyword = keyword.strip()

        if not keyword:
            continue

        score = calculate_semantic_similarity(
            resume_text,
            keyword
        )

        scores[keyword] = score

        if score >= threshold:
            matched.append(keyword)
        else:
            missing.append(keyword)

    return matched, missing, scores
