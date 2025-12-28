from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, api, local_auth
import uvicorn
import os

from config import get_settings

settings = get_settings()
app = FastAPI(title="Lens+Github API")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(local_auth.router)
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
