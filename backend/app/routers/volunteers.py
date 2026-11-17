from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import time

from app.models.volunteer import VolunteerCreate, VolunteerResponse
from app.models.auth import UserInfo
from app.dependencies import require_admin
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc,
    db_delete_doc
)

router = APIRouter(prefix="/api/volunteers", tags=["Volunteers"])


@router.get("", response_model=List[VolunteerResponse])
async def list_volunteers():
    """List all registered community volunteers."""
    return await db_fetch_collection("volunteers")


@router.post("", response_model=VolunteerResponse, status_code=status.HTTP_201_CREATED)
async def add_volunteer(
    payload: VolunteerCreate,
    current_user: UserInfo = Depends(require_admin)
):
    """Register a new field volunteer."""
    doc_id = f"vol{int(time.time() * 1000)}"
    today = datetime.now().strftime("%Y-%m-%d")

    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "joined": today
    }

    await db_upsert_doc("volunteers", doc)

    # Activity log
    await db_upsert_doc("activity_logs", {
        "id": f"l{int(time.time() * 1000)}",
        "time": "Just now",
        "actor": current_user.name,
        "action": f"Registered new volunteer {payload.name} for {payload.zone}"
    })

    return doc


@router.delete("/{volunteer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_volunteer(
    volunteer_id: str,
    current_user: UserInfo = Depends(require_admin)
):
    """Remove a volunteer from the directory."""
    vol = await db_fetch_by_id("volunteers", volunteer_id)
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    await db_delete_doc("volunteers", volunteer_id)

    # Activity log
    await db_upsert_doc("activity_logs", {
        "id": f"l{int(time.time() * 1000)}",
        "time": "Just now",
        "actor": current_user.name,
        "action": f"Removed volunteer {vol.get('name', volunteer_id)} from the directory"
    })

    return None
