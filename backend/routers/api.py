from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import httpx
from config import get_settings, Settings
from models.searchresponse import SearchResponse

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
    """Search GitHub repositories"""
    
    # Build search query
    search_query = q
    
    if language:
        search_query += f" language:{language}"
    
    if min_stars:
        search_query += f" stars:>={min_stars}"
    
    # Prepare request parameters
    params = {
        "q": search_query,
        "sort": sort,
        "order": order,
        "page": page,
        "per_page": per_page,
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
                raise HTTPException(
                    status_code=422,
                    detail="Invalid search query. Please check your parameters."
                )
            
            if response.status_code == 403:
                raise HTTPException(
                    status_code=403,
                    detail="API rate limit exceeded. Please try again later or authenticate."
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"GitHub API error: {response.text}"
                )
            
            data = response.json()
            
            return SearchResponse(
                total_count=data["total_count"],
                items=data["items"],
                incomplete_results=data["incomplete_results"]
            )
        
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request timeout. Please try again.")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Connection error: {str(e)}")


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
