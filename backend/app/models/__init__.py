"""Import all models here so Alembic autogenerate picks them up."""
from app.models.admin import AdminUser, RefreshToken          # noqa: F401
from app.models.profile import Profile, SocialLink            # noqa: F401
from app.models.project import Project                        # noqa: F401
from app.models.skill import Skill                            # noqa: F401
from app.models.education import Education                    # noqa: F401
from app.models.experience import Experience                  # noqa: F401
from app.models.service import Service                        # noqa: F401
from app.models.contact import ContactMessage                 # noqa: F401
from app.models.analytics import PageView                     # noqa: F401
from app.models.github_repo import GitHubRepo                 # noqa: F401
