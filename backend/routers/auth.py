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
    # Use the current request URL to build the callback URL
    import os
    vercel_url = os.environ.get("VERCEL_URL")
    if vercel_url:
        backend_callback_url = f"https://{vercel_url}/auth/callback"
    else:
        backend_callback_url = "http://localhost:8000/auth/callback"
    
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": backend_callback_url,
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
    print(f"Received callback with code: {code[:10]}...")
    
    try:
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
            
            print(f"Token response status: {token_response.status_code}")
            print(f"Token response body: {token_response.text}")
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to get access token: {token_response.text}")
            
            token_data = token_response.json()
            print(f"Token data: {token_data}")
            access_token = token_data.get("access_token")
            
            if not access_token:
                error_msg = token_data.get("error_description", token_data.get("error", "No access token received"))
                raise HTTPException(status_code=400, detail=f"No access token received: {error_msg}")
            
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
            
            # Convert user to JSON string
            import json
            user_json = json.dumps(user.model_dump())
            
            # Redirect back to frontend with token and user data
            redirect_params = {
                "token": access_token,
                "user": user_json,
            }
            redirect_url = f"{settings.frontend_url}/auth/callback?{urlencode(redirect_params)}"
            print(f"Redirecting to: {redirect_url}")
            return RedirectResponse(redirect_url)
    except Exception as e:
        print(f"Error in callback: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")
