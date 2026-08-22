import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient

# Load environment variables from backend/.env
load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("QDRANT_URL or QDRANT_API_KEY is missing from .env")

# Connect to Qdrant Cloud
client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

# Test the connection
collections = client.get_collections()

print("Successfully connected to Qdrant!")
print("Available collections:")

for collection in collections.collections:
    print("-", collection.name)