from fastapi import APIRouter, Depends, UploadFile, File
from middleware.auth import get_current_user
from services.mcp_service import call_list_sources, call_get_document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    
    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "user_id": user_id
    }

@router.get("")
async def list_documents(
    user_id: str = Depends(get_current_user)
):
    # Connecting real documents listing tool from MCP
    docs = await call_list_sources(user_id=user_id)
    return {
        "user_id": user_id,
        "documents": docs
    }

@router.get("/{doc_id}")
async def get_document_endpoint(
    doc_id: str,
    user_id: str = Depends(get_current_user)
):
    # Fetching individual details through your mcp layer
    doc_details = await call_get_document(doc_id=doc_id, user_id=user_id)
    return {
        "doc_id": doc_id,
        "user_id": user_id,
        "details": doc_details
    }

@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    user_id: str = Depends(get_current_user)
):
    return {
        "message": "Document deleted successfully",
        "doc_id": doc_id,
        "user_id": user_id
    }
