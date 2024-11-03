from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints.lessons import router as lesson_router
from app.api.endpoints.onboarding import router as onboarding_router
from app.api.endpoints.tree import router as tree_router


app = FastAPI(title="Learning Roadmap API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(onboarding_router)
app.include_router(lesson_router)
app.include_router(tree_router)


@app.get("/")
async def root() -> dict:
    return {"message": "Welcome to the Learning Roadmap API"}
