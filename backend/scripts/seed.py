"""
Seed script — loads Mikiyas's real data into the database.
Run: python -m scripts.seed
Placeholders are clearly marked where data is missing.
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.security import hash_password
from app.models.admin import AdminUser
from app.models.education import Education
from app.models.experience import Experience
from app.models.profile import Profile, SocialLink
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill
from app.db.base import Base

engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        # ── Admin user ──────────────────────────────────────────────────
        from sqlalchemy import select
        existing_admin = await db.scalar(
            select(AdminUser).where(AdminUser.email == settings.ADMIN_EMAIL)
        )
        if not existing_admin:
            admin = AdminUser(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                is_active=True,
            )
            db.add(admin)
            print(f"✓ Admin user created: {settings.ADMIN_EMAIL}")
        else:
            print(f"  Admin already exists: {settings.ADMIN_EMAIL}")

        # ── Profile ─────────────────────────────────────────────────────
        profile = await db.scalar(select(Profile).limit(1))
        if not profile:
            profile = Profile(
                name="Mikiyas Afelew",
                title="Software Engineering Student | Aspiring DevSecOps Engineer",
                bio=(
                    "I'm a Software Engineering student at Debre Berhan University, "
                    "working toward becoming a skilled developer with deep knowledge in "
                    "cybersecurity and mobile app development. My focus is on building "
                    "practical software, exploring DevSecOps principles, and sharpening "
                    "my Flutter skills while working on real-world projects like a rental app."
                ),
                avatar_url="https://avatars.githubusercontent.com/u/167429958?v=4",
                location="Ethiopia",
                email="heri21miki@gmail.com",
                cv_url=None,  # TODO: add CV URL when ready
            )
            db.add(profile)
            await db.flush()

            for sl in [
                {"platform": "github",    "url": "https://github.com/MikiyasAfelew",     "handle": "MikiyasAfelew"},
                {"platform": "telegram",  "url": "https://t.me/Nitzevet",                "handle": "@Nitzevet"},
                {"platform": "instagram", "url": "https://instagram.com/shando.ra",      "handle": "shando.ra"},
                {"platform": "email",     "url": "mailto:heri21miki@gmail.com",          "handle": "heri21miki@gmail.com"},
            ]:
                db.add(SocialLink(profile_id=profile.id, **sl))
            print("✓ Profile created")
        else:
            print("  Profile already exists")

        # ── Education ────────────────────────────────────────────────────
        edu_count = await db.scalar(select(Education).limit(1))
        if not edu_count:
            education_items = [
                Education(
                    institution="Debre Berhan University",
                    degree="Bachelor of Science",
                    field="Software Engineering",
                    start_year=2022,
                    end_year=2027,
                    is_current=True,
                    description="Pursuing a Software Engineering degree with focus on software development, mobile applications, and cybersecurity.",
                    is_certification=False,
                    order=0,
                ),
                Education(
                    institution="Ethio Coder",
                    degree="Artificial Intelligence",
                    field=None,
                    start_year=2024,
                    end_year=2024,
                    is_certification=True,
                    order=1,
                ),
                Education(
                    institution="Ethio Coder",
                    degree="Fundamental Programming",
                    field=None,
                    start_year=2023,
                    end_year=2023,
                    is_certification=True,
                    order=2,
                ),
                Education(
                    institution="Ethio Coder",
                    degree="Data Science",
                    field=None,
                    start_year=2024,
                    end_year=2024,
                    is_certification=True,
                    order=3,
                ),
                Education(
                    institution="Ethio Coder",
                    degree="Kotlin",
                    field=None,
                    start_year=2024,
                    end_year=2024,
                    is_certification=True,
                    order=4,
                ),
            ]
            for e in education_items:
                db.add(e)
            print("✓ Education records created")

        # ── Experience ───────────────────────────────────────────────────
        exp_count = await db.scalar(select(Experience).limit(1))
        if not exp_count:
            db.add(Experience(
                role="[INTERNSHIP ROLE — Fill in]",         # TODO
                organization="[COMPANY NAME — Fill in]",    # TODO
                start_date=None,                            # TODO
                end_date=None,
                is_current=True,
                description=(
                    "Currently building hands-on experience through an active internship, "
                    "applying software development skills and security-aware practices in a "
                    "real professional environment."
                ),
                order=0,
            ))
            print("✓ Experience placeholder created (fill in role/company)")

        # ── Skills ───────────────────────────────────────────────────────
        skill_count = await db.scalar(select(Skill).limit(1))
        if not skill_count:
            skills_data = [
                # Programming
                ("Java",            "programming", "Code2",       0),
                ("Python",          "programming", "Code2",       1),
                ("Kotlin",          "programming", "Smartphone",  2),
                ("JavaScript",      "programming", "Code2",       3),
                ("Dart",            "programming", "Code2",       4),
                ("HTML/CSS",        "programming", "Code2",       5),
                # Security
                ("DevSecOps",       "security",    "ShieldCheck", 0),
                ("CTFs",            "security",    "ShieldCheck", 1),
                ("Networking",      "security",    "ShieldCheck", 2),
                ("Web Vulnerability Scanning", "security", "ShieldCheck", 3),
                # Tools
                ("Git & GitHub",    "tools",       "GitFork",     0),
                ("Linux",           "tools",       "Terminal",    1),
                ("Android Studio",  "tools",       "Smartphone",  2),
                ("Firebase",        "tools",       "Database",    3),
                # Learning
                ("Flutter",         "learning",    "Smartphone",  0),
                ("Advanced Cybersecurity", "learning", "Shield", 1),
                ("DevSecOps Pipelines",    "learning", "Zap",    2),
            ]
            for name, cat, icon, order in skills_data:
                db.add(Skill(name=name, category=cat, icon=icon, order=order))
            print("✓ Skills created")

        # ── Services ─────────────────────────────────────────────────────
        svc_count = await db.scalar(select(Service).limit(1))
        if not svc_count:
            services_data = [
                ("Mobile App Development",
                 "Android apps with Kotlin and cross-platform apps with Flutter. From UI design to backend integration.",
                 "Smartphone", 0),
                ("Rental App Development",
                 "A complete rental platform with property listings, browsing, and clean user flows — like EsayaRent.",
                 "Home", 1),
                ("Student Registration System",
                 "A system to manage student sign-up, records, and information with a clean admin interface.",
                 "Users", 2),
                ("Security-Minded Development",
                 "Building software with vulnerability awareness and DevSecOps practices baked in from the start.",
                 "ShieldCheck", 3),
            ]
            for title, desc, icon, order in services_data:
                db.add(Service(title=title, description=desc, icon=icon, order=order))
            print("✓ Services created")

        # ── Projects ─────────────────────────────────────────────────────
        proj_count = await db.scalar(select(Project).limit(1))
        if not proj_count:
            projects_data = [
                Project(
                    title="EsayaRent",
                    slug="esayarent",
                    short_description="A rental app — helps users discover and rent properties with a clean, practical UI.",
                    long_description="[TODO: Add full description once repo has more details]",
                    tech_stack=["Kotlin", "Android"],
                    github_url="https://github.com/MikiyasAfelew/EsayaRent",
                    status="in_progress",
                    category="mobile",
                    featured=True,
                    order=0,
                ),
                Project(
                    title="Web Vulnerability Scanner",
                    slug="web-vulnerability-scanner",
                    short_description="A security-focused tool that scans web applications for common vulnerabilities.",
                    long_description="A cybersecurity project built in JavaScript that identifies potential vulnerabilities in web applications, reflecting a practical interest in web security.",
                    tech_stack=["JavaScript", "Node.js", "Web Security"],
                    github_url="https://github.com/MikiyasAfelew/web-vulnerability-scanner",
                    status="completed",
                    category="security",
                    featured=True,
                    order=1,
                ),
                Project(
                    title="Student Registration System",
                    slug="student-registration-system",
                    short_description="A system for managing student registration, records, and information.",
                    tech_stack=["Python", "Full-Stack"],
                    github_url="https://github.com/MikiyasAfelew",
                    status="in_progress",
                    category="web",
                    featured=False,
                    order=2,
                ),
                Project(
                    title="Kotlin Gradle Project",
                    slug="kotlin-gradle-project",
                    short_description="Coursework and practice from the Debre Berhan University Kotlin program.",
                    tech_stack=["Kotlin", "Gradle"],
                    github_url="https://github.com/MikiyasAfelew/kotlin__gradle_project",
                    status="completed",
                    category="mobile",
                    featured=False,
                    order=3,
                ),
                Project(
                    title="Personal Portfolio",
                    slug="portfolio",
                    short_description="This portfolio — built with React and Tailwind CSS.",
                    tech_stack=["React", "Tailwind CSS", "FastAPI"],
                    github_url="https://github.com/MikiyasAfelew/portofolioMIKI",
                    status="completed",
                    category="web",
                    featured=False,
                    order=4,
                ),
            ]
            for p in projects_data:
                db.add(p)
            print("✓ Projects created")

        await db.commit()
        print("\n✅ Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
