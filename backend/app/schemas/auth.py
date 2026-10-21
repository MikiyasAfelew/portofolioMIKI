from pydantic import BaseModel, EmailStr, field_validator
import re


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v: str) -> str:
        if not v or len(v) < 1:
            raise ValueError("Password required")
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


class TOTPVerifyRequest(BaseModel):
    totp_code: str

    @field_validator("totp_code")
    @classmethod
    def validate_code(cls, v: str) -> str:
        if not re.fullmatch(r"\d{6}", v):
            raise ValueError("TOTP code must be 6 digits")
        return v
