from pydantic import BaseModel
from typing import Optional

class SearchParams(BaseModel):
    q: str
    language: Optional[str] = None
    min_stars: Optional[int] = None
    sort: Optional[str] = "stars"
    order: Optional[str] = "desc"
    page: int = 1
    per_page: int = 30
