from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: int
    login: str
    avatar_url: str
    name: Optional[str] = None
    bio: Optional[str] = None
