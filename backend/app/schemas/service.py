from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class ServiceBase(BaseModel):
    title: str
    description: str
    icon: Optional[str] = None
    order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


class ServiceOut(ServiceBase):
    id: int
    model_config = {"from_attributes": True}
