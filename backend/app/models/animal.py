from pydantic import BaseModel, Field
from typing import List, Optional
from app.models.medical import MedicalRecord
from app.models.vaccination import Vaccination
from app.models.behaviour import BehaviourLog
from app.models.feeding import FeedingLog


class AnimalBase(BaseModel):
    name: str
    breed: str
    estimated_age: str
    gender: str  # Male / Female
    colour: str
    identifying_marks: Optional[str] = None
    location_name: str
    lat: Optional[float] = 12.9716
    lng: Optional[float] = 77.5946
    rescue_details: Optional[str] = None
    assigned_volunteer: Optional[str] = None
    health_status: str = Field(default="Healthy")  # Healthy / Under Treatment / Critical Attention
    vaccination_status: str = Field(default="Not Vaccinated")  # Vaccinated / Partially Vaccinated / Overdue / Not Vaccinated / Verification Required
    behaviour_status: str = Field(default="Friendly")  # Friendly / Calm / Shy / Fearful / Aggressive
    adoption_status: str = Field(default="Available for Adoption")  # Available for Adoption / Not Available / Under Medical Treatment / Pending Adoption / Adopted
    sterilized: bool = False
    dewormed: bool = False
    photos: List[str] = []


class AnimalCreate(AnimalBase):
    pass


class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    estimated_age: Optional[str] = None
    gender: Optional[str] = None
    colour: Optional[str] = None
    identifying_marks: Optional[str] = None
    location_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    rescue_details: Optional[str] = None
    assigned_volunteer: Optional[str] = None
    health_status: Optional[str] = None
    vaccination_status: Optional[str] = None
    behaviour_status: Optional[str] = None
    adoption_status: Optional[str] = None
    sterilized: Optional[bool] = None
    dewormed: Optional[bool] = None
    photos: Optional[List[str]] = None


class AnimalResponse(AnimalBase):
    id: str
    animal_code: str
    registered_date: str
    updated_at: str
    medical_history: List[MedicalRecord] = []
    vaccinations: List[Vaccination] = []
    behaviour_logs: List[BehaviourLog] = []
    feeding_logs: List[FeedingLog] = []
    average_rating: float = 0.0
    ratings_count: int = 0
