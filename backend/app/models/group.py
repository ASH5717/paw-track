from pydantic import BaseModel
from typing import List, Optional


class FeedingGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    animal_ids: List[str] = []


class FeedingGroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    animal_ids: Optional[List[str]] = None


class MarkGroupFedRequest(BaseModel):
    food_type: Optional[str] = "Meal & Water"
    notes: Optional[str] = None


class FeedingGroupResponse(FeedingGroupCreate):
    id: str
    created_by: str
    created_at: str
    last_fed_at: Optional[str] = None
    last_fed_by: Optional[str] = None
    feed_count: int = 0
