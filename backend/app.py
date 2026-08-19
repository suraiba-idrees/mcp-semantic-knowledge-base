from fastapi import FastAPI

from routes.auth_routes import router as auth_router
from routes.document_routes import router as document_router
from routes.search_routes import router as search_router

app = FastAPI(
    title="Personal Knowledge Base API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(document_router)
app.include_router(search_router)


@app.get("/")
async def root():
    return {
        "message": "Personal Knowledge Base API is running"
    }