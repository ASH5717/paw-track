from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import time

from app.models.notification import NotificationCreate, NotificationResponse
from app.models.auth import UserInfo
from app.dependencies import require_authenticated
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc,
    db_delete_doc
)

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
async def list_notifications():
    """List system and surveillance notifications."""
    return await db_fetch_collection("notifications")


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    payload: NotificationCreate,
    current_user: UserInfo = Depends(require_authenticated)
):
    """Dispatch a new surveillance alert or notification."""
    doc_id = f"n{int(time.time() * 1000)}"
    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "time": "Just now",
        "unread": True
    }
    await db_upsert_doc("notifications", doc)
    return doc


@router.put("/read-all")
async def mark_all_notifications_read():
    """Mark all active alerts as read."""
    notifications = await db_fetch_collection("notifications")
    for n in notifications:
        if n.get("unread"):
            n["unread"] = False
            await db_upsert_doc("notifications", n)
    return {"message": "All notifications marked as read"}


@router.put("/{notification_id}/read")
async def toggle_notification_read(
    notification_id: str,
    unread: bool = False
):
    """Mark single notification as read or unread."""
    notif = await db_fetch_by_id("notifications", notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif["unread"] = unread
    await db_upsert_doc("notifications", notif)
    return notif


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_notification(notification_id: str):
    """Dismiss/delete notification."""
    await db_delete_doc("notifications", notification_id)
    return None
