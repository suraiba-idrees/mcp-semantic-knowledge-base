import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient, models

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

COLLECTION_NAME = "knowledge_base"

# Check whether the collection already exists
existing_collections = client.get_collections().collections
collection_names = [collection.name for collection in existing_collections]

if COLLECTION_NAME in collection_names:
    print(f"Collection '{COLLECTION_NAME}' already exists.")
else:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=384,
            distance=models.Distance.COSINE
        )
    )
    print(f"Collection '{COLLECTION_NAME}' created successfully.")

# Display collection information
info = client.get_collection(COLLECTION_NAME)

print(f"Collection: {COLLECTION_NAME}")
print(f"Vector size: {info.config.params.vectors.size}")
print(f"Distance: {info.config.params.vectors.distance}")

from qdrant_client.models import PayloadSchemaType

client.create_payload_index(
    collection_name="knowledge_base",
    field_name="user_id",
    field_schema=PayloadSchemaType.KEYWORD
)

print("user_id index created successfully.")

client.create_payload_index(
    collection_name="knowledge_base",
    field_name="doc_id",
    field_schema=PayloadSchemaType.KEYWORD
)

print("doc_id index created successfully.")