"""Tests for authentication endpoints."""
import pytest
from httpx import AsyncClient
from app.models.admin import AdminUser


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, admin_user: AdminUser):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "TestPassword123!"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] > 0


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, admin_user: AdminUser):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "WrongPassword!"},
    )
    assert resp.status_code == 401
    assert "Invalid credentials" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "password"},
    )
    assert resp.status_code == 401
    # Same error message — don't reveal whether email exists (OWASP API1)
    assert "Invalid credentials" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_refresh_token_rotation(client: AsyncClient, admin_user: AdminUser):
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "TestPassword123!"},
    )
    assert login.status_code == 200
    refresh_token = login.json()["refresh_token"]

    # First refresh — should succeed
    resp = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()

    # Reusing the old refresh token — should fail (rotation)
    resp2 = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert resp2.status_code == 401


@pytest.mark.asyncio
async def test_admin_route_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/admin/messages")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_admin_route_with_token(client: AsyncClient, admin_token: str):
    resp = await client.get(
        "/api/v1/admin/messages",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_invalid_bearer_token(client: AsyncClient):
    resp = await client.get(
        "/api/v1/admin/messages",
        headers={"Authorization": "Bearer totally.invalid.token"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_brute_force_increments_counter(client: AsyncClient, admin_user: AdminUser):
    """After many failed attempts the account should lock."""
    for _ in range(10):
        await client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "WRONG"},
        )
    # 11th attempt with correct password should fail (locked)
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "TestPassword123!"},
    )
    assert resp.status_code in (401, 403)
