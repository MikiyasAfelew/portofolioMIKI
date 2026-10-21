from __future__ import annotations
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    cv_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    social_links: Mapped[List["SocialLink"]] = relationship(
        "SocialLink", back_populates="profile", cascade="all, delete-orphan"
    )


class SocialLink(Base):
    __tablename__ = "social_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
    platform: Mapped[str] = mapped_column(String(64), nullable=False)
    url: Mapped[str] = mapped_column(String(512), nullable=False)
    handle: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)

    profile: Mapped["Profile"] = relationship("Profile", back_populates="social_links")
