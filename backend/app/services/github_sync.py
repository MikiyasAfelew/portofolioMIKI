"""
GitHub sync service — pulls public repos, caches in DB.
Handles rate limits (X-RateLimit-Remaining header) gracefully.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.github_repo import GitHubRepo

logger = logging.getLogger(__name__)

GITHUB_API = "https://api.github.com"


async def sync_github_repos(db: AsyncSession) -> Dict[str, Any]:
    """
    Fetch all public repos for configured GitHub username.
    Returns summary dict with counts and any errors.
    """
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": f"Portfolio-API/{settings.APP_VERSION}",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    repos: List[Dict] = []
    page = 1
    errors: List[str] = []

    async with httpx.AsyncClient(timeout=15) as client:
        while True:
            try:
                resp = await client.get(
                    f"{GITHUB_API}/users/{settings.GITHUB_USERNAME}/repos",
                    headers=headers,
                    params={"per_page": 100, "page": page, "sort": "updated"},
                )

                # Rate limit check
                remaining = int(resp.headers.get("X-RateLimit-Remaining", "1"))
                if remaining == 0:
                    reset_ts = int(resp.headers.get("X-RateLimit-Reset", "0"))
                    logger.warning("GitHub rate limit hit. Resets at %s", reset_ts)
                    errors.append("GitHub rate limit reached")
                    break

                if resp.status_code == 404:
                    errors.append(f"GitHub user '{settings.GITHUB_USERNAME}' not found")
                    break
                resp.raise_for_status()

                page_repos = resp.json()
                if not page_repos:
                    break

                repos.extend(page_repos)
                if len(page_repos) < 100:
                    break
                page += 1

            except httpx.HTTPError as exc:
                errors.append(f"HTTP error: {exc}")
                break

    # Upsert into DB
    created = updated = 0
    for repo_data in repos:
        existing = await db.scalar(
            select(GitHubRepo).where(GitHubRepo.github_id == repo_data["id"])
        )
        pushed_at = None
        if repo_data.get("pushed_at"):
            try:
                pushed_at = datetime.fromisoformat(
                    repo_data["pushed_at"].replace("Z", "+00:00")
                )
            except ValueError:
                pass

        if existing:
            existing.name = repo_data["name"]
            existing.full_name = repo_data["full_name"]
            existing.description = repo_data.get("description")
            existing.html_url = repo_data["html_url"]
            existing.homepage = repo_data.get("homepage")
            existing.language = repo_data.get("language")
            existing.topics = repo_data.get("topics", [])
            existing.stars = repo_data.get("stargazers_count", 0)
            existing.forks = repo_data.get("forks_count", 0)
            existing.is_fork = repo_data.get("fork", False)
            existing.synced_at = datetime.now(timezone.utc)
            existing.pushed_at = pushed_at
            updated += 1
        else:
            db.add(GitHubRepo(
                github_id=repo_data["id"],
                name=repo_data["name"],
                full_name=repo_data["full_name"],
                description=repo_data.get("description"),
                html_url=repo_data["html_url"],
                homepage=repo_data.get("homepage"),
                language=repo_data.get("language"),
                topics=repo_data.get("topics", []),
                stars=repo_data.get("stargazers_count", 0),
                forks=repo_data.get("forks_count", 0),
                is_fork=repo_data.get("fork", False),
                pushed_at=pushed_at,
            ))
            created += 1

    await db.commit()
    logger.info("GitHub sync: %d created, %d updated", created, updated)
    return {"synced": len(repos), "created": created, "updated": updated, "errors": errors}
