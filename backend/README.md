# PAW TRACK — FastAPI Backend & Supabase Database

Centralized animal identification, veterinary surveillance, and ethical adoption platform backend built with **Python FastAPI** and **Supabase**.

---

## 🏗 Architecture & Key Modules

```text
backend/
├── app/
│   ├── config.py              # App settings, environment variables & CORS
│   ├── database.py            # Supabase connection & data access helpers
│   ├── dependencies.py        # JWT auth, role validation (admin, volunteer)
│   ├── utils.py               # Token generation, password hashing, code generators
│   ├── seed.py                # Initial database seeder
│   ├── main.py                # FastAPI entry point & router mounting
│   ├── models/                # Pydantic schemas
│   │   ├── animal.py          # Animal registry & profile schemas
│   │   ├── medical.py         # Veterinary diagnoses & prescriptions
│   │   ├── vaccination.py     # Rabies & multi-disease vaccines
│   │   ├── behaviour.py       # Temperament & observation logs
│   │   ├── feeding.py         # Feeding routes & nutrition logs
│   │   ├── adoption.py        # Adoption applications & decisions
│   │   ├── volunteer.py       # Registered field volunteers
│   │   ├── volunteer_report.py# Stray animal discoveries & medical alerts
│   │   ├── group.py           # Feeding clusters & batch operations
│   │   ├── notification.py    # Surveillance & outbreak notifications
│   │   ├── rating.py          # Community 1-5 star ratings
│   │   ├── auth.py            # User registration, login, and tokens
│   │   └── analytics.py       # Surveillance KPIs & trend models
│   └── routers/               # API Endpoints
│       ├── auth.py            # Authentication & 1-click role logins
│       ├── animals.py         # Animals registry CRUD & sub-resources
│       ├── adoptions.py       # Adoption application workflows
│       ├── volunteers.py      # Volunteer management
│       ├── volunteer_reports.py# Public/volunteer incident reports
│       ├── groups.py          # Feeding group operations & batch feeding
│       ├── notifications.py   # Surveillance alerts & inbox management
│       ├── analytics.py       # Live dashboard KPIs, trends & CSV export
│       └── admin.py           # Administrative allowlist & access control
├── sql/
│   └── schema.sql             # Complete Supabase DDL, RLS & Realtime script
├── tests/
│   ├── conftest.py            # Pytest fixtures & async HTTP test client
│   └── test_api.py            # Full API test suite (12 tests)
├── requirements.txt           # Python dependencies
└── .env                       # Backend environment configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Virtual environment (created in `backend/venv`)

### 2. Run the Development Server
```bash
# Navigate to the backend directory
cd backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```

- **Interactive API Documentation (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🗄 Supabase Database Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New query**.
3. Copy and paste the entire script from `backend/sql/schema.sql`.
4. Click **Run**.
5. All 8 tables (`animals`, `animal_ratings`, `adoptions`, `feeding_groups`, `notifications`, `volunteer_reports`, `volunteers`, `activity_logs`, `admin_emails`), row-level security (RLS) policies, and realtime replication channels will be created.

---

## 🧪 Running the Automated Test Suite

Run the full pytest suite:

```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```
