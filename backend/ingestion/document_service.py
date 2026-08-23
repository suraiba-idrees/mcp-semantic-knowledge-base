import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "knowledge_base"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)


def get_document(doc_id: str, user_id: str = "demo-user"):
    """
    Retrieve all chunks belonging to a document.
    """

    results = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter={
            "must": [
                {
                    "key": "doc_id",
                    "match": {
                        "value": doc_id
                    }
                },
                {
                    "key": "user_id",
                    "match": {
                        "value": user_id
                    }
                }
            ]
        },
        limit=100,
        with_payload=True,
        with_vectors=False
    )

    points = results[0]

    if not points:
        return {
            "doc_id": doc_id,
            "message": "Document not found."
        }

    points.sort(
        key=lambda point: point.payload.get("chunk_index", 0)
    )

    document = {
        "doc_id": doc_id,
        "filename": points[0].payload.get("filename"),
        "source": points[0].payload.get("source"),
        "total_chunks": len(points),
        "text": "\n\n".join(
            point.payload.get("text", "")
            for point in points
        )
    }

    return document

def list_sources():
    results, _ = client.scroll(
        collection_name=COLLECTION_NAME,
        limit=100,
        with_payload=True,
        with_vectors=False
    )

    sources = {}

    for point in results:
        payload = point.payload

        doc_id = payload.get("doc_id")
        filename = payload.get("filename")

        if doc_id and doc_id not in sources:
            sources[doc_id] = {
                "doc_id": doc_id,
                "filename": filename
            }

    return list(sources.values())

if __name__ == "__main__":
    sources = list_sources()

    print("\nIndexed Sources:\n")

    for source in sources:
        print(f"Document ID: {source['doc_id']}")
        print(f"Filename: {source['filename']}")
        print("-" * 50)