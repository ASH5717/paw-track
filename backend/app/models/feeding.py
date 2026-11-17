from pydantic import BaseModel
from typing import Optional


class FeedingLogCreate(BaseModel):
    food_type: Optional[str] = "Standard Kibble"
    quantity: Optional[str] = "400g"
    date: str
    group: Optional[str] = None
    notes: Optional[str] = None
    fed_by: Optional[str] = None


class FeedingLog(BaseModel):
    id: str
    date: str
    fed_by: Optional[str] = None
    food_type: Optional[str] = None
    quantity: Optional[str] = None
    group: Optional[str] = None
    notes: Optional[str] = None
