from __future__ import annotations
from datetime import date
from typing import Optional
from pydantic import BaseModel


class ExperienceBase(BaseModel):
    role: str
    organization: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    organization: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    order: Optional[int] = None


class ExperienceOut(ExperienceBase):
    id: int
    model_config = {"from_attributes": True}
