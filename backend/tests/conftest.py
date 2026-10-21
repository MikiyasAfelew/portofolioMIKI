"""
Pytest fixtures — in-memory SQLite, isolated per test.
ENVIRONMENT=testing is set before any app import so rate limiter is bypassed.
"""
from __future__ import annotations

# ── Must happen BEFORE any app imports ────────────────────────────────────────
import os
os.environ.setdefault("ENVIRONMENT", "testing")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault(
    "SECRET_KEY",
    "test-secret-key-for-testing-only-not-production-use-ever-32c",
)
os.environ.setdefault("ADMIN_EMAIL", "seed@admin.com")
os.environ.setdefault("ADMIN_PASSWORD", "TestPassword123!")
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:5173")
os.environ.setdefault("ANALYTICS_SALT", "testsalt1234567890abcdef")
# ─────────────────────────────────────────────────────────────────────────────

import asyncio
import uuid

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import hash_password
from app.db.base import Base, get_db
from app.main import app
from app.models.admin import AdminUser
from app.services.rate_limiter import _memory_store   # clear between tests

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


# ── Session-scoped event loop ─────────────────────────────────────────────────
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


# ── Session-scoped DB engine + schema ────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


# ── Per-test DB session (rolled back after each test) ─────────────────────────
@pytest_asyncio.fixture
async def db_session(test_engine):
    SessionLocal = async_sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with SessionLocal() as session:
        yield session
        await session.rollback()


# ── Clear rate-limit store between tests ──────────────────────────────────────
@pytest.fixture(autouse=True)
def clear_rate_limiter():
    _memory_store.clear()
    yield
    _memory_store.clear()


# ── HTTP client wired to the test DB session ──────────────────────────────────
@pytest_asyncio.fixture
async def client(db_session: AsyncSession):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ── Admin user — unique email per test ────────────────────────────────────────
@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession) -> AdminUser:
    unique_email = f"admin-{uuid.uuid4().hex[:8]}@test.com"
    admin = AdminUser(
        email=unique_email,
        hashed_password=hash_password("TestPassword123!"),
        is_active=True,
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    return admin


# ── Token fixture ─────────────────────────────────────────────────────────────
@pytest_asyncio.fixture
async def admin_token(client: AsyncClient, admin_user: AdminUser) -> str:
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "TestPassword123!"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]
