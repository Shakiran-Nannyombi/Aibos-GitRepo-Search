import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock
import os

# Set test environment variables
os.environ.update({
    "GITHUB_CLIENT_ID": "test_client_id",
    "GITHUB_CLIENT_SECRET": "test_client_secret", 
    "SECRET_KEY": "test_secret_key",
    "FRONTEND_URL": "http://localhost:3000"
})

from main import app
from config import Settings, get_settings


def get_test_settings():
    """Override settings for testing"""
    return Settings(
        github_client_id="test_client_id",
        github_client_secret="test_client_secret",
        secret_key="test_secret_key",
        frontend_url="http://localhost:3000",
        github_api_base="https://api.github.com",
        github_oauth_base="https://github.com"
    )


@pytest.fixture
def client():
    """Create test client with overridden settings"""
    app.dependency_overrides[get_settings] = get_test_settings
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def mock_settings():
    """Mock settings for testing"""
    return get_test_settings()
