from pydantic import BaseModel
from typing import List


class MonthlyTrend(BaseModel):
    month: str
    registered: int
    vaccinated: int
    adopted: int


class DashboardMetrics(BaseModel):
    total_animals: int
    vaccinated: int
    unvaccinated_or_overdue: int
    medical_attention: int
    available_adoption: int
    adopted: int
    active_volunteers: int
    unread_notifications: int
