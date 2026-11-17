from pydantic import BaseModel, EmailStr
from typing import Optional


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    role: str = "user"  # 'admin' | 'volunteer' | 'user'
    org: Optional[str] = "Community Member"


class DemoLogin(BaseModel):
    role: str = "admin"  # 'admin' | 'volunteer' | 'user'
    custom_name: Optional[str] = None
    custom_email: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: str


class UserInfo(BaseModel):
    name: str
    email: str
    role: str
    org: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
