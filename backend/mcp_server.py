from fastmcp import FastMCP
from ingestion.retrieval import search_notes


mcp = FastMCP("Knowledge Base MCP")


@mcp.tool()
def search_knowledge_base(query: str) -> list:
    """
    Search the Qdrant knowledge base using semantic similarity.
    """
    results = search_notes(query)

    return results


if __name__ == "__main__":
    mcp.run()