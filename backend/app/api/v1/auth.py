"""
Auth endpoints — login, refresh, logout.
OWASP API2 mitigations:
- Argon2 password hashing
- Brute-force lockout after N failures
- Refresh token rotation (stolen token detection)
- Short-lived access tokens (15 min)
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_ip, get_current_admin
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.db.base import get_db
from app.models.admin import AdminUser, RefreshToken
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse
from app.services.rate_limiter import rate_limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    ip = get_client_ip(request)

    # Rate limit: 5 attempts per minute per IP
    allowed, _ = await rate_limiter.check(
        f"login:{ip}",
        limit=settings.RATE_LIMIT_LOGIN_PER_MINUTE,
        window=60,
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please wait.",
        )

    # Generic error — never reveal whether email exists
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

    admin = await db.scalar(
        select(AdminUser).where(AdminUser.email == body.email)
    )

    # Check lockout
    if admin and admin.locked_until:
        if datetime.now(timezone.utc) < admin.locked_until:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account temporarily locked. Try again later.",
            )
        # Lockout expired — reset
        admin.locked_until = None
        admin.failed_login_attempts = 0

    if not admin or not verify_password(body.password, admin.hashed_password):
        if admin:
            admin.failed_login_attempts += 1
            if admin.failed_login_attempts >= settings.LOGIN_LOCKOUT_THRESHOLD:
                admin.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
                await db.commit()
            else:
                await db.commit()
        raise auth_error

    if not admin.is_active:
        raise auth_error

    # Successful login
    admin.failed_login_attempts = 0
    admin.locked_until = None
    admin.last_login = datetime.now(timezone.utc)

    access = create_access_token(admin.email)
    refresh, jti = create_refresh_token(admin.email)

    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(jti=jti, admin_id=admin.id, expires_at=expires_at))
    await db.commit()

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Rotate refresh token — invalidate old JTI, issue new pair.
    If a revoked token is presented → revoke ALL tokens (theft detection).
    """
    bad = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    try:
        payload = decode_token(body.refresh_token)
    except Exception:
        raise bad

    if payload.get("type") != "refresh":
        raise bad

    jti: str = payload.get("jti", "")
    email: str = payload.get("sub", "")

    stored = await db.scalar(select(RefreshToken).where(RefreshToken.jti == jti))

    if not stored:
        raise bad

    if stored.is_revoked:
        # Potential token theft — revoke all tokens for this user
        admin = await db.scalar(select(AdminUser).where(AdminUser.email == email))
        if admin:
            tokens = await db.scalars(
                select(RefreshToken).where(RefreshToken.admin_id == admin.id)
            )
            for t in tokens:
                t.is_revoked = True
            await db.commit()
        raise bad

    if stored.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        stored.is_revoked = True
        await db.commit()
        raise bad

    # Revoke old token
    stored.is_revoked = True

    # Issue new pair
    admin = await db.scalar(
        select(AdminUser).where(AdminUser.email == email, AdminUser.is_active == True)
    )
    if not admin:
        raise bad

    new_access = create_access_token(email)
    new_refresh, new_jti = create_refresh_token(email)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(jti=new_jti, admin_id=admin.id, expires_at=expires_at))
    await db.commit()

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> dict:
    """Revoke the provided refresh token."""
    try:
        payload = decode_token(body.refresh_token)
        jti = payload.get("jti", "")
        stored = await db.scalar(select(RefreshToken).where(RefreshToken.jti == jti))
        if stored:
            stored.is_revoked = True
            await db.commit()
    except Exception:
        pass
    return {"message": "Logged out successfully"}
