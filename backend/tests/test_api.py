import pytest
from fastapi.testclient import TestClient


def test_root_and_health(client: TestClient):
    res = client.get("/api/info")
    assert res.status_code == 200
    data = res.json()
    assert data["service"] == "PAW TRACK API"

    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res = client.get("/")
    assert res.status_code == 200


def test_auth_demo_and_me(client: TestClient, admin_token: str):
    res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    user = res.json()
    assert user["role"] == "admin"


def test_animals_list_and_filter(client: TestClient):
    res = client.get("/api/animals")
    assert res.status_code == 200
    animals = res.json()
    assert len(animals) >= 1
    assert any(a["name"] == "Bholu" for a in animals)

    # Filter by query
    res = client.get("/api/animals?query=Bholu")
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["name"] == "Bholu"


def test_animal_get_by_id(client: TestClient):
    res = client.get("/api/animals/a1")
    assert res.status_code == 200
    animal = res.json()
    assert animal["name"] == "Bholu"
    assert "average_rating" in animal
    assert "ratings_count" in animal


def test_register_and_delete_animal(client: TestClient, admin_token: str):
    payload = {
        "name": "Rocky",
        "breed": "Indie Shepherd Mix",
        "estimated_age": "2 Years",
        "gender": "Male",
        "colour": "Black & Tan",
        "location_name": "Koramangala 4th Block",
        "health_status": "Healthy",
        "vaccination_status": "Vaccinated",
        "behaviour_status": "Friendly",
        "adoption_status": "Available for Adoption",
        "sterilized": True,
        "dewormed": True,
        "photos": ["https://example.com/rocky.jpg"]
    }

    res = client.post(
        "/api/animals",
        json=payload,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 201
    created = res.json()
    assert created["name"] == "Rocky"
    assert created["animal_code"].startswith("PT-")
    animal_id = created["id"]

    # Delete animal
    res = client.delete(
        f"/api/animals/{animal_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 204


def test_medical_and_vaccination_logs(client: TestClient, admin_token: str):
    # Add medical record
    med_payload = {
        "diagnosis": "Seasonal Allergy",
        "symptoms": "Itchy ears",
        "treatment": "Topical drops",
        "disease_flag": "None"
    }
    res = client.post(
        "/api/animals/a1/medical",
        json=med_payload,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert "Medical record logged" in res.json()["message"]

    # Add vaccination
    vax_payload = {
        "vaccine": "Rabies Annual Booster",
        "date": "2026-11-14",
        "next_due": "2027-11-14",
        "batch": "RB-9988"
    }
    res = client.post(
        "/api/animals/a1/vaccination",
        json=vax_payload,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert "Vaccination certified" in res.json()["message"]


def test_rate_animal(client: TestClient, user_token: str):
    res = client.post(
        "/api/animals/a1/ratings",
        json={"score": 5},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["new_average"] > 0
    assert data["total_ratings"] > 0


def test_adoptions_flow(client: TestClient, admin_token: str):
    res = client.get("/api/adoptions")
    assert res.status_code == 200

    # Submit application
    app_payload = {
        "animal_id": "a4",
        "animal_code": "PT-2026-0004",
        "animal_name": "Kaveri",
        "applicant_name": "Rahul Test",
        "applicant_email": "rahul.test@example.com",
        "address": "123 Test Street",
        "home_type": "Independent house"
    }
    res = client.post("/api/adoptions", json=app_payload)
    assert res.status_code == 201
    created_app = res.json()
    app_id = created_app["id"]

    # Review decision
    res = client.put(
        f"/api/adoptions/{app_id}/decision",
        json={"status": "Approved"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert res.json()["status"] == "Approved"


def test_volunteer_reports_flow(client: TestClient, admin_token: str):
    report_payload = {
        "type": "New Animal Discovery",
        "animal_name": "Puppy Spot",
        "breed": "Indie Puppy",
        "location": "Indiranagar Metro",
        "urgency": "Normal",
        "notes": "Healthy pup spotted near station"
    }
    res = client.post("/api/volunteer-reports", json=report_payload)
    assert res.status_code == 201
    rep_id = res.json()["id"]

    # Review decision
    res = client.put(
        f"/api/volunteer-reports/{rep_id}/decision",
        json={"status": "Approved"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert res.json()["status"] == "Approved"


def test_feeding_groups_flow(client: TestClient, admin_token: str):
    res = client.get("/api/groups")
    assert res.status_code == 200

    # Batch feed
    res = client.post(
        "/api/groups/g1/feed",
        json={"food_type": "Dry Kibble + Boiled Rice"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert "Successfully recorded feeding" in res.json()["message"]


def test_notifications_flow(client: TestClient, admin_token: str):
    res = client.get("/api/notifications")
    assert res.status_code == 200

    res = client.put(
        "/api/notifications/read-all",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200


def test_analytics_and_csv_export(client: TestClient):
    res = client.get("/api/analytics/dashboard")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_animals"] > 0
    assert "vaccinated" in stats

    res = client.get("/api/analytics/monthly")
    assert res.status_code == 200
    assert len(res.json()) == 6

    res = client.get("/api/analytics/export-csv")
    assert res.status_code == 200
    assert "Animal_ID,Name,Breed" in res.text


def test_admin_allowlist_security(client: TestClient, admin_token: str):
    res = client.get(
        "/api/admin/emails",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    emails = res.json()
    assert "akashhabib577@gmail.com" in emails

    # Prevent revoking owner
    res = client.delete(
        "/api/admin/emails/akashhabib577@gmail.com",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 400
    assert "owner account privileges cannot be revoked" in res.json()["detail"]
