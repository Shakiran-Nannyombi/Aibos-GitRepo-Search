from pydantic import BaseModel, field_validator
from typing import Optional

class SearchRequest(BaseModel):
    q: str
    language: Optional[str] = None
    min_stars: Optional[int] = None
    sort: Optional[str] = "stars"
    order: Optional[str] = "desc"
    page: int = 1
    per_page: int = 30
    
    @field_validator('q')
    @classmethod
    def validate_query(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Query cannot be empty')
        if len(v) > 256:
            raise ValueError('Query too long')
        return v.strip()
    
    @field_validator('page')
    @classmethod
    def validate_page(cls, v):
        if v < 1 or v > 100:
            raise ValueError('Page must be between 1 and 100')
        return v
    
    @field_validator('per_page')
    @classmethod
    def validate_per_page(cls, v):
        if v < 1 or v > 100:
            raise ValueError('Per page must be between 1 and 100')
        return v