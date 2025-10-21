from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, api
import uvicorn
import os

app = FastAPI(title="Lens+Github")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


# For Vercel deployment
handler = app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
