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

Install the first three tools. The fourth is only a free sign-up, done in step 2.

| Tool | Version | Download | Check it's installed |
| --- | --- | --- | --- |
| **Node.js** | 18 or newer | <https://nodejs.org> (pick the **LTS** version) | `node --version` |
| **Python** | 3.10 or newer | <https://www.python.org/downloads> | `python --version` |
| **Git** | any | <https://git-scm.com> | `git --version` |
| **Supabase account** | — | <https://supabase.com> (free plan) | you'll sign in during step 2 |

> **No Git?** You don't need it. On the GitHub page click the green **Code** button → **Download ZIP**,
> then unzip it. Every step below still works — just `cd` into the unzipped folder instead of cloning.

> **Windows users:** when installing Python, tick the box **"Add python.exe to PATH"** on the first
> screen of the installer. Without it, `python` won't be recognised in the terminal.

### What you'll end up with

```text
Terminal 1  →  backend running on  http://localhost:8000   (the API)
Terminal 2  →  website running on  http://localhost:5173   (what you open in the browser)
            →  data stored in     your Supabase project   (shared by everyone)
```

---

## 🚀 Setup — step by step

### 1. Get the code

```bash
git clone https://github.com/ASH5717/paw-track.git
cd paw-track
```

### 2. Set up the database (Supabase) — no experience needed

> **Never used a backend before?** You're fine. For this step you install nothing — no servers, no
> databases on your computer. Supabase is a free website that hosts your database for you. You create
> an account, click a few buttons, and paste one block of text. Takes about 5 minutes.
>
> **Why is this needed?** Without it, the website only shows demo data saved in your own browser. With
> it, every visitor and every device sees the *same* dogs, ratings and reports.

#### 2.1 Create your free Supabase account

1. Open <https://supabase.com> in your browser.
2. Click **Start your project** in the top-right corner.
3. Sign up with **GitHub** (fastest) or with your **email**. If you use email, click the confirmation
   link they send you.
4. You now land on the Supabase dashboard. This is where all the app's data will live.

#### 2.2 Create your project

1. Click the green **New project** button.
2. Fill in the form:
   - **Organization** — pick the one that's already there (usually your own name).
   - **Name** — type `paw-track`.
   - **Database Password** — click **Generate a password**, then save it somewhere safe. The website
     never asks for it, so you almost certainly won't need it again — but it can't be recovered.
   - **Region** — choose whichever is closest to you.
   - **Pricing Plan** — choose **Free**.
3. Click **Create new project**.
4. Wait roughly 2 minutes. The screen shows "Setting up project…" — just leave the tab open until the
   dashboard appears.

#### 2.3 Create the tables (run the SQL script)

1. In the left sidebar, click **SQL Editor** (the `</>` icon).
2. Click **+ New query** to open a blank editor.
3. Get the SQL text from the file [backend/sql/schema.sql](backend/sql/schema.sql):
   - **From GitHub:** open the file, then click the **Copy raw contents** button (the two-squares
     icon at the top-right of the file view).
   - **On your computer:** open it in VS Code or any editor, press <kbd>Ctrl</kbd>+<kbd>A</kbd> then
     <kbd>Ctrl</kbd>+<kbd>C</kbd>.
4. Click inside the Supabase editor and paste with <kbd>Ctrl</kbd>+<kbd>V</kbd>.
5. Click the green **Run** button (top-right), or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.
6. After a few seconds you should see **"Success. No rows returned"**. That is the correct result —
   the script only creates empty tables, so there are no rows to show.
7. **Check it worked:** click **Table Editor** in the left sidebar. You should now see these tables:

   `activity_logs`, `admin_emails`, `adoptions`, `animal_ratings`, `animals`, `feeding_groups`,
   `notifications`, `volunteer_reports`, `volunteers`

   > Pressing **Run** a second time may show messages like *"already exists, skipping"*. That's
   > harmless — the script is safe to run again.

#### 2.4 Copy your two credentials

1. In the left sidebar, scroll to the bottom and click **Project Settings** (the gear icon).
2. Click **API** in the settings menu.
3. Keep this browser tab open and copy these two values — you'll paste them in **two places** later:

   | # | What you need | Where to find it on that page | What it looks like |
   | --- | --- | --- | --- |
   | 1 | **Project URL** | The **Project URL** section → click the copy icon | `https://abcdefghijkl.supabase.co` |
   | 2 | **anon public** key | The **Project API keys** section → the row labelled `anon` `public` → copy icon | `eyJhbGciOiJ...` (older projects) or `sb_publishable_...` (newer projects) |

4. ⚠️ **Do not copy the `service_role` or `secret` key** (the one starting with `sb_secret_`). It gives
   full control of your entire database and bypasses all security rules — it must never go into a
   website or a GitHub repo. If you ever paste it somewhere public, come back to this page and revoke it.

### 3. Set up the backend (FastAPI)

> **What is this?** A small program that runs on your own computer and serves the app's API. You start
> it with one command and leave it running in its own terminal window while you use the website.

#### 3.1 Check that Python is installed

Open a terminal (**Windows:** press <kbd>Win</kbd>, type `powershell`, press Enter) and run:

```bash
python --version
```

- Prints something like `Python 3.12.4` → you're ready, go to 3.2.
- Says *"python is not recognized"* → install it from <https://www.python.org/downloads>. **Important:**
  on the very first installer screen, tick the box **"Add python.exe to PATH"** before clicking Install.
  Then **close and reopen** the terminal and run the check again.

#### 3.2 Open the backend folder

```bash
cd path/to/paw-track/backend
```

Replace `path/to/paw-track` with where you cloned the repo. On Windows you can instead open the
`backend` folder in File Explorer, right-click an empty spot, and choose **Open in Terminal**.

#### 3.3 Create a virtual environment and install the libraries

An "environment" is just a private folder holding this project's Python libraries, so they can't clash
with anything else on your computer.

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

**How to tell it worked:** your terminal prompt now starts with `(.venv)`, like
`(.venv) PS C:\...\paw-track\backend>`. The `pip install` line downloads FastAPI and its friends and
takes a minute or two; when it finishes you'll be back at a prompt with no red errors.

> If Windows shows a red error about *"running scripts is disabled on this system"*, run this once in
> the same window, then retry the activate line:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
>
> (Or use the old Command Prompt and run `.\.venv\Scripts\activate.bat` instead.)

#### 3.4 Create the settings file `backend/.env`

The backend needs to know your Supabase details. Create a **new plain-text file** named exactly `.env`
inside the `backend/` folder (next to `requirements.txt`) and paste this in:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=
SECRET_KEY=change-me-to-any-long-random-text-1234567890
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OWNER_EMAIL=your-email@example.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

| Line | What to put there |
| --- | --- |
| `SUPABASE_URL` | The **Project URL** you copied in step 2.4 |
| `SUPABASE_ANON_KEY` | The **anon public** key you copied in step 2.4 |
| `SUPABASE_SERVICE_ROLE_KEY` | Leave empty — not needed |
| `SECRET_KEY` | Any long random text (mash your keyboard for ~40 characters). Used to sign login tokens. |
| `ALGORITHM` | Leave as `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Leave as `1440` (logins last 24 hours) |
| `OWNER_EMAIL` | The email you want to be the **first admin** of the registry |
| `CORS_ORIGINS` | Leave as-is — it lets the website talk to the backend |

> ⚠️ **Windows Notepad trap:** if you create the file in Notepad, choose *Save as type → All Files*
> and name it `.env`. Otherwise Windows silently saves it as `.env.txt` and the app will never read it.
> In VS Code simply name the file `.env`.

> Your keys live in this file, so it is listed in `.gitignore` and will never be uploaded to GitHub.

#### 3.5 Start the backend

Still in the `backend` folder (and with `(.venv)` showing in your prompt), run:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

You should see output like:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

**Leave this window open** — that's your backend running. Verify it in your browser:

| URL | What you should see |
| --- | --- |
| <http://localhost:8000/api/health> | JSON starting with `{"status":"healthy"...}` |
| <http://localhost:8000/docs> | Interactive API documentation |
| <http://localhost:8000/redoc> | Alternative API documentation |

> To stop the backend later, click its terminal window and press <kbd>Ctrl</kbd>+<kbd>C</kbd>.

### 4. Run the website (React)

The website is the part you actually look at. Open a **second terminal** — keep the backend running in
the first one — and go back to the repo root, the folder that contains `package.json`.

#### 4.1 Install the website's packages

```bash
cd path/to/paw-track
npm install
```

This downloads React and the other front-end libraries into a `node_modules` folder. It takes a minute
or two and prints a summary when it's done.

> *"npm is not recognized"*? Install **Node.js 18 or newer** from <https://nodejs.org> (choose the LTS
> version), then close and reopen the terminal.

#### 4.2 Create the website's `.env` file

In the repo root (same folder as `package.json`), create a plain-text file named exactly `.env` and
paste this — the **same two values** from step 2.4, but with a `VITE_` prefix:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

- `VITE_SUPABASE_URL` → the **Project URL** from step 2.4
- `VITE_SUPABASE_ANON_KEY` → the **anon public** key from step 2.4

> The `VITE_` prefix is what allows the website to read these values — without it the app can't see
> them. A ready-made template is included as [`.env.example`](.env.example); you can copy it and fill
> it in instead of typing the file from scratch.

#### 4.3 Start the website

```bash
npm run dev
```

You'll see something like:

```text
  VITE v5.x.x  ready in 412 ms

  ➜  Local:   http://localhost:5173/
```

Open **<http://localhost:5173>** in your browser. That's the finished app.

> Keep **both** terminals open while you use it — one running the backend, one running the website.

#### ✅ Final check

You're fully set up when all three are true:

1. <http://localhost:8000/api/health> returns `{"status":"healthy"...}`
2. <http://localhost:5173> loads and you can sign in
3. No *"running on local demo data"* banner is shown — that banner means the database isn't connected yet
   (re-check step 2.4 and step 4.2)

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
| *"python is not recognized"* | Python isn't installed or isn't on PATH. Reinstall from <https://www.python.org/downloads> with **"Add python.exe to PATH"** ticked, then reopen the terminal. |
| *"npm is not recognized"* | Node.js isn't installed. Install the LTS version from <https://nodejs.org>, then reopen the terminal. |
| *"running scripts is disabled on this system"* | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal, then retry the activate command. |
| A red banner *"Not connected — running on local demo data"* | The website can't read your keys. Make sure the file is named exactly `.env`, sits in the repo root, and then restart `npm run dev`. |
| The file you saved shows up as `.env.txt` | Windows Notepad added an extension. Rename it to `.env`, or create it in VS Code. |
| *"Shared Database Unavailable"* | The SQL hasn't been run in Supabase yet. Redo step 2.3, then reload the page. |
| SQL Editor says *"already exists, skipping"* | Harmless — the script is safe to run more than once. |
| *"relation ... does not exist"* when the backend starts | The SQL wasn't run, or was run in a different Supabase project than the one in `backend/.env`. |
| Backend health check fails | Confirm `backend/.env` exists next to `requirements.txt` and that `SUPABASE_URL` / `SUPABASE_ANON_KEY` are the values from step 2.4. |
| Other people don't see your changes | Data is only shared once the SQL from step 2.3 has been run. Until then each browser keeps its own local copy. |
| Port 5173 already in use | Vite automatically moves to 5174 — use the URL it prints in the terminal. |
| Port 8000 already in use | Start the backend on another port: `python -m uvicorn app.main:app --reload --port 8001`. |

---

## 📄 License

Released for community and educational use.
