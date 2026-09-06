from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


model = SentenceTransformer(MODEL_NAME)


def get_embedding(text: str):
    """
    Convert text into a semantic vector embedding.
    """

    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    return model.encode(
        text,
        normalize_embeddings=True
    )


def calculate_semantic_similarity(
    text1: str,
    text2: str
) -> float:
    """
    Calculate semantic similarity between two texts.
    """

    embedding1 = get_embedding(text1)
    embedding2 = get_embedding(text2)

    similarity = float(
        embedding1 @ embedding2
    )

    return round(
        similarity * 100,
        2
    )