from app.models.embedding_model import get_embedding
from app.services.evidence_matcher import find_evidence


def split_text_into_chunks(text: str, max_words: int = 60, overlap: int = 20):
    words = text.split()

    if not words:
        return []

    chunks = []
    step = max_words - overlap

    if step <= 0:
        step = max_words

    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + max_words])

        if chunk.strip():
            chunks.append(chunk.strip())

        if i + max_words >= len(words):
            break

    return chunks


def find_relevant_evidence(
    resume_text: str,
    requirement: str,
    matched_terms: list[str]
):
    """
    Return a short evidence snippet only when the resume
    contains direct evidence for the requirement.
    """

    if not matched_terms:
        return "No direct evidence found."

    lines = [
        line.strip()
        for line in resume_text.splitlines()
        if line.strip()
    ]

    requirement_lower = requirement.lower()
    terms_lower = [term.lower() for term in matched_terms]

    # Prefer the shortest resume line containing a matched term.
    candidates = []

    for line in lines:
        line_lower = line.lower()

        if any(term in line_lower for term in terms_lower):
            candidates.append(line)

    if candidates:
        candidates.sort(key=len)
        best_line = candidates[0]

        # Prevent excessively long evidence.
        words = best_line.split()

        if len(words) > 25:
            best_line = " ".join(words[:25]) + "..."

        return best_line

    # Fallback: no useful direct line found.
    return "No direct evidence found."


def calculate_chunk_similarity(requirement: str, chunks: list[str]):
    if not requirement.strip():
        return {
            "score": 0.0,
            "evidence": ""
        }

    if not chunks:
        return {
            "score": 0.0,
            "evidence": ""
        }

    requirement_embedding = get_embedding(requirement)

    best_score = -1.0
    best_chunk = ""

    for chunk in chunks:
        chunk_embedding = get_embedding(chunk)

        similarity = float(
            requirement_embedding @ chunk_embedding
        )

        if similarity > best_score:
            best_score = similarity
            best_chunk = chunk

    return {
        "score": round(max(0.0, best_score) * 100, 2),
        "evidence": best_chunk
    }


def contextual_match(
    resume_text: str,
    requirement: str,
    threshold: float = 55.0
):
    chunks = split_text_into_chunks(resume_text)

    semantic_result = calculate_chunk_similarity(
        requirement,
        chunks
    )

    evidence_result = find_evidence(
        resume_text,
        requirement
    )

    semantic_score = semantic_result["score"]
    evidence_score = evidence_result["evidence_score"]
    matched_terms = evidence_result["matched_terms"]

    combined_score = (
        semantic_score * 0.70
        + evidence_score * 0.30
    )

    combined_score = round(
        min(100.0, combined_score),
        2
    )

    # Direct evidence is now shown separately from
    # the semantic chunk used internally.
    evidence = find_relevant_evidence(
        resume_text,
        requirement,
        matched_terms
    )

    return {
        "requirement": requirement,
        "matched": combined_score >= threshold,
        "score": combined_score,
        "semantic_score": semantic_score,
        "evidence_score": evidence_score,
        "matched_terms": matched_terms,
        "evidence": evidence
    }
