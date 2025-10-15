from pydantic import BaseModel
from typing import List
from .repository import Repository

class SearchResponse(BaseModel):
    total_count: int
    items: List[Repository]
    incomplete_results: bool