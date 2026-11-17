from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import time

from app.models.volunteer_report import VolunteerReportCreate, VolunteerReportResponse, VolunteerReportDecision
from app.models.auth import UserInfo
from app.dependencies import get_current_user, require_admin
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc
)

router = APIRouter(prefix="/api/volunteer-reports", tags=["Volunteer Reports & Incidents"])


@router.get("", response_model=List[VolunteerReportResponse])
async def list_volunteer_reports():
    """List all community incident and discovery reports."""
    return await db_fetch_collection("volunteer_reports")


@router.post("", response_model=VolunteerReportResponse, status_code=status.HTTP_201_CREATED)
async def submit_volunteer_report(
    payload: VolunteerReportCreate,
    current_user: UserInfo = Depends(get_current_user)
):
    """Submit a field incident or stray animal discovery report."""
    doc_id = f"vr{int(time.time() * 1000)}"
    today = datetime.now().strftime("%Y-%m-%d")

    submitted_by = payload.submitted_by or f"{current_user.name} ({current_user.role})"

    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "submitted_by": submitted_by,
        "status": "Pending Approval",
        "date": today
    }

    await db_upsert_doc("volunteer_reports", doc)

    # Trigger alert notification
    await db_upsert_doc("notifications", {
        "id": f"n{int(time.time() * 1000)}",
        "title": f"Community Report: {payload.type}",
        "message": f"Reported at {payload.location} ({payload.urgency} priority).",
        "type": "critical" if payload.urgency == "High" else "warning",
        "time": "Just now",
        "unread": True
    })

    return doc


@router.put("/{report_id}/decision", response_model=VolunteerReportResponse)
async def review_volunteer_report(
    report_id: str,
    decision: VolunteerReportDecision,
    current_user: UserInfo = Depends(require_admin)
):
    """Approve or reject a volunteer report (Admin only)."""
    report = await db_fetch_by_id("volunteer_reports", report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report["status"] = decision.status
    await db_upsert_doc("volunteer_reports", report)

    return report
