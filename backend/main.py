"""FastAPI application entry point for CV Pro backend.

Sets up CORS, includes routers, and provides a health check endpoint.
Run with: uvicorn main:app --reload
"""

import logging

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

from config import settings
from routers.cv import router as cv_router
from routers.tools import router as tools_router
from routers.regenerate import router as regenerate_router

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
app.include_router(tools_router)
app.include_router(regenerate_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unhandled exceptions.

    Logs the error and returns a generic 500 response so the frontend
    always gets a JSON error instead of an HTML error page.

    Args:
        request: The incoming request.
        exc: The unhandled exception.

    Returns:
        JSONResponse with 500 status and error detail.
    """
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )


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
