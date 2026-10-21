"""Tests for public read endpoints."""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.skill import Skill


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_profile_404_when_empty(client: AsyncClient):
    resp = await client.get("/api/v1/profile")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_projects_empty_list(client: AsyncClient):
    resp = await client.get("/api/v1/projects")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_projects_pagination(client: AsyncClient, db_session: AsyncSession):
    for i in range(5):
        db_session.add(Project(
            title=f"Project {i}",
            slug=f"project-{i}",
            short_description="Test",
            status="completed",
            category="web",
        ))
    await db_session.commit()

    resp = await client.get("/api/v1/projects?page=1&size=2")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) <= 2
    assert data["total"] >= 5


@pytest.mark.asyncio
async def test_project_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/projects/nonexistent-slug")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_skills_list(client: AsyncClient, db_session: AsyncSession):
    db_session.add(Skill(name="Python", category="programming", order=0))
    await db_session.commit()
    resp = await client.get("/api/v1/skills")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_cache_control_headers(client: AsyncClient):
    resp = await client.get("/api/v1/projects")
    assert "cache-control" in resp.headers


@pytest.mark.asyncio
async def test_security_headers_present(client: AsyncClient):
    resp = await client.get("/api/v1/health")
    assert resp.headers.get("x-content-type-options") == "nosniff"
    assert resp.headers.get("x-frame-options") == "DENY"
