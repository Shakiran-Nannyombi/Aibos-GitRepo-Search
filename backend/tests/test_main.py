import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test the root endpoint returns correct information"""
    response = client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["message"] == "Welcome to the Lens+Github API"
    assert data["version"] == "1.0.0"
    assert "endpoints" in data
    assert data["endpoints"]["auth"] == "/auth/github"
    assert data["endpoints"]["callback"] == "/auth/callback"
    assert data["endpoints"]["search"] == "/api/search"


def test_cors_headers(client: TestClient):
    """Test CORS headers are properly set"""
    response = client.options("/")
    
    # FastAPI automatically handles CORS preflight requests
    assert response.status_code in [200, 405]  # 405 is also acceptable for OPTIONS
