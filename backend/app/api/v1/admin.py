"""
Admin CRUD endpoints — all protected by JWT.
Separated from public routes (OWASP API5: Broken Function Level Authorization).
"""
from __future__ import annotations

import math
import os
import shutil
from pathlib import Path
from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Query,
    Response,
    UploadFile,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_admin
from app.core.config import settings
from app.core.security import generate_secure_filename
from app.db.base import get_db
from app.models.admin import AdminUser
from app.models.contact import ContactMessage
from app.models.education import Education
from app.models.experience import Experience
from app.models.github_repo import GitHubRepo
from app.models.profile import Profile, SocialLink
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill
from app.schemas.contact import ContactListOut, ContactOut
from app.schemas.education import EducationCreate, EducationOut, EducationUpdate
from app.schemas.experience import ExperienceCreate, ExperienceOut, ExperienceUpdate
from app.schemas.profile import ProfileOut, ProfileUpdate
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate
from app.schemas.skill import SkillCreate, SkillOut, SkillUpdate

# Re-use slug helper
import re as _re
def _make_slug(title: str) -> str:
    s = title.lower().strip()
    s = _re.sub(r"[^\w\s-]", "", s)
    s = _re.sub(r"[\s_]+", "-", s)
    return s[:120]
from app.services.cache import cache
from app.services.github_sync import sync_github_repos

router = APIRouter(prefix="/admin", tags=["admin"])

# ── Profile ───────────────────────────────────────────────────────────────────
@router.put("/profile", response_model=ProfileOut)
async def update_profile(
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ProfileOut:
    profile = await db.scalar(
        select(Profile).options(selectinload(Profile.social_links)).limit(1)
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found — run seed first")

    for field, value in body.model_dump(exclude_unset=True, exclude={"social_links"}).items():
        setattr(profile, field, value)

    if body.social_links is not None:
        # Replace social links
        for link in list(profile.social_links):
            await db.delete(link)
        for sl in body.social_links:
            db.add(SocialLink(profile_id=profile.id, **sl.model_dump()))

    await db.commit()
    await db.refresh(profile)
    await cache.delete("profile")
    return ProfileOut.model_validate(profile)


# ── Projects ──────────────────────────────────────────────────────────────────
@router.post("/projects", response_model=ProjectOut, status_code=201)
async def create_project(
    body: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ProjectOut:
    # Derive slug from title if not provided
    slug = body.slug if body.slug else _make_slug(body.title)
    existing = await db.scalar(select(Project).where(Project.slug == slug))
    if existing:
        raise HTTPException(status_code=409, detail=f"Slug '{slug}' already exists")
    data = body.model_dump()
    data["slug"] = slug
    project = Project(**data)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    await cache.delete_pattern("projects:")
    return ProjectOut.model_validate(project)


@router.get("/projects", response_model=List[ProjectOut])
async def admin_list_projects(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> List[ProjectOut]:
    results = await db.scalars(
        select(Project).order_by(Project.order.asc(), Project.created_at.desc())
    )
    return [ProjectOut.model_validate(p) for p in results]


@router.put("/projects/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    body: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ProjectOut:
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    await db.commit()
    await db.refresh(project)
    await cache.delete_pattern("projects:")
    return ProjectOut.model_validate(project)


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    await cache.delete_pattern("projects:")
    return Response(status_code=204)


# ── Skills ────────────────────────────────────────────────────────────────────
@router.post("/skills", response_model=SkillOut, status_code=201)
async def create_skill(
    body: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> SkillOut:
    skill = Skill(**body.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    await cache.delete("skills")
    return SkillOut.model_validate(skill)


@router.put("/skills/{skill_id}", response_model=SkillOut)
async def update_skill(
    skill_id: int,
    body: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> SkillOut:
    skill = await db.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
    await db.commit()
    await db.refresh(skill)
    await cache.delete("skills")
    return SkillOut.model_validate(skill)


@router.delete("/skills/{skill_id}", status_code=204)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    skill = await db.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    await db.delete(skill)
    await db.commit()
    await cache.delete("skills")
    return Response(status_code=204)


# ── Education ─────────────────────────────────────────────────────────────────
@router.post("/education", response_model=EducationOut, status_code=201)
async def create_education(
    body: EducationCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> EducationOut:
    edu = Education(**body.model_dump())
    db.add(edu)
    await db.commit()
    await db.refresh(edu)
    return EducationOut.model_validate(edu)


@router.put("/education/{edu_id}", response_model=EducationOut)
async def update_education(
    edu_id: int,
    body: EducationUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> EducationOut:
    edu = await db.get(Education, edu_id)
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(edu, field, value)
    await db.commit()
    await db.refresh(edu)
    return EducationOut.model_validate(edu)


@router.delete("/education/{edu_id}", status_code=204)
async def delete_education(
    edu_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    edu = await db.get(Education, edu_id)
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    await db.delete(edu)
    await db.commit()
    return Response(status_code=204)


# ── Experience ────────────────────────────────────────────────────────────────
@router.post("/experience", response_model=ExperienceOut, status_code=201)
async def create_experience(
    body: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ExperienceOut:
    exp = Experience(**body.model_dump())
    db.add(exp)
    await db.commit()
    await db.refresh(exp)
    return ExperienceOut.model_validate(exp)


@router.put("/experience/{exp_id}", response_model=ExperienceOut)
async def update_experience(
    exp_id: int,
    body: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ExperienceOut:
    exp = await db.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(exp, field, value)
    await db.commit()
    await db.refresh(exp)
    return ExperienceOut.model_validate(exp)


@router.delete("/experience/{exp_id}", status_code=204)
async def delete_experience(
    exp_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    exp = await db.get(Experience, exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    await db.delete(exp)
    await db.commit()
    return Response(status_code=204)


# ── Services ──────────────────────────────────────────────────────────────────
@router.post("/services", response_model=ServiceOut, status_code=201)
async def create_service(
    body: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ServiceOut:
    svc = Service(**body.model_dump())
    db.add(svc)
    await db.commit()
    await db.refresh(svc)
    return ServiceOut.model_validate(svc)


@router.put("/services/{svc_id}", response_model=ServiceOut)
async def update_service(
    svc_id: int,
    body: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ServiceOut:
    svc = await db.get(Service, svc_id)
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    await db.commit()
    await db.refresh(svc)
    return ServiceOut.model_validate(svc)


@router.delete("/services/{svc_id}", status_code=204)
async def delete_service(
    svc_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    svc = await db.get(Service, svc_id)
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.delete(svc)
    await db.commit()
    return Response(status_code=204)


# ── Contact messages ──────────────────────────────────────────────────────────
@router.get("/messages", response_model=ContactListOut)
async def list_messages(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
) -> ContactListOut:
    q = select(ContactMessage).order_by(ContactMessage.created_at.desc())
    cq = select(func.count()).select_from(ContactMessage)
    if unread_only:
        q = q.where(ContactMessage.is_read == False)
        cq = cq.where(ContactMessage.is_read == False)
    total = await db.scalar(cq) or 0
    results = await db.scalars(q.offset((page - 1) * size).limit(size))
    return ContactListOut(
        items=[ContactOut.model_validate(m) for m in results],
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 0,
    )


@router.patch("/messages/{msg_id}/read", response_model=ContactOut)
async def mark_read(
    msg_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> ContactOut:
    msg = await db.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    await db.commit()
    return ContactOut.model_validate(msg)


@router.delete("/messages/{msg_id}", status_code=204)
async def delete_message(
    msg_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> Response:
    msg = await db.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.delete(msg)
    await db.commit()
    return Response(status_code=204)


# ── File upload ───────────────────────────────────────────────────────────────
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
}
MAX_SIZE = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post("/upload", status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
) -> dict:
    """
    Secure upload:
    - Allowlist of MIME types only
    - Size limit enforced before reading
    - Randomised filename (no path traversal)
    - Files stored outside web root
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_TYPES)}",
        )

    # Read in chunks to enforce size limit without loading full file
    contents = b""
    chunk_size = 1024 * 64  # 64 KB
    while chunk := await file.read(chunk_size):
        contents += chunk
        if len(contents) > MAX_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB} MB.",
            )

    # Generate safe filename
    safe_name = generate_secure_filename(file.filename or "upload")
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    dest = upload_dir / safe_name

    dest.write_bytes(contents)

    return {"filename": safe_name, "url": f"/uploads/{safe_name}"}


# ── GitHub sync ───────────────────────────────────────────────────────────────
@router.post("/github/sync")
async def trigger_github_sync(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> dict:
    """Manually trigger GitHub repo sync."""
    result = await sync_github_repos(db)
    return result


@router.get("/github/repos")
async def list_github_repos(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> list:
    repos = await db.scalars(select(GitHubRepo).order_by(GitHubRepo.stars.desc()))
    return [
        {
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "html_url": r.html_url,
            "language": r.language,
            "stars": r.stars,
            "show_on_site": r.show_on_site,
        }
        for r in repos
    ]


@router.patch("/github/repos/{repo_id}/visibility")
async def toggle_repo_visibility(
    repo_id: int,
    show: bool,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(get_current_admin),
) -> dict:
    repo = await db.get(GitHubRepo, repo_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repo not found")
    repo.show_on_site = show
    await db.commit()
    return {"id": repo_id, "show_on_site": show}
