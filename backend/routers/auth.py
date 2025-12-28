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


from database import get_db
from models.local_user import LocalUser
from sqlalchemy.orm import Session
from security import SECRET_KEY, ALGORITHM
from jose import jwt as jose_jwt

@router.get("/github")
async def github_auth(
    request: Request, 
    settings: Settings = Depends(get_settings),
    origin: str = Header(None),
    token: str = None  # Local token for linking
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
    cookie_params = {
        "max_age": 600,
        "httponly": True,
        "secure": request.base_url.scheme == "https",
        "samesite": "lax"
    }
    
    response.set_cookie("oauth_state", state, **cookie_params)
    response.set_cookie("frontend_url", frontend_url, **cookie_params)
    
    if token:
        response.set_cookie("link_token", token, **cookie_params)
    
    logger.info(f"Initiating OAuth flow - Frontend: {frontend_url}, Link: {token is not None}")
    return response


@router.get("/callback")
async def github_callback(
    code: str, 
    state: str,
    request: Request,
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db)
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
        frontend_url = get_frontend_url(request)
    
    # Check for linking intent
    link_token = request.cookies.get("link_token")
    
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
            user_data = user_response.json()
            
            # If linking, update local user
            if link_token:
                try:
                    payload = jose_jwt.decode(link_token, SECRET_KEY, algorithms=[ALGORITHM])
                    email = payload.get("sub")
                    if email:
                        local_user = db.query(LocalUser).filter(LocalUser.email == email).first()
                        if local_user:
                            local_user.github_id = user_data.get("id")
                            local_user.github_token = access_token
                            local_user.avatar_url = user_data.get("avatar_url")
                            db.commit()
                            logger.info(f"Linked GitHub account {user_data.get('login')} to local user {email}")
                except Exception as link_err:
                    logger.error(f"Failed to link account: {str(link_err)}")
            
            # Create redirect response
            callback_redirect = f"{frontend_url}/auth/callback"
            response = RedirectResponse(url=callback_redirect)
            
            is_production = request.base_url.scheme == "https"
            
            # Set cookies
            response.set_cookie(
                key="github_token",
                value=access_token,
                max_age=3600,
                httponly=True,
                secure=is_production,
                samesite="lax"
            )
            
            response.set_cookie(
                key="user_data",
                value=json.dumps(user_data),
                max_age=3600,
                httponly=False,
                secure=is_production,
                samesite="lax"
            )
            
            # Clear temporary cookies
            response.delete_cookie("oauth_state")
            response.delete_cookie("frontend_url")
            response.delete_cookie("link_token")
            
            return response
            
    except Exception as e:
        logger.error(f"OAuth authentication failed: {str(e)}")
        error_redirect = f"{frontend_url}/auth/error?message=authentication_failed"
        return RedirectResponse(url=error_redirect)
            
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