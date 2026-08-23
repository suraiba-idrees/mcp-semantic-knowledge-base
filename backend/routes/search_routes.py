from fastapi import APIRouter, Depends
from pydantic import BaseModel
from middleware.auth import get_current_user
from services.mcp_service import call_search_notes

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@router.post("")
async def search(
    request: SearchRequest,
    user_id: str = Depends(get_current_user)
):
    mcp_results = await call_search_notes(
        query=request.query, 
        top_k=request.top_k, 
        user_id=user_id
    )
    
    final_array = []
    if isinstance(mcp_results, dict):
        final_array = mcp_results.get("results", [])
    elif isinstance(mcp_results, list):
        final_array = mcp_results
        
    return {
        "query": request.query,
        "top_k": request.top_k,
        "user_id": user_id,
        "results": final_array  # Send flat array straight down
    }
