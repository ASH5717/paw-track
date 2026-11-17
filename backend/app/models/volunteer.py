from pydantic import BaseModel
from typing import Optional


class VolunteerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    zone: str
    status: str = "Active"  # 'Active' | 'Inactive'
    submissions: int = 0


class VolunteerCreate(VolunteerBase):
    pass


class VolunteerResponse(VolunteerBase):
    id: str
    joined: str
