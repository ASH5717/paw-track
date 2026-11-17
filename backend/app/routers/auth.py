from fastapi import APIRouter, Depends, HTTPException, status
from app.models.auth import (
    UserLogin,
    UserRegister,
    DemoLogin,
    ForgotPasswordRequest,
    UserInfo,
    Token
)
from app.dependencies import get_current_user, require_authenticated
from app.database import db_get_admin_emails, get_supabase_client
from app.utils import create_access_token, hash_password, verify_password
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["Authentication & Access"])
settings = get_settings()

# Local password store for offline demo/test usage
_user_credentials = {
    "dr.kavita@pawtrack.org": {
        "password_hash": hash_password("admin123"),
        "name": "Dr. Kavita Rao (Chief Vet & Admin)",
        "role": "admin",
        "org": "PAW TRACK Veterinary & Welfare Board"
    },
    "ananya.volunteer@pawtrack.org": {
        "password_hash": hash_password("volunteer123"),
        "name": "Ananya Sharma",
        "role": "volunteer",
        "org": "Indiranagar Community Rescuers"
    },
    "siddharth.k@example.com": {
        "password_hash": hash_password("user123"),
        "name": "Siddharth Kulkarni",
        "role": "user",
        "org": "Community Member & Adopter"
    },
    settings.OWNER_EMAIL.lower(): {
        "password_hash": hash_password("owner123"),
        "name": "Akash Habib (System Owner)",
        "role": "admin",
        "org": "PAW TRACK Global Registry"
    }
}


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    """Register new account. Checks admin allowlist for role assignment."""
    email = payload.email.strip().lower()
    admin_emails = await db_get_admin_emails()

    # Determine granted role
    if email in [e.lower() for e in admin_emails]:
        assigned_role = "admin"
    else:
        assigned_role = "user" if payload.role == "admin" else payload.role

    name = payload.full_name or email.split("@")[0]
    org = payload.org or "Community Member"

    # Attempt registration via Supabase Auth
    client = get_supabase_client()
    if client:
        try:
            client.auth.sign_up({
                "email": email,
                "password": payload.password,
                "options": {
                    "data": {
                        "full_name": name,
                        "role": assigned_role,
                        "org": org
                    }
                }
            })
        except Exception:
            pass

    # Store local credentials
    _user_credentials[email] = {
        "password_hash": hash_password(payload.password),
        "name": name,
        "role": assigned_role,
        "org": org
    }

    user_info = UserInfo(name=name, email=email, role=assigned_role, org=org)
    token = create_access_token({
        "sub": email,
        "name": name,
        "role": assigned_role,
        "org": org
    })

    return Token(access_token=token, token_type="bearer", user=user_info)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    """Authenticate with email and password."""
    email = payload.email.strip().lower()
    admin_emails = await db_get_admin_emails()
    is_admin = email in [e.lower() for e in admin_emails]

    # Guard the empty case: with OWNER_EMAIL unset the credentials table can
    # hold a blank key, which must never match a blank submitted email.
    user_data = _user_credentials.get(email) if email else None
    if user_data:
        if not verify_password(payload.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        role = "admin" if is_admin else user_data.get("role", "user")
        name = user_data.get("name", email.split("@")[0])
        org = user_data.get("org", "Community Member")
    else:
        # Try Supabase Auth
        client = get_supabase_client()
        if client:
            try:
                res = client.auth.sign_in_with_password({
                    "email": email,
                    "password": payload.password
                })
                meta = res.user.user_metadata if res.user else {}
                name = meta.get("full_name") or email.split("@")[0]
                role = "admin" if is_admin else meta.get("role", "user")
                org = meta.get("org", "Community Member")
            except Exception as e:
                raise HTTPException(status_code=401, detail="Invalid email or password")
        else:
            raise HTTPException(status_code=401, detail="User not found")

    user_info = UserInfo(name=name, email=email, role=role, org=org)
    token = create_access_token({
        "sub": email,
        "name": name,
        "role": role,
        "org": org
    })

    return Token(access_token=token, token_type="bearer", user=user_info)


@router.post("/demo-login", response_model=Token)
async def demo_login(payload: DemoLogin):
    """One-click instant demo login matching the frontend's preset roles."""
    presets = {
        "admin": {
            "name": payload.custom_name or "Dr. Kavita Rao (Chief Vet & Admin)",
            "email": payload.custom_email or "dr.kavita@pawtrack.org",
            "role": "admin",
            "org": "PAW TRACK Veterinary & Welfare Board"
        },
        "volunteer": {
            "name": payload.custom_name or "Ananya Sharma",
            "email": payload.custom_email or "ananya.volunteer@pawtrack.org",
            "role": "volunteer",
            "org": "Indiranagar Community Rescuers"
        },
        "user": {
            "name": payload.custom_name or "Siddharth Kulkarni",
            "email": payload.custom_email or "siddharth.k@example.com",
            "role": "user",
            "org": "Community Member & Adopter"
        }
    }

    selected = presets.get(payload.role, presets["user"])
    email = selected["email"].lower()

    # If role is admin, make sure it's in the allowlist
    if selected["role"] == "admin":
        from app.database import db_grant_admin_email
        await db_grant_admin_email(email)

    user_info = UserInfo(
        name=selected["name"],
        email=email,
        role=selected["role"],
        org=selected["org"]
    )

    token = create_access_token({
        "sub": email,
        "name": selected["name"],
        "role": selected["role"],
        "org": selected["org"]
    })

    return Token(access_token=token, token_type="bearer", user=user_info)


@router.get("/me", response_model=UserInfo)
async def get_me(current_user: UserInfo = Depends(require_authenticated)):
    """Retrieve currently active user profile and privileges."""
    return current_user


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    """Send password recovery instructions."""
    client = get_supabase_client()
    if client:
        try:
            client.auth.reset_password_for_email(payload.email)
        except Exception:
            pass
    return {"message": f"Password recovery instructions sent to {payload.email}"}


@router.post("/logout")
async def logout(current_user: UserInfo = Depends(get_current_user)):
    """Sign out active session."""
    client = get_supabase_client()
    if client:
        try:
            client.auth.sign_out()
        except Exception:
            pass
    return {"message": "Logged out successfully"}
