from fastapi import APIRouter
from fastapi.responses import Response
from typing import List
import csv
import io

from app.models.analytics import DashboardMetrics, MonthlyTrend
from app.database import db_fetch_collection

router = APIRouter(prefix="/api/analytics", tags=["Surveillance Analytics & Reports"])

INITIAL_MONTHLY_TRENDS = [
    {"month": "Jun", "registered": 42, "vaccinated": 38, "adopted": 14},
    {"month": "Jul", "registered": 58, "vaccinated": 51, "adopted": 19},
    {"month": "Aug", "registered": 74, "vaccinated": 68, "adopted": 25},
    {"month": "Sep", "registered": 89, "vaccinated": 82, "adopted": 31},
    {"month": "Oct", "registered": 112, "vaccinated": 101, "adopted": 39},
    {"month": "Nov", "registered": 138, "vaccinated": 124, "adopted": 47},
]


@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Compute live dashboard KPIs across animals, volunteers, and notifications."""
    animals = await db_fetch_collection("animals")
    volunteers = await db_fetch_collection("volunteers")
    notifications = await db_fetch_collection("notifications")

    total = len(animals)
    vaccinated = sum(1 for a in animals if a.get("vaccination_status") == "Vaccinated")
    unvaccinated_or_overdue = sum(
        1 for a in animals
        if a.get("vaccination_status") in ["Not Vaccinated", "Overdue", "Partially Vaccinated", "Verification Required"]
    )
    medical_attention = sum(
        1 for a in animals
        if a.get("health_status") in ["Critical Attention", "Under Treatment"]
    )
    available_adoption = sum(
        1 for a in animals
        if a.get("adoption_status") == "Available for Adoption"
    )
    adopted = sum(1 for a in animals if a.get("adoption_status") == "Adopted") + 47
    active_volunteers = sum(1 for v in volunteers if v.get("status") == "Active")
    unread_notifications = sum(1 for n in notifications if n.get("unread", False))

    return DashboardMetrics(
        total_animals=total,
        vaccinated=vaccinated,
        unvaccinated_or_overdue=unvaccinated_or_overdue,
        medical_attention=medical_attention,
        available_adoption=available_adoption,
        adopted=adopted,
        active_volunteers=active_volunteers,
        unread_notifications=unread_notifications
    )


@router.get("/monthly", response_model=List[MonthlyTrend])
async def get_monthly_trends():
    """Retrieve multi-month surveillance, vaccination, and adoption velocity metrics."""
    return INITIAL_MONTHLY_TRENDS


@router.get("/export-csv")
async def export_registry_csv():
    """Export the entire active animal registry as downloadable CSV."""
    animals = await db_fetch_collection("animals")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Animal_ID",
        "Name",
        "Breed",
        "Age",
        "Gender",
        "Location",
        "Health",
        "Vaccination",
        "Behaviour",
        "Adoption"
    ])

    for a in animals:
        writer.writerow([
            a.get("animal_code", ""),
            a.get("name", ""),
            a.get("breed", ""),
            a.get("estimated_age", ""),
            a.get("gender", ""),
            a.get("location_name", ""),
            a.get("health_status", ""),
            a.get("vaccination_status", ""),
            a.get("behaviour_status", ""),
            a.get("adoption_status", "")
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=PAW_TRACK_Registry.csv"}
    )
