import pytest
from fastapi.testclient import TestClient
import respx
import httpx
from unittest.mock import patch
import json


def test_github_auth_redirect(client: TestClient):
    """Test GitHub OAuth redirect"""
    response = client.get("/auth/github", follow_redirects=False)
    
    assert response.status_code == 307  # Redirect response
    location = response.headers["location"]
    
    assert "github.com/login/oauth/authorize" in location
    assert "client_id=test_client_id" in location
    assert "scope=read%3Auser+user%3Aemail" in location


@respx.mock
def test_github_callback_success(client: TestClient):
    """Test successful GitHub OAuth callback"""
    # Mock GitHub token exchange
    respx.post("https://github.com/login/oauth/access_token").mock(
        return_value=httpx.Response(
            200,
            json={"access_token": "test_access_token", "token_type": "bearer"}
        )
    )
    
    # Mock GitHub user API
    respx.get("https://api.github.com/user").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": 12345,
                "login": "testuser",
                "avatar_url": "https://github.com/images/error/testuser_happy.gif",
                "name": "Test User",
                "bio": "Test bio"
            }
        )
    )
    
    # Set oauth_state cookie and call with state parameter
    client.cookies.set("oauth_state", "test_state")
    response = client.get("/auth/callback?code=test_code&state=test_state", follow_redirects=False)
    
    assert response.status_code == 307  # Redirect to frontend
    location = response.headers["location"]
    
    assert "localhost:3000/auth/callback" in location
    # Check for secure cookies instead of URL parameters
    assert "github_token" in response.cookies
    assert "user_data" in response.cookies


@respx.mock 
def test_github_callback_token_error(client: TestClient):
    """Test GitHub callback with token exchange error"""
    # Mock failed token exchange
    respx.post("https://github.com/login/oauth/access_token").mock(
        return_value=httpx.Response(400, json={"error": "bad_verification_code"})
    )
    
    # Set oauth_state cookie and call with state parameter
    client.cookies.set("oauth_state", "test_state")
    response = client.get("/auth/callback?code=invalid_code&state=test_state", follow_redirects=False)
    
    assert response.status_code == 307
    assert "auth/error?message=authentication_failed" in response.headers["location"]


@respx.mock
def test_github_callback_user_error(client: TestClient):
    """Test GitHub callback with user info error"""
    # Mock successful token exchange
    respx.post("https://github.com/login/oauth/access_token").mock(
        return_value=httpx.Response(
            200,
            json={"access_token": "test_access_token"}
        )
    )
    
    # Mock failed user API call
    respx.get("https://api.github.com/user").mock(
        return_value=httpx.Response(401, json={"message": "Bad credentials"})
    )
    
    # Set oauth_state cookie and call with state parameter
    client.cookies.set("oauth_state", "test_state")
    response = client.get("/auth/callback?code=test_code&state=test_state", follow_redirects=False)
    
    assert response.status_code == 307
    assert "auth/error?message=authentication_failed" in response.headers["location"]


def test_github_callback_missing_code(client: TestClient):
    """Test GitHub callback without code parameter"""
    response = client.get("/auth/callback")
    
    assert response.status_code == 422  # Validation error for missing required parameter


def test_github_callback_invalid_state(client: TestClient):
    """Test GitHub callback with invalid state parameter"""
    # Set different state in cookie vs URL
    client.cookies.set("oauth_state", "stored_state")
    response = client.get("/auth/callback?code=test_code&state=different_state")
    
    assert response.status_code == 400
    assert "Invalid state parameter" in response.json()["detail"]


def test_github_callback_missing_state_cookie(client: TestClient):
    """Test GitHub callback without state cookie"""
    response = client.get("/auth/callback?code=test_code&state=test_state")
    
    assert response.status_code == 400
    assert "Invalid state parameter" in response.json()["detail"]
