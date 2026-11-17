import logging
from typing import Any, Dict, List, Optional
from supabase import create_client, Client
from app.config import get_settings

logger = logging.getLogger("pawtrack.database")
settings = get_settings()

_supabase_client: Optional[Client] = None

# In-memory storage for test isolation or offline fallback
_memory_store: Dict[str, Dict[str, Dict[str, Any]]] = {
    "animals": {},
    "adoptions": {},
    "feeding_groups": {},
    "notifications": {},
    "volunteer_reports": {},
    "volunteers": {},
    "activity_logs": {},
    "animal_ratings": {},
    "admin_emails": {"akashhabib577@gmail.com": {"email": "akashhabib577@gmail.com"}}
}


def get_supabase_client() -> Optional[Client]:
    """Returns singleton Supabase client or None if unconfigured or testing."""
    global _supabase_client
    import os
    if os.environ.get("TESTING") == "true" or get_settings().TESTING:
        return None
    if _supabase_client is None:
        try:
            curr_settings = get_settings()
            key = curr_settings.SUPABASE_SERVICE_ROLE_KEY or curr_settings.SUPABASE_ANON_KEY
            if curr_settings.SUPABASE_URL and key:
                _supabase_client = create_client(curr_settings.SUPABASE_URL, key)
                logger.info("Connected to Supabase at %s", curr_settings.SUPABASE_URL)
        except Exception as e:
            logger.warning("Could not initialize Supabase client: %s. Using memory fallback.", e)
            _supabase_client = None
    return _supabase_client


# --- Data Access Helpers ---

async def db_fetch_collection(table_name: str) -> List[Dict[str, Any]]:
    """Fetch all records from a document table (id + data)."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table(table_name).select("id, data").order("created_at", desc=True).execute()
            if res.data:
                return [{**(row.get("data") or {}), "id": row["id"]} for row in res.data]
            return []
        except Exception as e:
            logger.warning("Supabase fetch failed on %s (%s). Falling back to memory store.", table_name, e)

    # Memory fallback
    records = list(_memory_store.get(table_name, {}).values())
    return records


async def db_fetch_by_id(table_name: str, doc_id: str) -> Optional[Dict[str, Any]]:
    """Fetch single document by ID."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table(table_name).select("id, data").eq("id", doc_id).execute()
            if res.data and len(res.data) > 0:
                row = res.data[0]
                return {**(row.get("data") or {}), "id": row["id"]}
            return None
        except Exception as e:
            logger.warning("Supabase fetch_by_id failed on %s:%s (%s)", table_name, doc_id, e)

    return _memory_store.get(table_name, {}).get(doc_id)


async def db_upsert_doc(table_name: str, doc: Dict[str, Any]) -> Dict[str, Any]:
    """Upsert document into table."""
    doc_id = str(doc.get("id"))
    # Save to memory store
    if table_name not in _memory_store:
        _memory_store[table_name] = {}
    _memory_store[table_name][doc_id] = doc

    client = get_supabase_client()
    if client:
        try:
            client.table(table_name).upsert({
                "id": doc_id,
                "data": doc
            }).execute()
        except Exception as e:
            logger.warning("Supabase upsert failed on %s:%s (%s)", table_name, doc_id, e)

    return doc


async def db_delete_doc(table_name: str, doc_id: str) -> bool:
    """Delete document by ID."""
    if table_name in _memory_store and doc_id in _memory_store[table_name]:
        del _memory_store[table_name][doc_id]

    client = get_supabase_client()
    if client:
        try:
            client.table(table_name).delete().eq("id", doc_id).execute()
        except Exception as e:
            logger.warning("Supabase delete failed on %s:%s (%s)", table_name, doc_id, e)

    return True


# --- Animal Ratings Helpers ---

async def db_fetch_ratings_map() -> Dict[str, List[int]]:
    """Returns mapping of animal_id -> list of star scores."""
    ratings_map: Dict[str, List[int]] = {}
    client = get_supabase_client()
    if client:
        try:
            res = client.table("animal_ratings").select("animal_id, score").execute()
            if res.data:
                for row in res.data:
                    aid = row.get("animal_id")
                    score = row.get("score")
                    if aid and score is not None:
                        ratings_map.setdefault(aid, []).append(int(score))
                return ratings_map
        except Exception as e:
            logger.warning("Supabase fetch_ratings failed (%s)", e)

    # Memory fallback
    for r in _memory_store.get("animal_ratings", {}).values():
        aid = r.get("animal_id")
        score = r.get("score")
        if aid and score is not None:
            ratings_map.setdefault(aid, []).append(int(score))
    return ratings_map


async def db_insert_rating(animal_id: str, score: int, rated_by: Optional[str] = None) -> Dict[str, Any]:
    """Insert a new rating."""
    import uuid
    record = {
        "id": str(uuid.uuid4()),
        "animal_id": animal_id,
        "score": score,
        "rated_by": rated_by
    }
    _memory_store["animal_ratings"][record["id"]] = record

    client = get_supabase_client()
    if client:
        try:
            client.table("animal_ratings").insert(record).execute()
        except Exception as e:
            logger.warning("Supabase insert_rating failed (%s)", e)

    return record


# --- Admin Emails Helpers ---

async def db_get_admin_emails() -> List[str]:
    """Get list of admin emails (owner is always included)."""
    admins = {settings.OWNER_EMAIL.lower()}
    client = get_supabase_client()
    if client:
        try:
            res = client.table("admin_emails").select("email").execute()
            if res.data:
                for row in res.data:
                    em = row.get("email")
                    if em:
                        admins.add(em.strip().lower())
                return sorted(list(admins))
        except Exception as e:
            logger.warning("Supabase get_admin_emails failed (%s)", e)

    for em in _memory_store.get("admin_emails", {}).keys():
        admins.add(em.lower())
    return sorted(list(admins))


async def db_grant_admin_email(email: str, granted_by: Optional[str] = None) -> bool:
    """Grant admin access to email."""
    norm_email = email.strip().lower()
    _memory_store["admin_emails"][norm_email] = {"email": norm_email}

    client = get_supabase_client()
    if client:
        try:
            client.table("admin_emails").upsert({"email": norm_email}).execute()
        except Exception as e:
            logger.warning("Supabase grant_admin_email failed (%s)", e)

    return True


async def db_revoke_admin_email(email: str) -> bool:
    """Revoke admin access (owner cannot be revoked)."""
    norm_email = email.strip().lower()
    if norm_email == settings.OWNER_EMAIL.lower():
        return False

    if norm_email in _memory_store.get("admin_emails", {}):
        del _memory_store["admin_emails"][norm_email]

    client = get_supabase_client()
    if client:
        try:
            client.table("admin_emails").delete().eq("email", norm_email).execute()
        except Exception as e:
            logger.warning("Supabase revoke_admin_email failed (%s)", e)

    return True
