"""
Async SQLAlchemy 2.0 engine + session factory.

Decision: async engine lets FastAPI handle DB calls without blocking the
event loop, which is important for a public API under load.
"""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """All ORM models inherit from this."""
    pass


# Pool kwargs only apply to real databases (not SQLite)
_is_sqlite = settings.DATABASE_URL.startswith("sqlite")
_pool_kwargs = {} if _is_sqlite else {"pool_pre_ping": True, "pool_size": 10, "max_overflow": 20}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    **_pool_kwargs,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncSession:
    """FastAPI dependency — yields a DB session, always closes it."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
