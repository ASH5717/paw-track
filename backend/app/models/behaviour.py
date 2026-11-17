from pydantic import BaseModel
from typing import Optional


class BehaviourLogCreate(BaseModel):
    label: str  # Friendly / Calm / Shy / Fearful / Aggressive
    notes: str
    precautions: Optional[str] = "Standard leash handling."
    observer: Optional[str] = None


class BehaviourLog(BaseModel):
    id: str
    date: str
    label: str
    notes: str
    precautions: Optional[str] = None
    observer: Optional[str] = None
    verified: bool = False
