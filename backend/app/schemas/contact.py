from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    # Honeypot — must be empty; bots fill it
    website: str = ""
    # Optional Cloudflare Turnstile token
    cf_turnstile_token: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 128:
            raise ValueError("Name must be 2–128 characters")
        return v

    @field_validator("message")
    @classmethod
    def message_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 10 or len(v) > 4000:
            raise ValueError("Message must be 10–4000 characters")
        return v


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    is_read: bool
    is_spam: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class ContactListOut(BaseModel):
    items: List[ContactOut]
    total: int
    page: int
    size: int
    pages: int


class ContactMessageSuccess(BaseModel):
    message: str = "Message received. I'll get back to you soon!"
