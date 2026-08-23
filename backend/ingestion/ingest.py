import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from pypdf import PdfReader
from qdrant_client import QdrantClient, models

from embedding_service import generate_embedding


load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

COLLECTION_NAME = "knowledge_base"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)


def extract_text(file_path: str) -> str:
    """
    Extract text from PDF, Markdown, or TXT files.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    extension = path.suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(file_path)

        pages = []

        for page in reader.pages:
            text = page.extract_text()

            if text:
                pages.append(text)

        return "\n".join(pages)

    elif extension in [".txt", ".md"]:
        return path.read_text(encoding="utf-8")

    else:
        raise ValueError(
            "Unsupported file type. Please use PDF, MD, or TXT."
        )


def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> list[str]:
    """
    Split text into overlapping chunks.
    """

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):

        end = start + chunk_size

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def ingest_document(
    file_path: str,
    user_id: str = "demo-user"
) -> str:

    print(f"\nProcessing: {file_path}")

    # 1. Extract text
    text = extract_text(file_path)

    if not text.strip():
        raise ValueError("The document contains no readable text.")

    print(f"Extracted characters: {len(text)}")

    # 2. Create chunks
    chunks = chunk_text(text)

    print(f"Created chunks: {len(chunks)}")

    # 3. Generate document ID
    doc_id = str(uuid.uuid4())

    points = []

    # 4. Generate embeddings and prepare Qdrant points
    for index, chunk in enumerate(chunks):

        print(
            f"Generating embedding "
            f"{index + 1}/{len(chunks)}..."
        )

        vector = generate_embedding(chunk)

        point = models.PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload={
                "user_id": user_id,
                "doc_id": doc_id,
                "filename": Path(file_path).name,
                "source": str(file_path),
                "chunk_index": index,
                "text": chunk
            }
        )

        points.append(point)

    # 5. Store vectors in Qdrant
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

    print("\nDocument successfully stored in Qdrant.")
    print(f"Document ID: {doc_id}")
    print(f"Total chunks stored: {len(points)}")

    return doc_id


if __name__ == "__main__":

    print("Qdrant Knowledge Base Ingestion")

    file_path = input(
        "Enter the path of a PDF, MD, or TXT file: "
    ).strip()

    if not file_path:
        print("No file path provided.")
    else:
        try:
            ingest_document(file_path)

        except Exception as error:
            print(f"\nError: {error}")