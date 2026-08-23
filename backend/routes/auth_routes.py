from fastapi import APIRouter, Depends

from models.user_model import UserCreate, UserLogin
from middleware.auth import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
async def signup(user: UserCreate):
    return {
        "message": "User created successfully",
        "email": user.email
    }


@router.post("/login")
async def login(user: UserLogin):
    return {
        "access_token": "JWT_TOKEN",
        "token_type": "bearer"
    }


@router.get("/me")
async def get_me(
    user_id: str = Depends(get_current_user)
):
    return {
        "user_id": user_id
    }