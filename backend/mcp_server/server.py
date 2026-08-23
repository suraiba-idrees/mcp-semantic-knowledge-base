from fastmcp import FastMCP
from ingestion.retrieval import search_notes as qdrant_search
from ingestion.document_service import get_document as qdrant_get_document, list_sources as qdrant_list_sources

mcp = FastMCP("Personal Knowledge Base")

# TEMPORARY: fake in-memory data, will be replaced with real Qdrant search
# once the ingestion/Qdrant part of the project is ready.
FAKE_DOCUMENTS = {
    "doc_1": {
        "title": "Week 3 Task Description",
        "content": "This document covers the Week 3 RAG pipeline task: document upload, chunking, embeddings, Qdrant storage, retrieval, and study plan generation.",
    },
    "doc_2": {
        "title": "MCP Server PRD",
        "content": "This document describes building a Personal Knowledge-Base MCP Server using FastMCP and Qdrant, exposing search_notes, get_document, and list_sources as tools.",
    },
}

# Minimum "confidence" a match needs before we return it.
# TEMPORARY: with keyword matching this is just presence/absence (1.0 or 0.0).
# Once real Qdrant similarity scores are wired in, this becomes a real threshold
# (e.g. 0.7 cosine similarity) per PRD requirement #6.
CONFIDENCE_THRESHOLD = 0.5


@mcp.tool()
def search_notes(query: str, top_k: int = 3) -> dict:
    """
    Search the knowledge base for chunks relevant to the query.
    Currently returns fake matches - will be replaced with real
    Qdrant semantic search once ingestion is ready.
    """
    if not query or not query.strip():
        return {"error": "Query cannot be empty."}

    if top_k < 1:
        return {"error": "top_k must be at least 1."}

    # TEMPORARY: naive keyword match instead of real vector search
    results = []
    for doc_id, doc in FAKE_DOCUMENTS.items():
        if query.lower() in doc["content"].lower():
            results.append({
                "doc_id": doc_id,
                "title": doc["title"],
                "snippet": doc["content"][:100],
                "score": 1.0,  # placeholder until real similarity scores exist
            })

    results = results[:top_k]

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
    Fetch the full content of a document by its ID.
    """
    if not doc_id or not doc_id.strip():
        return {"error": "doc_id cannot be empty."}

    doc = FAKE_DOCUMENTS.get(doc_id)
    if not doc:
        available = ", ".join(FAKE_DOCUMENTS.keys())
        return {
            "error": f"No document found with id '{doc_id}'.",
            "available_ids": available,
        }

    return {
        "doc_id": doc_id,
        "title": doc["title"],
        "content": doc["content"],
    }


@mcp.tool()
def list_sources() -> dict:
    """
    List all documents currently indexed in the knowledge base.
    """
    sources = [
        {"doc_id": doc_id, "title": doc["title"]}
        for doc_id, doc in FAKE_DOCUMENTS.items()
    ]
    return {
        "count": len(sources),
        "sources": sources,
    }


if __name__ == "__main__":
    mcp.run()