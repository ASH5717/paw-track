from pydantic import BaseModel
from typing import Optional


class VolunteerReportCreate(BaseModel):
    type: str  # 'New Animal Discovery' | 'Medical Alert / Injury' | 'Aggression / Incident'
    animal_name: Optional[str] = None
    breed: Optional[str] = "Community Stray"
    location: str
    urgency: str = "Normal"  # 'Normal' | 'High'
    notes: str
    photo: Optional[str] = None
    submitted_by: Optional[str] = "Community Volunteer"


class VolunteerReportDecision(BaseModel):
    status: str  # 'Approved' | 'Rejected' | 'Pending Approval'


class VolunteerReportResponse(VolunteerReportCreate):
    id: str
    status: str = "Pending Approval"
    date: str
