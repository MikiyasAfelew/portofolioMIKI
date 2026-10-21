"""
Security utilities — password hashing, JWT, token rotation.

OWASP mitigations addressed here:
- API2: Broken Authentication  → short-lived JWTs, refresh rotation, lockout
- API3: Broken Object Property Level Auth → token claims verified on every request
- API8: Security Misconfiguration → algorithm pinned, no "none" alg allowed
"""
from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ── Password hashing ──────────────────────────────────────────────────────────
# Argon2 is preferred; bcrypt as fallback if argon2-cffi not installed
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
    argon2__memory_cost=65536,   # 64 MB
    argon2__time_cost=3,
    argon2__parallelism=1,
)


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT ───────────────────────────────────────────────────────────────────────
def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(subject: str, extra: dict | None = None) -> str:
    """Short-lived access token (15 min default)."""
    expire = _now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": _now(),
        "type": "access",
        **(extra or {}),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str) -> tuple[str, str]:
    """
    Returns (token, jti).
    jti (JWT ID) is stored in DB to enable one-time-use rotation.
    """
    jti = secrets.token_urlsafe(32)
    expire = _now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": _now(),
        "type": "refresh",
        "jti": jti,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, jti


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT. Raises JWTError on any failure.
    Algorithm is pinned — 'none' is never accepted.
    """
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],  # list prevents alg confusion
    )


# ── IP hashing (privacy-friendly analytics) ──────────────────────────────────
def hash_ip(ip: str) -> str:
    """
    One-way HMAC of IP for analytics & spam detection.
    Never stores raw IPs. Salt rotates daily.
    """
    daily_salt = settings.ANALYTICS_SALT + datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return hmac.new(daily_salt.encode(), ip.encode(), hashlib.sha256).hexdigest()[:16]


# ── Token generation helpers ─────────────────────────────────────────────────
def generate_secure_filename(original: str) -> str:
    """Replace original filename with random hex to prevent path traversal."""
    ext = original.rsplit(".", 1)[-1].lower() if "." in original else "bin"
    return f"{secrets.token_hex(16)}.{ext}"
