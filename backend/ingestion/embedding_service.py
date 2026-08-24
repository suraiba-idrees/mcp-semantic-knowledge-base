from fastembed import TextEmbedding

MODEL_NAME = "BAAI/bge-small-en-v1.5"  # 384-dim, matches Qdrant collection
model = TextEmbedding(model_name=MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """Generate a 384-dimensional embedding for the given text."""
    embedding = list(model.embed([text]))[0]
    return embedding.tolist()


if __name__ == "__main__":
    test_text = "This is a test document for the semantic knowledge base."
    vector = generate_embedding(test_text)
    print("Embedding model:", MODEL_NAME)
    print("Vector dimension:", len(vector))
    print("First 5 values:", vector[:5])