from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """Generate a 384-dimensional embedding for the given text."""
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


if __name__ == "__main__":
    test_text = "This is a test document for the semantic knowledge base."

    vector = generate_embedding(test_text)

    print("Embedding model:", MODEL_NAME)
    print("Vector dimension:", len(vector))
    print("First 5 values:", vector[:5])