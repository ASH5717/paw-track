from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
import time

from app.models.group import (
    FeedingGroupCreate,
    FeedingGroupUpdate,
    FeedingGroupResponse,
    MarkGroupFedRequest
)
from app.models.auth import UserInfo
from app.dependencies import require_authenticated, require_volunteer_or_admin
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc,
    db_delete_doc
)

router = APIRouter(prefix="/api/groups", tags=["Feeding Groups"])


@router.get("", response_model=List[FeedingGroupResponse])
async def list_groups():
    """List all community feeding groups."""
    return await db_fetch_collection("feeding_groups")


@router.post("", response_model=FeedingGroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(
    payload: FeedingGroupCreate,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Create a new animal feeding route / cluster group."""
    doc_id = f"g{int(time.time() * 1000)}"
    today = datetime.now().strftime("%Y-%m-%d")

    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "created_by": current_user.name,
        "created_at": today,
        "last_fed_at": None,
        "last_fed_by": None,
        "feed_count": 0
    }

    await db_upsert_doc("feeding_groups", doc)
    return doc


@router.put("/{group_id}", response_model=FeedingGroupResponse)
async def update_group(
    group_id: str,
    patch: FeedingGroupUpdate,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Update feeding group metadata or animal memberships."""
    group = await db_fetch_by_id("feeding_groups", group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Feeding group not found")

    update_data = {k: v for k, v in patch.model_dump().items() if v is not None}
    group.update(update_data)
    await db_upsert_doc("feeding_groups", group)

    return group


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: str,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Delete a feeding group."""
    group = await db_fetch_by_id("feeding_groups", group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Feeding group not found")

    await db_delete_doc("feeding_groups", group_id)
    return None


@router.post("/{group_id}/feed")
async def mark_group_fed(
    group_id: str,
    payload: MarkGroupFedRequest,
    current_user: UserInfo = Depends(require_authenticated)
):
    """Mark an entire cluster as fed, appending feeding logs to all member animals."""
    group = await db_fetch_by_id("feeding_groups", group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Feeding group not found")

    today = datetime.now().strftime("%Y-%m-%d")
    fed_by = current_user.name
    animal_ids = group.get("animal_ids", [])

    # Update feeding log for every animal in the group
    for aid in animal_ids:
        animal = await db_fetch_by_id("animals", aid)
        if animal:
            feed_entry = {
                "id": f"f{int(time.time() * 1000)}{aid}",
                "fed_by": fed_by,
                "group": group.get("name"),
                "date": today,
                "food_type": payload.food_type,
                "notes": payload.notes
            }
            animal.setdefault("feeding_logs", []).insert(0, feed_entry)
            animal["updated_at"] = today
            await db_upsert_doc("animals", animal)

    # Update group record
    group["last_fed_at"] = today
    group["last_fed_by"] = fed_by
    group["feed_count"] = (group.get("feed_count") or 0) + 1
    await db_upsert_doc("feeding_groups", group)

    return {
        "message": f"Successfully recorded feeding for {len(animal_ids)} animals in {group.get('name')}",
        "group": group
    }
