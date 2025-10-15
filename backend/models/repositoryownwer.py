from pydantic import BaseModel

class RepositoryOwner(BaseModel):
    login: str
    avatar_url: str