import sys
import logging
from typing import List
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv
import os

from api.routes import router
from services.llm_service import LLMService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def get_allowed_origins() -> List[str]:
    """Get allowed origins from environment or default to localhost"""
    origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    return origins_str.split(",")

def create_application() -> FastAPI:
    """Create and configure FastAPI application"""
    app = FastAPI(
        title="Learning Tree API",
        description="API for tree-structured learning with LLM integration",
        version="0.1.0",
        docs_url="/api/docs",  # Swagger UI path
        redoc_url="/api/redoc",  # ReDoc path
        openapi_url="/api/openapi.json"  # OpenAPI schema path
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routes
    app.include_router(router, prefix="/api")

    return app

# Create FastAPI instance
app = create_application()

# Initialize LLM service
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("GOOGLE_API_KEY not found in environment variables")
            sys.exit(1)

        llm_service = LLMService()
        llm_service.initialize_model(api_key)
        logger.info("LLM service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize LLM service: {e}")
        sys.exit(1)

# Error handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation Error",
            "errors": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "message": str(exc) if os.getenv("DEBUG") == "true" else "An unexpected error occurred"
        }
    )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    # Get configuration from environment
    host = os.getenv("API_HOST", "localhost")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("DEBUG", "false").lower() == "true"
    
    # Log startup configuration
    logger.info(f"Starting server on {host}:{port}")
    logger.info(f"Debug mode: {reload}")
    logger.info(f"Allowed origins: {get_allowed_origins()}")
    
    # Run application
    try:
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)
