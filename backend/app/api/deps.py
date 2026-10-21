"""
FastAPI dependencies — reusable auth, DB, rate-limit checks.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.base import get_db
from app.models.admin import AdminUser

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> AdminUser:
    """
    Validate JWT and return the admin user.
    Raises 401 on any auth failure — never leaks why it failed
    (prevents user enumeration — OWASP API1).
    """
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise exc

    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise exc

    if payload.get("type") != "access":
        raise exc

    email: str = payload.get("sub", "")
    admin = await db.scalar(
        select(AdminUser).where(AdminUser.email == email, AdminUser.is_active == True)
    )
    if not admin:
        raise exc

    return admin


def get_client_ip(request: Request) -> str:
    """Extract real IP, respecting common proxy headers."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first (leftmost) IP — closest to client
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"
