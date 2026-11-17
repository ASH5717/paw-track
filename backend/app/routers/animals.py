from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime
import time

from app.models.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from app.models.medical import MedicalRecordCreate
from app.models.vaccination import VaccinationCreate
from app.models.behaviour import BehaviourLogCreate
from app.models.feeding import FeedingLogCreate
from app.models.rating import RatingCreate
from app.models.auth import UserInfo
from app.dependencies import get_current_user, require_authenticated, require_admin, require_volunteer_or_admin
from app.database import (
    db_fetch_collection,
    db_fetch_by_id,
    db_upsert_doc,
    db_delete_doc,
    db_fetch_ratings_map,
    db_insert_rating
)
from app.utils import generate_animal_code, calculate_average_rating

router = APIRouter(prefix="/api/animals", tags=["Animals Registry"])


@router.get("", response_model=List[AnimalResponse])
async def list_animals(
    query: Optional[str] = Query(None, description="Search by name, code, breed, or location"),
    location: Optional[str] = Query("All"),
    health: Optional[str] = Query("All"),
    vaccination: Optional[str] = Query("All"),
    behaviour: Optional[str] = Query("All"),
    adoption: Optional[str] = Query("All"),
):
    """List animals with optional multi-attribute filters."""
    animals = await db_fetch_collection("animals")
    ratings_map = await db_fetch_ratings_map()

    results = []
    for a in animals:
        # Search query check
        if query:
            q = query.lower()
            name_match = q in a.get("name", "").lower()
            code_match = q in a.get("animal_code", "").lower()
            breed_match = q in a.get("breed", "").lower()
            loc_match = q in a.get("location_name", "").lower()
            if not (name_match or code_match or breed_match or loc_match):
                continue

        # Location filter
        if location and location != "All" and location not in a.get("location_name", ""):
            continue

        # Status filters
        if health and health != "All" and a.get("health_status") != health:
            continue
        if vaccination and vaccination != "All" and a.get("vaccination_status") != vaccination:
            continue
        if behaviour and behaviour != "All" and a.get("behaviour_status") != behaviour:
            continue
        if adoption and adoption != "All" and a.get("adoption_status") != adoption:
            continue

        aid = a.get("id")
        scores = ratings_map.get(aid, [])
        a["average_rating"] = calculate_average_rating(scores)
        a["ratings_count"] = len(scores)

        results.append(a)

    return results


@router.get("/{animal_id}", response_model=AnimalResponse)
async def get_animal(animal_id: str):
    """Retrieve full animal profile by ID."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    ratings_map = await db_fetch_ratings_map()
    scores = ratings_map.get(animal_id, [])
    animal["average_rating"] = calculate_average_rating(scores)
    animal["ratings_count"] = len(scores)

    return animal


@router.post("", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
async def register_animal(
    payload: AnimalCreate,
    current_user: UserInfo = Depends(require_authenticated)
):
    """Register a new animal into the surveillance registry."""
    animals = await db_fetch_collection("animals")
    doc_id = f"a{int(time.time() * 1000)}"
    code = generate_animal_code(len(animals) + 1)
    today = datetime.now().strftime("%Y-%m-%d")

    is_volunteer = current_user.role == "volunteer"
    vax_status = "Verification Required" if is_volunteer else payload.vaccination_status

    initial_behaviour = {
        "id": f"b{int(time.time() * 1000)}",
        "date": today,
        "label": payload.behaviour_status,
        "notes": "Initial intake behavioural assessment recorded during registration.",
        "precautions": "Standard observation protocol.",
        "observer": current_user.name,
        "verified": not is_volunteer
    }

    doc = {
        **payload.model_dump(),
        "id": doc_id,
        "animal_code": code,
        "registered_date": today,
        "updated_at": today,
        "vaccination_status": vax_status,
        "medical_history": [],
        "vaccinations": [],
        "behaviour_logs": [initial_behaviour],
        "feeding_logs": []
    }

    await db_upsert_doc("animals", doc)

    # Activity log
    await db_upsert_doc("activity_logs", {
        "id": f"l{int(time.time() * 1000)}",
        "time": "Just now",
        "actor": current_user.name,
        "action": f"Registered {payload.name} with Unique ID {code}"
    })

    # Notification
    await db_upsert_doc("notifications", {
        "id": f"n{int(time.time() * 1000)}",
        "animal_id": doc_id,
        "title": "New Animal Registered",
        "message": f"{payload.name} ({code}) registered at {payload.location_name}.",
        "type": "info",
        "time": "Just now",
        "unread": True
    })

    doc["average_rating"] = 0.0
    doc["ratings_count"] = 0
    return doc


@router.put("/{animal_id}", response_model=AnimalResponse)
async def update_animal(
    animal_id: str,
    patch: AnimalUpdate,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Update registry fields of an animal."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    update_data = {k: v for k, v in patch.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now().strftime("%Y-%m-%d")

    merged = {**animal, **update_data}
    await db_upsert_doc("animals", merged)

    ratings_map = await db_fetch_ratings_map()
    scores = ratings_map.get(animal_id, [])
    merged["average_rating"] = calculate_average_rating(scores)
    merged["ratings_count"] = len(scores)

    return merged


@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_animal(
    animal_id: str,
    current_user: UserInfo = Depends(require_admin)
):
    """Delete an animal from the registry, cleaning up associated groups and adoptions."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    await db_delete_doc("animals", animal_id)

    # Clean up from feeding groups
    groups = await db_fetch_collection("feeding_groups")
    for g in groups:
        if animal_id in g.get("animal_ids", []):
            g["animal_ids"] = [aid for aid in g["animal_ids"] if aid != animal_id]
            await db_upsert_doc("feeding_groups", g)

    # Clean up adoptions
    adoptions = await db_fetch_collection("adoptions")
    for ad in adoptions:
        if ad.get("animal_id") == animal_id:
            await db_delete_doc("adoptions", ad["id"])

    return None


# --- Nested Sub-resource Log Handlers ---

@router.post("/{animal_id}/medical")
async def add_medical_record(
    animal_id: str,
    record: MedicalRecordCreate,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Add a veterinary or medical record."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    today = datetime.now().strftime("%Y-%m-%d")
    med_entry = {
        "id": f"m{int(time.time() * 1000)}",
        "date": today,
        **record.model_dump(),
        "veterinarian": record.veterinarian or current_user.name
    }

    # Update health status if disease flagged
    if record.disease_flag and record.disease_flag != "None":
        animal["health_status"] = "Critical Attention"
        # Trigger outbreak / quarantine notification
        await db_upsert_doc("notifications", {
            "id": f"n{int(time.time() * 1000)}",
            "animal_id": animal_id,
            "title": f"ALERT: {record.disease_flag}",
            "message": f"Veterinary escalation triggered for {animal.get('name')} ({animal.get('animal_code')}). Isolation required.",
            "type": "critical",
            "time": "Just now",
            "unread": True
        })
    elif record.new_health_status:
        animal["health_status"] = record.new_health_status

    animal.setdefault("medical_history", []).insert(0, med_entry)
    animal["updated_at"] = today
    await db_upsert_doc("animals", animal)

    return {"message": "Medical record logged successfully", "record": med_entry}


@router.post("/{animal_id}/vaccination")
async def add_vaccination(
    animal_id: str,
    vax: VaccinationCreate,
    current_user: UserInfo = Depends(require_volunteer_or_admin)
):
    """Add vaccination certification."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    today = datetime.now().strftime("%Y-%m-%d")
    vax_entry = {
        "id": f"v{int(time.time() * 1000)}",
        **vax.model_dump(),
        "vet": vax.vet or current_user.name,
        "status": "Verified"
    }

    animal.setdefault("vaccinations", []).insert(0, vax_entry)
    animal["vaccination_status"] = "Vaccinated"
    animal["updated_at"] = today
    await db_upsert_doc("animals", animal)

    return {"message": "Vaccination certified successfully", "record": vax_entry}


@router.post("/{animal_id}/behaviour")
async def add_behaviour_log(
    animal_id: str,
    log: BehaviourLogCreate,
    current_user: UserInfo = Depends(require_authenticated)
):
    """Add behavioural observation."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    is_admin = current_user.role == "admin"
    today = datetime.now().strftime("%Y-%m-%d")

    entry = {
        "id": f"b{int(time.time() * 1000)}",
        "date": today,
        **log.model_dump(),
        "observer": log.observer or current_user.name,
        "verified": is_admin
    }

    if is_admin:
        animal["behaviour_status"] = log.label

    animal.setdefault("behaviour_logs", []).insert(0, entry)
    animal["updated_at"] = today
    await db_upsert_doc("animals", animal)

    return {"message": "Behaviour log added", "record": entry}


@router.post("/{animal_id}/feeding")
async def add_feeding_log(
    animal_id: str,
    entry: FeedingLogCreate,
    current_user: UserInfo = Depends(require_authenticated)
):
    """Log individual animal feeding."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    today = datetime.now().strftime("%Y-%m-%d")
    feed_entry = {
        "id": f"f{int(time.time() * 1000)}",
        **entry.model_dump(),
        "fed_by": entry.fed_by or current_user.name
    }

    animal.setdefault("feeding_logs", []).insert(0, feed_entry)
    animal["updated_at"] = today
    await db_upsert_doc("animals", animal)

    return {"message": "Feeding logged successfully", "record": feed_entry}


@router.get("/{animal_id}/ratings")
async def get_animal_ratings(animal_id: str):
    """Get all community ratings and average score for an animal."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    ratings_map = await db_fetch_ratings_map()
    scores = ratings_map.get(animal_id, [])

    return {
        "animal_id": animal_id,
        "average_rating": calculate_average_rating(scores),
        "total_votes": len(scores),
        "ratings": scores
    }


@router.post("/{animal_id}/ratings")
async def rate_animal(
    animal_id: str,
    payload: RatingCreate,
    current_user: UserInfo = Depends(get_current_user)
):
    """Submit a community star rating (1-5)."""
    animal = await db_fetch_by_id("animals", animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    rated_by = payload.rated_by or (current_user.email if current_user else "anonymous")
    record = await db_insert_rating(animal_id, payload.score, rated_by)

    ratings_map = await db_fetch_ratings_map()
    scores = ratings_map.get(animal_id, [])

    return {
        "message": "Rating recorded successfully",
        "new_average": calculate_average_rating(scores),
        "total_ratings": len(scores),
        "record": record
    }
