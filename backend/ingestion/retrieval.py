import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient

from ingestion.embedding_service import generate_embedding


load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "knowledge_base"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)


def search_notes(
    query: str,
    top_k: int = 3,
    user_id: str = "demo-user"
):
    """
    Search the knowledge base using semantic similarity.
    """

    query_vector = generate_embedding(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        query_filter={
            "must": [
                {
                    "key": "user_id",
                    "match": {
                        "value": user_id
                    }
                }
            ]
        },
        limit=top_k,
        with_payload=True
    )

    matches = []

    for result in results.points:
        matches.append({
            "score": result.score,
            "doc_id": result.payload.get("doc_id"),
            "filename": result.payload.get("filename"),
            "chunk_index": result.payload.get("chunk_index"),
            "text": result.payload.get("text")
        })

    return matches


if __name__ == "__main__":

    query = input("Enter your search query: ").strip()

    results = search_notes(query)

    print("\nSearch Results:\n")

    if not results:
        print("No results found.")
    else:
        for index, result in enumerate(results, start=1):

            print(f"Result {index}")
            print(f"Score: {result['score']:.4f}")
            print(f"Source: {result['filename']}")
            print(f"Chunk: {result['chunk_index']}")
            print(f"Text: {result['text']}")
            print("-" * 60)