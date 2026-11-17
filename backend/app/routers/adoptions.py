from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import time

from app.models.adoption import AdoptionCreate, AdoptionResponse, AdoptionDecision
from app.models.auth import UserInfo
from app.dependencies import get_current_user, require_admin
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc
)

router = APIRouter(prefix="/api/adoptions", tags=["Adoptions"])


@router.get("", response_model=List[AdoptionResponse])
async def list_adoptions():
    """List all adoption applications."""
    return await db_fetch_collection("adoptions")


@router.post("", response_model=AdoptionResponse, status_code=status.HTTP_201_CREATED)
async def submit_adoption(
    payload: AdoptionCreate,
    current_user: UserInfo = Depends(get_current_user)
):
    """Submit an ethical adoption application."""
    doc_id = f"ad{int(time.time() * 1000)}"
    today = datetime.now().strftime("%Y-%m-%d")

    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "status": "Pending Review",
        "submitted_at": today
    }

    await db_upsert_doc("adoptions", doc)

    # Update animal adoption status to 'Pending Adoption'
    animal = await db_fetch_by_id("animals", payload.animal_id)
    if animal:
        animal["adoption_status"] = "Pending Adoption"
        await db_upsert_doc("animals", animal)

    # Create admin notification
    await db_upsert_doc("notifications", {
        "id": f"n{int(time.time() * 1000)}",
        "animal_id": payload.animal_id,
        "title": "Adoption Application Received",
        "message": f"{payload.applicant_name} applied to adopt {payload.animal_name} ({payload.animal_code}).",
        "type": "info",
        "time": "Just now",
        "unread": True
    })

    return doc


@router.put("/{adoption_id}/decision", response_model=AdoptionResponse)
async def review_adoption(
    adoption_id: str,
    decision: AdoptionDecision,
    current_user: UserInfo = Depends(require_admin)
):
    """Approve or reject an adoption application (Admin only)."""
    app = await db_fetch_by_id("adoptions", adoption_id)
    if not app:
        raise HTTPException(status_code=404, detail="Adoption application not found")

    app["status"] = decision.status
    await db_upsert_doc("adoptions", app)

    # Sync animal status
    animal_id = app.get("animal_id")
    if animal_id:
        animal = await db_fetch_by_id("animals", animal_id)
        if animal:
            if decision.status == "Approved":
                animal["adoption_status"] = "Adopted"
            elif decision.status == "Rejected":
                animal["adoption_status"] = "Available for Adoption"
            await db_upsert_doc("animals", animal)

    return app
