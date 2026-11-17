from pydantic import BaseModel, Field
from typing import Optional


class RatingCreate(BaseModel):
    score: int = Field(..., ge=1, le=5)
    rated_by: Optional[str] = None


class RatingResponse(BaseModel):
    id: str
    animal_id: str
    score: int
    rated_by: Optional[str] = None
    created_at: Optional[str] = None
