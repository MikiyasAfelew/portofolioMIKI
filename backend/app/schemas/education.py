from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class EducationBase(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    is_current: bool = False
    description: Optional[str] = None
    is_certification: bool = False
    order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    is_certification: Optional[bool] = None
    order: Optional[int] = None


class EducationOut(EducationBase):
    id: int
    model_config = {"from_attributes": True}
