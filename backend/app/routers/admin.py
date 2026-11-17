from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel, EmailStr

from app.models.auth import UserInfo
from app.dependencies import require_admin
from app.database import (
    db_get_admin_emails,
    db_grant_admin_email,
    db_revoke_admin_email
)
from app.config import get_settings

router = APIRouter(prefix="/api/admin", tags=["Admin Access Control"])
settings = get_settings()


class AdminGrantRequest(BaseModel):
    email: str


@router.get("/emails", response_model=List[str])
async def list_admin_emails(current_user: UserInfo = Depends(require_admin)):
    """List all accounts with elevated administrative rights."""
    return await db_get_admin_emails()


@router.post("/emails", status_code=status.HTTP_201_CREATED)
async def grant_admin_access(
    payload: AdminGrantRequest,
    current_user: UserInfo = Depends(require_admin)
):
    """Grant administrative privileges to an email address."""
    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Invalid email address")

    await db_grant_admin_email(email, granted_by=current_user.email)
    return {"message": f"Admin privileges granted to {email}", "email": email}


@router.delete("/emails/{email}")
async def revoke_admin_access(
    email: str,
    current_user: UserInfo = Depends(require_admin)
):
    """Revoke administrative privileges from an email address (Owner cannot be revoked)."""
    target = email.strip().lower()
    if target == settings.OWNER_EMAIL.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The owner account privileges cannot be revoked."
        )

    success = await db_revoke_admin_email(target)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to revoke admin email")

    return {"message": f"Admin privileges revoked from {target}"}
