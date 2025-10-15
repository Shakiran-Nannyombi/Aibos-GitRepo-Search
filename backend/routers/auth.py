from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
import httpx
from urllib.parse import urlencode
from config import get_settings, Settings
from models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/github")
async def github_auth(settings: Settings = Depends(get_settings)):
    """Redirect to GitHub OAuth page"""
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": f"{settings.frontend_url}/auth/callback",
        "scope": "read:user user:email",
    }
    auth_url = f"{settings.github_oauth_base}/login/oauth/authorize?{urlencode(params)}"
    return RedirectResponse(auth_url)


@router.get("/callback")
async def github_callback(
    code: str,
    settings: Settings = Depends(get_settings)
):
    """Handle GitHub OAuth callback"""
    async with httpx.AsyncClient() as client:
        # Exchange code for access token
        token_response = await client.post(
            f"{settings.github_oauth_base}/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            }
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
        
        # Get user information
        user_response = await client.get(
            f"{settings.github_api_base}/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_data = user_response.json()
        
        # Create user object
        user = User(
            id=user_data["id"],
            login=user_data["login"],
            avatar_url=user_data["avatar_url"],
            name=user_data.get("name"),
            bio=user_data.get("bio"),
        )
        
        # Redirect back to frontend with token and user data
        redirect_params = {
            "token": access_token,
            "user": user.model_dump_json(),
        }
        return RedirectResponse(f"{settings.frontend_url}/auth/callback?{urlencode(redirect_params)}")
