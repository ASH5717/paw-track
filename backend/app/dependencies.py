from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.utils import decode_access_token
from app.models.auth import UserInfo
from app.database import db_get_admin_emails
from app.config import get_settings

security = HTTPBearer(auto_error=False)
settings = get_settings()


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[UserInfo]:
    """Extract current user from Bearer JWT. If missing, returns a default public user."""
    if not credentials:
        # Default anonymous community member for read-only actions
        return UserInfo(
            name="Community Member",
            email="guest@pawtrack.org",
            role="user",
            org="Community Member & Adopter"
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub") or payload.get("email") or "unknown@pawtrack.org"
    name = payload.get("name") or email.split("@")[0]
    org = payload.get("org") or "Community Member"

    # Verify if email is registered in admin list
    admin_emails = await db_get_admin_emails()
    if email.lower() in [e.lower() for e in admin_emails]:
        role = "admin"
    else:
        role = payload.get("role") or "user"

    return UserInfo(name=name, email=email, role=role, org=org)


async def require_authenticated(user: UserInfo = Depends(get_current_user)) -> UserInfo:
    if user.email == "guest@pawtrack.org":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for this operation"
        )
    return user


async def require_admin(user: UserInfo = Depends(require_authenticated)) -> UserInfo:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required"
        )
    return user


async def require_volunteer_or_admin(user: UserInfo = Depends(require_authenticated)) -> UserInfo:
    if user.role not in ["admin", "volunteer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Volunteer or Administrator privileges required"
        )
    return user
