import secrets
import logging
import os
import json
from datetime import datetime, timedelta
import jwt
from fastapi import Request, Header
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
import httpx
from urllib.parse import urlencode, urlparse
from config import get_settings, Settings
from models.user import User
from models.searchrequest import SearchRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


def get_frontend_url(request: Request) -> str:
    """Dynamically determine frontend URL based on request origin"""
    # Check for Origin header first (most reliable)
    origin = request.headers.get("origin")
    if origin:
        return origin
    
    # Check for Referer header as fallback
    referer = request.headers.get("referer")
    if referer:
        parsed = urlparse(referer)
        return f"{parsed.scheme}://{parsed.netloc}"
    
    # Environment variable fallback
    frontend_url = os.environ.get("FRONTEND_URL")
    if frontend_url:
        return frontend_url
    
    # Default based on request host but different port for development
    if request.base_url.hostname in ['localhost', '127.0.0.1']:
        return f"{request.base_url.scheme}://{request.base_url.hostname}:5173"
    
    # Production fallback - same domain as backend
    return f"{request.base_url.scheme}://{request.base_url.hostname}"


def get_callback_url(request: Request) -> str:
    """Dynamically determine callback URL based on request"""
    # For local development
    if request.base_url.hostname in ['localhost', '127.0.0.1']:
        return f"{request.base_url.scheme}://{request.base_url.hostname}:8000/auth/callback"
    
    # For production - use the actual host
    return f"{request.base_url.scheme}://{request.base_url.hostname}/auth/callback"


@router.get("/github")
async def github_auth(
    request: Request, 
    settings: Settings = Depends(get_settings),
    origin: str = Header(None)
):
    """Redirect to GitHub OAuth page with CSRF protection"""
    # Generate CSRF state token
    state = secrets.token_urlsafe(32)
    
    # Get dynamic callback URL
    callback_url = get_callback_url(request)
    
    # Store frontend URL in state for later use
    frontend_url = get_frontend_url(request)
    
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": callback_url,
        "scope": "read:user user:email",
        "state": state
    }
    auth_url = f"{settings.github_oauth_base}/login/oauth/authorize?{urlencode(params)}"
    
    # Create redirect response
    response = RedirectResponse(auth_url)
    
    # Set state and frontend URL in secure cookies
    response.set_cookie(
        "oauth_state", 
        state, 
        max_age=600,  # 10 minutes
        httponly=True,
        secure=request.base_url.scheme == "https",
        samesite="lax"
    )
    
    # Store frontend URL for callback redirect
    response.set_cookie(
        "frontend_url",
        frontend_url,
        max_age=600,  # 10 minutes
        httponly=True,
        secure=request.base_url.scheme == "https",
        samesite="lax"
    )
    
    logger.info(f"Initiating OAuth flow - Frontend: {frontend_url}, Callback: {callback_url}")
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
    
    # Get stored frontend URL
    frontend_url = request.cookies.get("frontend_url")
    if not frontend_url:
        # Fallback to dynamic detection
        frontend_url = get_frontend_url(request)
    
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
                logger.error(f"Token exchange failed: {token_response.status_code}")
                raise HTTPException(status_code=400, detail="Failed to get access token")
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                logger.error("No access token in response")
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
                logger.error(f"User info fetch failed: {user_response.status_code}")
                raise HTTPException(status_code=400, detail="Failed to get user info")
            
            user_data = user_response.json()
            
            # Create User object
            user = User(**user_data)
            
            # Create redirect response to frontend callback URL
            callback_redirect = f"{frontend_url}/auth/callback"
            response = RedirectResponse(url=callback_redirect)
            
            # Determine if we're in production
            is_production = request.base_url.scheme == "https"
            
            # Set secure HTTP-only cookies
            response.set_cookie(
                key="github_token",
                value=access_token,
                max_age=3600,  # 1 hour
                httponly=True,
                secure=is_production,
                samesite="lax"
            )
            
            # Set user data in a cookie that the frontend can read
            response.set_cookie(
                key="user_data",
                value=user.model_dump_json(),
                max_age=3600,
                httponly=False,  # Frontend needs to read this
                secure=is_production,
                samesite="lax"
            )
            
            # Clear temporary cookies
            response.delete_cookie("oauth_state")
            response.delete_cookie("frontend_url")
            
            logger.info(f"OAuth authentication successful for user: {user.login}, redirecting to: {callback_redirect}")
            return response
            
    except Exception as e:
        logger.error(f"OAuth authentication failed: {str(e)}")
        # Redirect to frontend with error
        error_redirect = f"{frontend_url}/auth/error?message=authentication_failed"
        return RedirectResponse(url=error_redirect)


@router.post("/logout")
async def logout(request: Request):
    """Logout user by clearing cookies"""
    frontend_url = get_frontend_url(request)
    
    response = RedirectResponse(url=frontend_url)
    response.delete_cookie("github_token")
    response.delete_cookie("user_data")
    
    logger.info("User logged out successfully")
    return response