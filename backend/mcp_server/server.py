import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BACKEND_DIR))

from fastmcp import FastMCP
from ingestion.retrieval import search_notes as qdrant_search
from ingestion.document_service import (
    get_document as qdrant_get_document,
    list_sources as qdrant_list_sources,
)

mcp = FastMCP("Personal Knowledge Base")

# TEMPORARY: single shared user until real auth/user isolation is wired in.
DEFAULT_USER_ID = "demo-user"

# Minimum cosine-similarity score a match needs before we consider it
# confident enough to return, per PRD requirement #6.
CONFIDENCE_THRESHOLD = 0.3


@mcp.tool()
def search_notes(query: str, top_k: int = 3) -> dict:
    """
    Search the knowledge base for chunks relevant to the query using
    real semantic (vector) search against Qdrant.
    """
    if not query or not query.strip():
        return {"error": "Query cannot be empty."}

    if top_k < 1:
        return {"error": "top_k must be at least 1."}

    try:
        raw_matches = qdrant_search(query, top_k=top_k, user_id=DEFAULT_USER_ID)
    except Exception as e:
        return {"error": f"Search failed: {str(e)}"}

    results = [
        {
            "doc_id": match.get("doc_id"),
            "title": match.get("filename"),
            "snippet": (match.get("text") or "")[:200],
            "score": match.get("score"),
        }
        for match in raw_matches
        if match.get("score", 0) >= CONFIDENCE_THRESHOLD
    ]

    if not results:
        # PRD requirement #6: return "no confident match" instead of a
        # forced, low-relevance answer.
        return {
            "message": "No confident match found for this query.",
            "results": [],
        }

    return {
        "message": f"Found {len(results)} relevant result(s).",
        "results": results,
    }


@mcp.tool()
def get_document(doc_id: str) -> dict:
    """
    Fetch the full content of a document by its ID from Qdrant.
    """
    if not doc_id or not doc_id.strip():
        return {"error": "doc_id cannot be empty."}

    try:
        doc = qdrant_get_document(doc_id, user_id=DEFAULT_USER_ID)
    except Exception as e:
        return {"error": f"Failed to fetch document: {str(e)}"}

    if doc.get("message") == "Document not found.":
        return {"error": f"No document found with id '{doc_id}'."}

    return doc


@mcp.tool()
def list_sources() -> dict:
    """
    List all documents currently indexed in the knowledge base.
    """
    try:
        sources = qdrant_list_sources()
    except Exception as e:
        return {"error": f"Failed to list sources: {str(e)}"}

    return {
        "count": len(sources),
        "sources": sources,
    }


if __name__ == "__main__":
    mcp.run()