import inspect

# We dynamically import the exact underlying function logic bypassing FastMCP's internal state managers
try:
    # Aggressively fallback to direct file integration 
    from mcp_server.server import search_notes, list_sources, get_document
except ImportError:
    import mcp_server.server as mcp_module
    search_notes = getattr(mcp_module, "search_notes", None)
    list_sources = getattr(mcp_module, "list_sources", None)
    get_document = getattr(mcp_module, "get_document", None)

async def call_search_notes(query: str, top_k: int = 5, user_id: str = None):
    """Direct functional bridge bypassing ASGI coroutine blocks"""
    if not search_notes:
        return [{"error": "Underlying search_notes logic function not found inside server.py"}]
    
    # Execute natively whether the teammate wrote it as sync or async
    if inspect.iscoroutinefunction(search_notes):
        return await search_notes(query=query)
    return search_notes(query=query)

async def call_list_sources(user_id: str):
    """Direct listing function map"""
    if not list_sources:
        return []
    if inspect.iscoroutinefunction(list_sources):
        return await list_sources()
    return list_sources()

async def call_get_document(doc_id: str, user_id: str):
    """Direct single source document extraction map"""
    if not get_document:
        return None
    if inspect.iscoroutinefunction(get_document):
        return await get_document(doc_id=doc_id)
    return get_document(doc_id=doc_id)
