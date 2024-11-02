from fastapi import FastAPI

from app.api.endpoints.onboarding import router as onboarding_router


app = FastAPI(title="Learning Roadmap API")

app.include_router(onboarding_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Learning Roadmap API"}
