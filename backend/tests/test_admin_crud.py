"""Tests for admin CRUD operations."""
import pytest
from httpx import AsyncClient


AUTH = lambda token: {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, admin_token: str):
    resp = await client.post(
        "/api/v1/admin/projects",
        json={
            "title": "Test Project Alpha",
            "short_description": "A test project",
            "status": "in_progress",
            "category": "web",
            "tech_stack": ["Python", "FastAPI"],
        },
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["title"] == "Test Project Alpha"
    assert data["slug"] == "test-project-alpha"
    assert data["id"] > 0


@pytest.mark.asyncio
async def test_update_project(client: AsyncClient, admin_token: str):
    create = await client.post(
        "/api/v1/admin/projects",
        json={"title": "Update Me Beta", "short_description": "desc", "category": "web", "status": "in_progress"},
        headers=AUTH(admin_token),
    )
    assert create.status_code == 201
    pid = create.json()["id"]

    resp = await client.put(
        f"/api/v1/admin/projects/{pid}",
        json={"status": "completed"},
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "completed"


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient, admin_token: str):
    create = await client.post(
        "/api/v1/admin/projects",
        json={"title": "Delete Me Gamma", "short_description": "desc", "category": "web", "status": "in_progress"},
        headers=AUTH(admin_token),
    )
    assert create.status_code == 201
    pid = create.json()["id"]

    resp = await client.delete(
        f"/api/v1/admin/projects/{pid}",
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_create_skill(client: AsyncClient, admin_token: str):
    resp = await client.post(
        "/api/v1/admin/skills",
        json={"name": "Rust", "category": "programming"},
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 201
    assert resp.json()["name"] == "Rust"


@pytest.mark.asyncio
async def test_duplicate_slug_rejected(client: AsyncClient, admin_token: str):
    payload = {
        "title": "Unique Title Delta",
        "short_description": "d",
        "category": "web",
        "status": "in_progress",
    }
    r1 = await client.post("/api/v1/admin/projects", json=payload, headers=AUTH(admin_token))
    assert r1.status_code == 201

    # Same title → same slug → conflict
    r2 = await client.post("/api/v1/admin/projects", json=payload, headers=AUTH(admin_token))
    assert r2.status_code == 409


@pytest.mark.asyncio
async def test_create_education(client: AsyncClient, admin_token: str):
    resp = await client.post(
        "/api/v1/admin/education",
        json={
            "institution": "Test University",
            "degree": "BSc Computer Science",
            "start_year": 2022,
            "end_year": 2026,
        },
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 201
    assert resp.json()["institution"] == "Test University"


@pytest.mark.asyncio
async def test_create_service(client: AsyncClient, admin_token: str):
    resp = await client.post(
        "/api/v1/admin/services",
        json={"title": "Mobile Dev", "description": "Build mobile apps"},
        headers=AUTH(admin_token),
    )
    assert resp.status_code == 201
    assert resp.json()["title"] == "Mobile Dev"


@pytest.mark.asyncio
async def test_admin_list_projects(client: AsyncClient, admin_token: str):
    resp = await client.get("/api/v1/admin/projects", headers=AUTH(admin_token))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
