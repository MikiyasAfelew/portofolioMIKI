from __future__ import annotations
from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, field_validator
import re

ProjectStatus = Literal["in_progress", "completed"]
ProjectCategory = Literal["mobile", "web", "security", "other"]


def _make_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    return slug[:120]


class ProjectBase(BaseModel):
    title: str
    short_description: str
    long_description: Optional[str] = None
    tech_stack: List[str] = []
    images: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    status: ProjectStatus = "in_progress"
    category: ProjectCategory = "other"
    featured: bool = False
    order: int = 0


class ProjectCreate(ProjectBase):
    slug: Optional[str] = None

    @field_validator("slug", mode="before")
    @classmethod
    def auto_slug(cls, v: Optional[str]) -> str:
        # slug will be set server-side from title if not provided
        if not v:
            return ""   # placeholder; admin.py sets it from title
        return _make_slug(str(v))


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    images: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    status: Optional[ProjectStatus] = None
    category: Optional[ProjectCategory] = None
    featured: Optional[bool] = None
    order: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    slug: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class ProjectListOut(BaseModel):
    items: List[ProjectOut]
    total: int
    page: int
    size: int
    pages: int
