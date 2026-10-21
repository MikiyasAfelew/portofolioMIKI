"""
Central configuration — all values come from environment variables.
Never hardcode secrets. .env is git-ignored; .env.example is committed.
"""
from __future__ import annotations

import secrets
from typing import List, Optional

from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ────────────────────────────────────────────────────────────
    APP_NAME: str = "Mikiyas Portfolio API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | production
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(64)  # override in .env

    # ── Database ───────────────────────────────────────────────────────
    # Postgres in production, SQLite for local tests
    DATABASE_URL: str = "sqlite+aiosqlite:///./portfolio_dev.db"
    DATABASE_ECHO: bool = False

    # ── Redis (rate-limiting / caching) ────────────────────────────────
    REDIS_URL: Optional[str] = None  # e.g. redis://localhost:6379/0
    # If None → falls back to in-memory (dev only)

    # ── JWT ────────────────────────────────────────────────────────────
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15       # short-lived
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_TOKEN_ROTATE: bool = True           # rotation on every refresh

    # ── Admin account (set once; stored hashed in DB) ──────────────────
    ADMIN_EMAIL: str = "heri21miki@gmail.com"
    ADMIN_PASSWORD: str = "CHANGE_ME_in_.env"   # plaintext only for seeding

    # ── CORS ───────────────────────────────────────────────────────────
    # Comma-separated list, e.g. "https://mikiyasafelew.com,http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # ── Email (SMTP / Resend / SendGrid) ───────────────────────────────
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "noreply@portfolio.local"
    SMTP_FROM_NAME: str = "Mikiyas Portfolio"
    CONTACT_NOTIFY_EMAIL: str = "heri21miki@gmail.com"
    # OR use Resend
    RESEND_API_KEY: Optional[str] = None

    # ── File uploads ───────────────────────────────────────────────────
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp"
    ALLOWED_DOC_TYPES: str = "application/pdf"

    # ── GitHub sync ────────────────────────────────────────────────────
    GITHUB_USERNAME: str = "MikiyasAfelew"
    GITHUB_TOKEN: Optional[str] = None          # personal access token (read:public_repo)

    # ── Rate limiting ──────────────────────────────────────────────────
    RATE_LIMIT_CONTACT_PER_HOUR: int = 3
    RATE_LIMIT_LOGIN_PER_MINUTE: int = 5
    LOGIN_LOCKOUT_THRESHOLD: int = 10           # attempts before 15-min lockout

    # ── Spam protection ────────────────────────────────────────────────
    TURNSTILE_SECRET_KEY: Optional[str] = None  # Cloudflare Turnstile

    # ── Analytics ─────────────────────────────────────────────────────
    ANALYTICS_SALT: str = secrets.token_hex(16)  # for IP hashing

    # ── Docs ───────────────────────────────────────────────────────────
    @property
    def docs_url(self) -> Optional[str]:
        """Hide Swagger in production."""
        return "/docs" if self.ENVIRONMENT != "production" else None

    @property
    def redoc_url(self) -> Optional[str]:
        return "/redoc" if self.ENVIRONMENT != "production" else None

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_env(cls, v: str) -> str:
        if v not in {"development", "production", "testing"}:
            raise ValueError("ENVIRONMENT must be development | production | testing")
        return v


settings = Settings()
