import pytest
from fastapi.testclient import TestClient
import respx
import httpx


@respx.mock
def test_search_repositories_success(client: TestClient):
    """Test successful repository search"""
    # Mocking GitHub search API
    respx.get("https://api.github.com/search/repositories").mock(
        return_value=httpx.Response(
            200,
            json={
                "total_count": 2,
                "incomplete_results": False,
                "items": [
                    {
                        "id": 1,
                        "name": "test-repo",
                        "full_name": "user/test-repo",
                        "description": "A test repository",
                        "html_url": "https://github.com/user/test-repo",
                        "stargazers_count": 100,
                        "forks_count": 20,
                        "language": "Python",
                        "updated_at": "2023-01-01T00:00:00Z",
                        "owner": {
                            "login": "user",
                            "avatar_url": "https://github.com/images/error/user_happy.gif"
                        }
                    }
                ]
            }
        )
    )
    
    response = client.get("/api/search?q=test")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_count"] == 2
    assert data["incomplete_results"] is False
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "test-repo"


def test_search_repositories_with_filters(client: TestClient):
    """Test repository search with filters"""
    with respx.mock:
        respx.get("https://api.github.com/search/repositories").mock(
            return_value=httpx.Response(
                200,
                json={
                    "total_count": 1,
                    "incomplete_results": False,
                    "items": []
                }
            )
        )
        
        response = client.get(
            "/api/search?q=test&language=python&min_stars=100&sort=stars&order=desc&page=1&per_page=10"
        )
        
        assert response.status_code == 200
        
        # Verify the request was made with correct parameters
        request = respx.calls.last.request
        assert "q=test+language%3Apython+stars%3A%3E%3D100" in str(request.url)
        assert "sort=stars" in str(request.url)
        assert "order=desc" in str(request.url)


@respx.mock
def test_search_repositories_with_auth(client: TestClient):
    """Test repository search with authentication"""
    respx.get("https://api.github.com/search/repositories").mock(
        return_value=httpx.Response(
            200,
            json={
                "total_count": 0,
                "incomplete_results": False,
                "items": []
            }
        )
    )
    
    response = client.get("/api/search?q=test&authorization=Bearer test_token")
    
    assert response.status_code == 200
    
    # Verify authorization header was passed to GitHub API
    request = respx.calls.last.request
    assert request.headers["Authorization"] == "Bearer test_token"


@respx.mock
def test_search_repositories_rate_limit(client: TestClient):
    """Test repository search with rate limit error"""
    respx.get("https://api.github.com/search/repositories").mock(
        return_value=httpx.Response(403, json={"message": "API rate limit exceeded"})
    )
    
    response = client.get("/api/search?q=test")
    
    assert response.status_code == 403
    assert "rate limit exceeded" in response.json()["detail"]


@respx.mock
def test_search_repositories_invalid_query(client: TestClient):
    """Test repository search with invalid query"""
    respx.get("https://api.github.com/search/repositories").mock(
        return_value=httpx.Response(422, json={"message": "Validation Failed"})
    )
    
    response = client.get("/api/search?q=")
    
    assert response.status_code == 422
    assert "Invalid search query" in response.json()["detail"]


@respx.mock
def test_get_user_success(client: TestClient):
    """Test successful user info retrieval"""
    respx.get("https://api.github.com/user").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": 12345,
                "login": "testuser",
                "name": "Test User",
                "avatar_url": "https://github.com/images/error/testuser_happy.gif"
            }
        )
    )
    
    response = client.get("/api/user?authorization=Bearer test_token")
    
    assert response.status_code == 200
    data = response.json()
    assert data["login"] == "testuser"
    assert data["id"] == 12345


def test_get_user_missing_auth(client: TestClient):
    """Test user info retrieval without authorization"""
    response = client.get("/api/user")
    
    assert response.status_code == 422  # Missing required parameter


def test_get_user_invalid_auth_format(client: TestClient):
    """Test user info retrieval with invalid auth format"""
    response = client.get("/api/user?authorization=InvalidFormat token")
    
    assert response.status_code == 401
    assert "Invalid authorization header" in response.json()["detail"]


@respx.mock
def test_get_user_invalid_token(client: TestClient):
    """Test user info retrieval with invalid token"""
    respx.get("https://api.github.com/user").mock(
        return_value=httpx.Response(401, json={"message": "Bad credentials"})
    )
    
    response = client.get("/api/user?authorization=Bearer invalid_token")
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


def test_search_pagination_validation(client: TestClient):
    """Test search endpoint pagination validation"""
    # Test invalid page number
    response = client.get("/api/search?q=test&page=0")
    assert response.status_code == 422
    
    # Test invalid per_page number
    response = client.get("/api/search?q=test&per_page=101")
    assert response.status_code == 422
