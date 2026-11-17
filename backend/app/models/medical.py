from pydantic import BaseModel, Field
from typing import Optional


class MedicalRecordCreate(BaseModel):
    diagnosis: str
    symptoms: str
    treatment: str
    medications: Optional[str] = "None"
    vet_notes: Optional[str] = None
    disease_flag: str = Field(default="None")  # e.g., 'None' or 'Suspected Parvovirus - Isolate'
    veterinarian: Optional[str] = None
    next_checkup: Optional[str] = None
    new_health_status: Optional[str] = None


class MedicalRecord(BaseModel):
    id: str
    date: str
    diagnosis: str
    symptoms: str
    treatment: str
    medications: Optional[str] = "None"
    vet_notes: Optional[str] = None
    disease_flag: str = "None"
    veterinarian: Optional[str] = None
    next_checkup: Optional[str] = None
