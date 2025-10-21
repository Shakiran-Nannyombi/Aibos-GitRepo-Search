from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    github_client_id: str
    github_client_secret: str
    frontend_url: str = "http://localhost:5173"
    secret_key: str = "default-secret-key-change-in-production-12345"
    github_api_base: str = "https://api.github.com"
    github_oauth_base: str = "https://github.com"
    
    model_config = SettingsConfigDict(env_file=".env")


@lru_cache()
def get_settings():
    return Settings()
