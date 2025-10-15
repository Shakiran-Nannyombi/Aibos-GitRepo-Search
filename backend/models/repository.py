from pydantic import BaseModel
from typing import Optional
from .repositoryownwer import RepositoryOwner

class Repository(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    stargazers_count: int
    forks_count: int
    language: Optional[str] = None
    updated_at: str
    owner: RepositoryOwner