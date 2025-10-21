from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import httpx
import logging
from config import get_settings, Settings
from models.searchresponse import SearchResponse
from models.searchrequest import SearchRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["api"])


@router.get("/search", response_model=SearchResponse)
async def search_repositories(
    q: str = Query(..., description="Search query"),
    language: Optional[str] = Query(None, description="Filter by programming language"),
    min_stars: Optional[int] = Query(None, description="Minimum number of stars"),
    sort: Optional[str] = Query("stars", description="Sort by: stars, forks, or updated"),
    order: Optional[str] = Query("desc", description="Order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(30, ge=1, le=100, description="Results per page"),
    authorization: Optional[str] = None,
    settings: Settings = Depends(get_settings)
):
    """Search GitHub repositories with input validation"""
    
    # Validate input using SearchRequest model
    try:
        search_params = SearchRequest(
            q=q,
            language=language,
            min_stars=min_stars,
            sort=sort,
            order=order,
            page=page,
            per_page=per_page
        )
        logger.info(f"Search request: query='{search_params.q}', page={search_params.page}")
    except ValueError as e:
        logger.warning(f"Invalid search parameters: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    
    # Build search query using validated parameters
    search_query = search_params.q
    
    if search_params.language:
        search_query += f" language:{search_params.language}"
    
    if search_params.min_stars:
        search_query += f" stars:>={search_params.min_stars}"
    
    # Prepare request parameters
    params = {
        "q": search_query,
        "sort": search_params.sort,
        "order": search_params.order,
        "page": search_params.page,
        "per_page": search_params.per_page,
    }
    
    # Prepare headers
    headers = {
        "Accept": "application/vnd.github.v3+json",
    }
    
    # Add authorization if provided
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        headers["Authorization"] = f"Bearer {token}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{settings.github_api_base}/search/repositories",
                params=params,
                headers=headers,
                timeout=30.0,
            )
            
            if response.status_code == 422:
                logger.warning(f"Invalid search query: {search_query}")
                raise HTTPException(
                    status_code=422,
                    detail="Invalid search query. Please check your parameters."
                )
            
            if response.status_code == 403:
                logger.warning("GitHub API rate limit exceeded")
                raise HTTPException(
                    status_code=403,
                    detail="API rate limit exceeded. Please try again later or authenticate."
                )
            
            if response.status_code != 200:
                logger.error(f"GitHub API error: {response.status_code}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail="GitHub API error occurred"
                )
            
            data = response.json()
            
            return SearchResponse(
                total_count=data["total_count"],
                items=data["items"],
                incomplete_results=data["incomplete_results"]
            )
        
        except httpx.TimeoutException:
            logger.error("GitHub API request timeout")
            raise HTTPException(status_code=504, detail="Request timeout. Please try again.")
        except httpx.RequestError as e:
            logger.error(f"GitHub API connection error: {str(e)}")
            raise HTTPException(status_code=503, detail="Connection error occurred")


@router.get("/user")
async def get_user(
    authorization: str,
    settings: Settings = Depends(get_settings)
):
    """Get authenticated user information"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.github_api_base}/user",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return response.json()
