from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl, field_validator


class SocialLinkBase(BaseModel):
    platform: str
    url: str
    handle: Optional[str] = None


class SocialLinkOut(SocialLinkBase):
    id: int
    model_config = {"from_attributes": True}


class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    cv_url: Optional[str] = None
    email: EmailStr


class ProfileOut(ProfileBase):
    id: int
    social_links: List[SocialLinkOut] = []
    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    cv_url: Optional[str] = None
    email: Optional[EmailStr] = None
    social_links: Optional[List[SocialLinkBase]] = None
