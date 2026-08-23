from fastapi import APIRouter, Depends, UploadFile, File
from middleware.auth import get_current_user

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
    return {
        "user_id": user_id,
        "documents": []
    }


@router.get("/{doc_id}")
async def get_document(
    doc_id: str,
    user_id: str = Depends(get_current_user)
):
    return {
        "doc_id": doc_id,
        "user_id": user_id
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