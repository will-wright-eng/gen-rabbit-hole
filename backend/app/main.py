import sys
import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from api.endpoints.lessons import router as lesson_router
from api.endpoints.onboarding import router as onboarding_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Learning Tree API",
    description="API for tree-structured learning with LLM integration",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")
app.include_router(lesson_router, prefix="/api/lessons")
app.include_router(onboarding_router, prefix="/api/onboarding")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "localhost"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )
