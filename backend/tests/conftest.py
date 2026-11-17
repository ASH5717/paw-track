import os
os.environ["TESTING"] = "true"

import pytest
from fastapi.testclient import TestClient
from app.config import get_settings
get_settings.cache_clear()

from app.main import app


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def admin_token(client: TestClient):
    res = client.post("/api/auth/demo-login", json={"role": "admin"})
    return res.json()["access_token"]


@pytest.fixture
def volunteer_token(client: TestClient):
    res = client.post("/api/auth/demo-login", json={"role": "volunteer"})
    return res.json()["access_token"]


@pytest.fixture
def user_token(client: TestClient):
    res = client.post("/api/auth/demo-login", json={"role": "user"})
    return res.json()["access_token"]
