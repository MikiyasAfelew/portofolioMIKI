"""
Public read-only endpoints — cached, with ETag support.
All responses include proper Cache-Control headers.
"""
from __future__ import annotations

import math
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.base import get_db
from app.models.education import Education
from app.models.experience import Experience
from app.models.profile import Profile
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill
from app.schemas.education import EducationOut
from app.schemas.experience import ExperienceOut
from app.schemas.profile import ProfileOut
from app.schemas.project import ProjectListOut, ProjectOut
from app.schemas.service import ServiceOut
from app.schemas.skill import SkillOut
from app.services.cache import cache, make_etag

router = APIRouter(tags=["public"])


def _cache_headers(response: Response, ttl: int = 300) -> None:
    response.headers["Cache-Control"] = f"public, max-age={ttl}, stale-while-revalidate=60"


# ── Profile ───────────────────────────────────────────────────────────────────
@router.get("/profile", response_model=ProfileOut)
async def get_profile(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> ProfileOut:
    cached = await cache.get("profile")
    if cached:
        etag = make_etag(cached)
        if request.headers.get("If-None-Match") == etag:
            return Response(status_code=304)
        response.headers["ETag"] = etag
        _cache_headers(response)
        return ProfileOut(**cached)

    profile = await db.scalar(
        select(Profile).options(selectinload(Profile.social_links)).limit(1)
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    data = ProfileOut.model_validate(profile).model_dump()
    await cache.set("profile", data, ttl=600)
    etag = make_etag(data)
    response.headers["ETag"] = etag
    _cache_headers(response, 600)
    return ProfileOut(**data)


# ── Projects ──────────────────────────────────────────────────────────────────
@router.get("/projects", response_model=ProjectListOut)
async def list_projects(
    response: Response,
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None, max_length=100),
) -> ProjectListOut:
    cache_key = f"projects:{page}:{size}:{category}:{status}:{featured}:{search}"
    cached = await cache.get(cache_key)
    if cached:
        _cache_headers(response)
        return ProjectListOut(**cached)

    query = select(Project)
    count_query = select(func.count()).select_from(Project)

    if category:
        query = query.where(Project.category == category)
        count_query = count_query.where(Project.category == category)
    if status:
        query = query.where(Project.status == status)
        count_query = count_query.where(Project.status == status)
    if featured is not None:
        query = query.where(Project.featured == featured)
        count_query = count_query.where(Project.featured == featured)
    if search:
        term = f"%{search}%"
        query = query.where(
            or_(Project.title.ilike(term), Project.short_description.ilike(term))
        )
        count_query = count_query.where(
            or_(Project.title.ilike(term), Project.short_description.ilike(term))
        )

    total = await db.scalar(count_query) or 0
    results = await db.scalars(
        query.order_by(Project.order.asc(), Project.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    )
    items = [ProjectOut.model_validate(p).model_dump() for p in results]

    out = ProjectListOut(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 0,
    )
    await cache.set(cache_key, out.model_dump(), ttl=300)
    _cache_headers(response)
    return out


@router.get("/projects/{slug}", response_model=ProjectOut)
async def get_project(
    slug: str,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> ProjectOut:
    project = await db.scalar(select(Project).where(Project.slug == slug))
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Increment view count
    project.view_count += 1
    await db.commit()

    _cache_headers(response, 60)
    return ProjectOut.model_validate(project)


# ── Skills ────────────────────────────────────────────────────────────────────
@router.get("/skills", response_model=List[SkillOut])
async def list_skills(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> List[SkillOut]:
    cached = await cache.get("skills")
    if cached:
        _cache_headers(response)
        return [SkillOut(**s) for s in cached]

    results = await db.scalars(select(Skill).order_by(Skill.order))
    data = [SkillOut.model_validate(s).model_dump() for s in results]
    await cache.set("skills", data, ttl=600)
    _cache_headers(response, 600)
    return [SkillOut(**s) for s in data]


# ── Education ─────────────────────────────────────────────────────────────────
@router.get("/education", response_model=List[EducationOut])
async def list_education(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> List[EducationOut]:
    results = await db.scalars(select(Education).order_by(Education.order))
    _cache_headers(response, 600)
    return [EducationOut.model_validate(e) for e in results]


# ── Experience ────────────────────────────────────────────────────────────────
@router.get("/experience", response_model=List[ExperienceOut])
async def list_experience(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> List[ExperienceOut]:
    results = await db.scalars(select(Experience).order_by(Experience.order))
    _cache_headers(response, 300)
    return [ExperienceOut.model_validate(e) for e in results]


# ── Services ──────────────────────────────────────────────────────────────────
@router.get("/services", response_model=List[ServiceOut])
async def list_services(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> List[ServiceOut]:
    results = await db.scalars(select(Service).order_by(Service.order))
    _cache_headers(response, 600)
    return [ServiceOut.model_validate(s) for s in results]
