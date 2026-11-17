# 🐾 PAW TRACK

A community dog management platform: a centralised registry of street dogs with vaccination tracking,
behaviour monitoring, ethical adoption workflows, volunteer coordination, feeding groups, live
surveillance notifications, community ratings and QR-based identification.

The project has two parts:

| Part | Folder | What it is |
| --- | --- | --- |
| **Website** | `src/` | React + Vite single-page app (the user interface) |
| **Backend** | `backend/` | Python **FastAPI** service (REST API, auth, business logic) |
| **Database** | Supabase | PostgreSQL with Row Level Security + realtime |

---

## ✨ Features

- **Animal registry** — searchable/filterable cards and table, each dog with a full profile (5 tabs).
- **Medical surveillance** — diagnoses, treatments, disease flags, veterinary notes.
- **Vaccination tracking** — rabies and multi-disease records with overdue detection.
- **Behaviour monitoring** — temperament logs and observation history.
- **Food & feeding groups** — feeding routes, group rosters and batch feeding logs.
- **Adoptions** — public applications plus an admin/volunteer review workflow.
- **Volunteers** — directory with counts, search and removal, plus field incident reports.
- **Notifications** — surveillance alerts that link straight to the relevant dog.
- **Community ratings** — a shared "Harmful → Excellent" scale; each dog shows the average of every vote.
- **QR codes** — every dog gets a scannable identity card; the built-in scanner supports camera flip.
- **Analytics** — dashboard KPIs, trends and CSV export.
- **Role-based access** — Admin, Volunteer and Public views.

---

## 🧱 Tech stack

**Frontend:** React 18, Vite 5, Tailwind CSS 3, framer-motion, lucide-react, recharts, leaflet,
`@supabase/supabase-js`, `jsqr`, `qrcode.react`

**Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic v2, python-jose (JWT), passlib/bcrypt, pytest

**Database:** Supabase (PostgreSQL + RLS + Realtime)

---

## 📁 Project structure

```text
paw-track/
├── src/                       # React frontend
│   ├── components/            # UI modules (animals, adoption, volunteers, settings, …)
│   ├── constants/
│   │   └── supabaseSchema.js  # SQL the website uses to create the shared tables
│   ├── data/                  # Bundled starter/demo data
│   ├── lib/                   # Supabase client, shared data layer, admin allow-list
│   └── App.jsx                # Root component: state, routing, handlers
├── public/                    # Static assets (e.g. bg.jpeg)
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── config.py          # Settings, CORS, environment variables
│   │   ├── database.py        # Supabase connection & data access helpers
│   │   ├── dependencies.py    # JWT auth & role validation
│   │   ├── models/            # Pydantic schemas
│   │   ├── routers/           # API endpoints
│   │   ├── seed.py            # Initial data seeder
│   │   └── main.py            # FastAPI entry point
│   ├── sql/schema.sql         # Complete Supabase DDL + RLS + Realtime script
│   ├── tests/                 # Pytest suite
│   ├── requirements.txt
│   └── .env                   # Backend environment variables (create this)
├── main.py                    # Convenience entry point: uvicorn main:app
├── .env.example               # Frontend environment template
└── package.json
```

---

## ✅ Prerequisites

Install these first:

- **Node.js 18 or newer** — <https://nodejs.org>
- **Python 3.10 or newer** — <https://www.python.org/downloads>
- **Git** — <https://git-scm.com>
- A free **Supabase** account — <https://supabase.com>

---

## 🚀 Setup — step by step

### 1. Get the code

```bash
git clone https://github.com/ASH5717/paw-track.git
cd paw-track
```

### 2. Create the database (Supabase)

1. Sign in at <https://supabase.com> and click **New project**. The free plan is enough.
2. Wait for it to finish provisioning, then open **SQL Editor → New query**.
3. Open the file [`backend/sql/schema.sql`](backend/sql/schema.sql) in this repo, copy **all** of it,
   paste it into the editor and click **Run**.
   This creates every table (`animals`, `animal_ratings`, `adoptions`, `feeding_groups`,
   `notifications`, `volunteer_reports`, `volunteers`, `activity_logs`, `admin_emails`),
   the row-level security policies and the realtime channels.
4. Open **Project Settings → API** and copy these two values — you'll need them in both steps below:

   | Name | Looks like |
   | --- | --- |
   | **Project URL** | `https://xxxxxxxxxxxx.supabase.co` |
   | **anon / publishable key** | `eyJhbGciOi...` or `sb_publishable_...` |

   > ⚠️ Never use the **secret / service_role** key in the frontend. It bypasses all security rules.

### 3. Run the backend (FastAPI)

```bash
cd backend
```

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Now create the file `backend/.env` with your own values:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=
SECRET_KEY=change-me-to-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OWNER_EMAIL=you@example.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Start the API server:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

| URL | Purpose |
| --- | --- |
| <http://localhost:8000/docs> | Interactive Swagger UI |
| <http://localhost:8000/redoc> | Alternative API docs |
| <http://localhost:8000/api/health> | Health check |

> You can also launch it from the repo root with `python main.py`.

### 4. Run the website (React)

Open a **second terminal** in the repo root (keep the backend running in the first one):

```bash
cd paw-track          # the repo root, where package.json lives
npm install
```

Create a file named `.env` in the repo root (copy `.env.example`) and paste the same two
Supabase values:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then start the dev server:

```bash
npm run dev
```

The website opens at **<http://localhost:5173>**.

> The website talks to Supabase directly, so it also works with the backend stopped — but run both
> for the complete setup.

---

## 🔐 Signing in

The sign-in screen offers one-click demo entry for each role, so you can explore the whole app
without creating accounts:

- **Admin** — full registry control, volunteer management, admin allow-list.
- **Volunteer** — field reports, feeding groups, incident logging.
- **Public** — browsing, ratings and adoption applications.

The first admin account is the `OWNER_EMAIL` you set in `backend/.env`. Additional admins can be
granted from **Settings → Database Schema → Admin Access Control**. Sessions persist across page
refreshes until you sign out.

---

## 🧪 Running the tests

```bash
cd backend
# Windows
.\.venv\Scripts\python.exe -m pytest -v
# macOS / Linux
python -m pytest -v
```

---

## 📦 Production build

```bash
npm run build     # outputs the static site to dist/
npm run preview   # serve the built bundle locally
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, GitHub Pages…). Remember to set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in that host's environment variables.

---

## 🛠 Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Not connected — running on local demo data" | Your `.env` values are missing or wrong. Check the file is in the repo root and restart `npm run dev`. |
| "Shared Database Unavailable" | The SQL hasn't been run yet. Repeat step 2, then reload. |
| Port 5173 already in use | Vite automatically switches to 5174 — use the URL it prints. |
| `Activate.ps1` blocked on Windows | Run `Set-ExecutionPolicy -Scope Process Bypass` first, or use `.\.venv\Scripts\activate.bat`. |
| Backend can't reach the database | Confirm `backend/.env` exists and `SUPABASE_URL` / `SUPABASE_ANON_KEY` are correct. |

---

## 📄 License

Released for community and educational use.
