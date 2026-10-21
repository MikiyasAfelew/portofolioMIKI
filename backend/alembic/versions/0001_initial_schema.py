"""Initial schema

Revision ID: 0001
Revises:
Create Date: 2025-01-01 00:00:00
"""
from __future__ import annotations
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # admin_users
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(512), nullable=False),
        sa.Column("is_active", sa.Boolean, default=True, nullable=False),
        sa.Column("failed_login_attempts", sa.Integer, default=0),
        sa.Column("locked_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("totp_secret", sa.String(64), nullable=True),
        sa.Column("totp_enabled", sa.Boolean, default=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_admin_users_email", "admin_users", ["email"])

    # refresh_tokens
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("jti", sa.String(64), nullable=False, unique=True),
        sa.Column("admin_id", sa.Integer, sa.ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("is_revoked", sa.Boolean, default=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_refresh_tokens_jti", "refresh_tokens", ["jti"])

    # profiles
    op.create_table(
        "profiles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("title", sa.String(256), nullable=False),
        sa.Column("bio", sa.Text, nullable=False),
        sa.Column("avatar_url", sa.String(512), nullable=True),
        sa.Column("location", sa.String(128), nullable=True),
        sa.Column("cv_url", sa.String(512), nullable=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    # social_links
    op.create_table(
        "social_links",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("profile_id", sa.Integer, sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("platform", sa.String(64), nullable=False),
        sa.Column("url", sa.String(512), nullable=False),
        sa.Column("handle", sa.String(128), nullable=True),
    )

    # projects
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(256), nullable=False),
        sa.Column("slug", sa.String(256), nullable=False, unique=True),
        sa.Column("short_description", sa.Text, nullable=False),
        sa.Column("long_description", sa.Text, nullable=True),
        sa.Column("tech_stack", sa.JSON),
        sa.Column("images", sa.JSON),
        sa.Column("github_url", sa.String(512), nullable=True),
        sa.Column("live_url", sa.String(512), nullable=True),
        sa.Column("status", sa.String(32), default="in_progress"),
        sa.Column("category", sa.String(32), default="other"),
        sa.Column("featured", sa.Boolean, default=False),
        sa.Column("order", sa.Integer, default=0),
        sa.Column("view_count", sa.Integer, default=0),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"])

    # skills
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("category", sa.String(64), nullable=False),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("order", sa.Integer, default=0),
    )

    # education
    op.create_table(
        "education",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("institution", sa.String(256), nullable=False),
        sa.Column("degree", sa.String(256), nullable=False),
        sa.Column("field", sa.String(256), nullable=True),
        sa.Column("start_year", sa.Integer, nullable=True),
        sa.Column("end_year", sa.Integer, nullable=True),
        sa.Column("is_current", sa.Boolean, default=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("is_certification", sa.Boolean, default=False),
        sa.Column("order", sa.Integer, default=0),
    )

    # experience
    op.create_table(
        "experience",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("role", sa.String(256), nullable=False),
        sa.Column("organization", sa.String(256), nullable=False),
        sa.Column("start_date", sa.Date, nullable=True),
        sa.Column("end_date", sa.Date, nullable=True),
        sa.Column("is_current", sa.Boolean, default=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("order", sa.Integer, default=0),
    )

    # services
    op.create_table(
        "services",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(256), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("order", sa.Integer, default=0),
    )

    # contact_messages
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("ip_hash", sa.String(32), nullable=True),
        sa.Column("spam_score", sa.Float, default=0.0),
        sa.Column("is_spam", sa.Boolean, default=False),
        sa.Column("is_read", sa.Boolean, default=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    # page_views
    op.create_table(
        "page_views",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("path", sa.String(512), nullable=False),
        sa.Column("ip_hash", sa.String(32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_page_views_path", "page_views", ["path"])
    op.create_index("ix_page_views_created_at", "page_views", ["created_at"])

    # github_repos
    op.create_table(
        "github_repos",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("github_id", sa.Integer, unique=True, nullable=False),
        sa.Column("name", sa.String(256), nullable=False),
        sa.Column("full_name", sa.String(512), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("html_url", sa.String(512), nullable=False),
        sa.Column("homepage", sa.String(512), nullable=True),
        sa.Column("language", sa.String(64), nullable=True),
        sa.Column("topics", sa.JSON),
        sa.Column("stars", sa.Integer, default=0),
        sa.Column("forks", sa.Integer, default=0),
        sa.Column("is_fork", sa.Boolean, default=False),
        sa.Column("show_on_site", sa.Boolean, default=False),
        sa.Column("synced_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("pushed_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    for table in [
        "github_repos", "page_views", "contact_messages",
        "services", "experience", "education", "skills",
        "projects", "social_links", "profiles",
        "refresh_tokens", "admin_users",
    ]:
        op.drop_table(table)
