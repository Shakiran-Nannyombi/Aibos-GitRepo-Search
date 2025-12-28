from sqlalchemy import Column, Integer, String
from database import Base

class LocalUser(Base):
    __tablename__ = "local_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    avatar_url = Column(String, default="https://github.com/github.png")
    github_id = Column(Integer, unique=True, nullable=True)
    github_token = Column(String, nullable=True)
