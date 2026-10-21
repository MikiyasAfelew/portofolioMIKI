from __future__ import annotations
from typing import List, Literal, Optional
from pydantic import BaseModel

SkillCategory = Literal["programming", "security", "tools", "learning"]


class SkillBase(BaseModel):
    name: str
    category: SkillCategory
    icon: Optional[str] = None
    order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[SkillCategory] = None
    icon: Optional[str] = None
    order: Optional[int] = None


class SkillOut(SkillBase):
    id: int
    model_config = {"from_attributes": True}
