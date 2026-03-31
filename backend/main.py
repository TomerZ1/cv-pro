"""FastAPI application entry point for CV Pro backend.

Sets up CORS, includes routers, and provides a health check endpoint.
Run with: uvicorn main:app --reload
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers.cv import router as cv_router

# Create the FastAPI application
app = FastAPI(
    title="CV Pro API",
    version="1.0.0",
    description="Backend API for CV Pro — a personal CV tailoring tool.",
)

# CORS — allow frontend dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Configured frontend port
        "http://localhost:5173",   # Vite default port (fallback)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cv_router)


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint.

    Returns:
        Dict with status "ok" if the server is running.
    """
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True,
    )
