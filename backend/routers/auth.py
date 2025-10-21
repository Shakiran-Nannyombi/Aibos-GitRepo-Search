import secrets
import logging
from fastapi import Request
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
import httpx
from urllib.parse import urlencode
from config import get_settings, Settings
from models.user import User
from models.searchrequest import SearchRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/github")
async def github_auth(request: Request, settings: Settings = Depends(get_settings)):
    """Redirect to GitHub OAuth page with CSRF protection"""
    # Generate CSRF state token
    state = secrets.token_urlsafe(32)
    
    # In production, store state in Redis/database
    # For now, we'll validate it in callback
    
    import os
    # Get frontend URL from environment variables
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    
    # For local development, the backend and frontend are on different ports
    if request.base_url.hostname in ['localhost', '127.0.0.1']:
        callback_url = f"{request.base_url.scheme}://{request.base_url.hostname}:8000/auth/callback"
    else:
        callback_url = f"{request.base_url.scheme}://{request.base_url.hostname}/auth/callback"
    
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": callback_url,
        "scope": "read:user user:email",
        "state": state  # CSRF protection
    }
    auth_url = f"{settings.github_oauth_base}/login/oauth/authorize?{urlencode(params)}"
    
    # Set state in secure cookie
    response = RedirectResponse(auth_url)
    response.set_cookie(
        "oauth_state", 
        state, 
        max_age=600,  # 10 minutes
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return response


@router.get("/callback")
async def github_callback(
    code: str, 
    state: str,
    request: Request,
    settings: Settings = Depends(get_settings)
):
    """Handle GitHub OAuth callback with CSRF validation"""
    logger.info("Processing OAuth callback")
    
    # Validate CSRF state
    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        logger.warning("Invalid state parameter in OAuth callback")
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
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
            
            # Create JWT token
            token_data = {
                "sub": str(user_data["id"]),
                "name": user_data["name"],
                "login": user_data["login"],
                "exp": datetime.utcnow() + timedelta(days=1)
            }
            token = jwt.encode(token_data, JWT_SECRET, algorithm="HS256")
            
            # Serialize user data for cookie
            user_data_json = json.dumps(user_data)
            
            # Get frontend URL from environment variables
            frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
            
            # Create redirect response to frontend callback URL
            response = RedirectResponse(url=f"{frontend_url}/auth/callback")
            
            # Set secure HTTP-only cookies
            response.set_cookie(
                key="github_token",
                value=token,
                max_age=3600,  # 1 hour
                httponly=True,
                secure=os.environ.get("NODE_ENV") == "production",
                samesite="lax"
            )
            
            # Set user data in a cookie that the frontend can read
            response.set_cookie(
                key="user_data",
                value=user.model_dump_json(),
                max_age=3600,
                httponly=False,  # Frontend needs to read this
                secure=os.environ.get("NODE_ENV") == "production",
                samesite="lax"
            )
            
            # Clear state cookie
            response.delete_cookie("oauth_state")
            logger.info(f"OAuth authentication successful for user: {user.login}")
            return response
            
    except Exception as e:
        logger.error(f"OAuth authentication failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")