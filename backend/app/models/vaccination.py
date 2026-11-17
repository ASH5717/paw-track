from pydantic import BaseModel
from typing import Optional


class VaccinationCreate(BaseModel):
    vaccine: str
    date: str
    next_due: Optional[str] = None
    batch: Optional[str] = None
    vet: Optional[str] = None


class Vaccination(BaseModel):
    id: str
    vaccine: str
    date: str
    next_due: Optional[str] = None
    vet: Optional[str] = None
    batch: Optional[str] = None
    status: str = "Verified"
