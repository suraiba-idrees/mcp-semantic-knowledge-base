from fastapi import APIRouter, Depends
from pydantic import BaseModel
from middleware.auth import get_current_user

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
    return {
        "query": request.query,
        "top_k": request.top_k,
        "user_id": user_id,
        "results": []
    }