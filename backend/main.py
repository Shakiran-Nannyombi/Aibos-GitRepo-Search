from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, api
import uvicorn
import os

from config import get_settings

settings = get_settings()
app = FastAPI(title="Lens+Github")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include routers
app.include_router(auth.router)
app.include_router(api.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Lens+Github API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth/github",
            "callback": "/auth/callback",
            "search": "/api/search",
        }
    }



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
