from pydantic import BaseModel
from typing import Optional


class NotificationCreate(BaseModel):
    title: str
    message: str
    animal_id: Optional[str] = None
    type: str = "info"  # 'info' | 'warning' | 'critical'
    unread: bool = True


class NotificationResponse(NotificationCreate):
    id: str
    time: str = "Just now"
