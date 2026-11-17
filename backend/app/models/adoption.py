from pydantic import BaseModel, EmailStr
from typing import Optional


class AdoptionCreate(BaseModel):
    animal_id: str
    animal_code: str
    animal_name: str
    applicant_name: str
    applicant_email: str
    applicant_phone: Optional[str] = None
    address: str
    home_type: str
    experience: Optional[str] = None


class AdoptionDecision(BaseModel):
    status: str  # 'Approved' | 'Rejected' | 'Pending Review'


class AdoptionResponse(AdoptionCreate):
    id: str
    status: str = "Pending Review"
    submitted_at: str
