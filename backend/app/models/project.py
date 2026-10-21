from __future__ import annotations
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    slug: Mapped[str] = mapped_column(String(256), unique=True, nullable=False, index=True)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    long_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tech_stack: Mapped[List] = mapped_column(JSON, default=list)
    images: Mapped[List] = mapped_column(JSON, default=list)
    github_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    live_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="in_progress", nullable=False)
    category: Mapped[str] = mapped_column(String(32), default="other", nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=0)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
