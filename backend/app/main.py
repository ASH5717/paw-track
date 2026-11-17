import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from app.config import get_settings
from app.seed import seed_database
from app.routers import (
    animals,
    adoptions,
    volunteers,
    volunteer_reports,
    groups,
    notifications,
    analytics,
    admin,
    auth
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pawtrack.api")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed initial data
    logger.info("Initializing PAW TRACK backend...")
    try:
        await seed_database()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error("Failed to seed database: %s", e)
    yield
    # Shutdown
    logger.info("Shutting down PAW TRACK backend.")


app = FastAPI(
    title="PAW TRACK API",
    description="Centralized Animal Identification, Veterinary Surveillance & Ethical Adoption Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev & preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(animals.router)
app.include_router(adoptions.router)
app.include_router(volunteers.router)
app.include_router(volunteer_reports.router)
app.include_router(groups.router)
app.include_router(notifications.router)
app.include_router(analytics.router)
app.include_router(admin.router)


@app.get("/api/info", tags=["General"])
async def api_info():
    """Service status and meta info."""
    return {
        "service": "PAW TRACK API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "surveillance_grid": "Active"
    }


@app.get("/api/health", tags=["General"])
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected",
        "supabase_url": settings.SUPABASE_URL
    }


# Path to built frontend assets
dist_dir = Path(__file__).resolve().parent.parent.parent / "dist"
assets_dir = dist_dir / "assets"

if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")


@app.get("/{full_path:path}", tags=["Frontend"])
async def serve_frontend(full_path: str):
    """Serve the single-page application frontend or static files."""
    # Don't intercept API or docs routes
    if full_path.startswith(("api/", "docs", "redoc", "openapi.json")):
        return HTMLResponse(status_code=404, content="Endpoint not found")

    if dist_dir.exists():
        requested_file = dist_dir / full_path
        if requested_file.is_file():
            return FileResponse(requested_file)
        index_file = dist_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)

    # Fallback developer portal if dist hasn't been built
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>PAW TRACK API & Portal</title>
        <style>
            body { font-family: system-ui, sans-serif; background: #FAF8F1; color: #26332B; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
            .card { background: white; padding: 36px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #A5B99A; max-width: 500px; width: 100%; text-align: center; }
            h1 { color: #174D37; margin-bottom: 8px; font-size: 24px; }
            p { color: #5C6B62; font-size: 14px; margin-bottom: 24px; }
            .btn { display: block; padding: 12px 20px; border-radius: 14px; background: #174D37; color: #FAF8F1; text-decoration: none; font-weight: bold; font-size: 14px; margin-bottom: 10px; transition: background 0.2s; }
            .btn:hover { background: #123B2B; }
            .btn-outline { background: transparent; color: #174D37; border: 1.5px solid #174D37; }
            .btn-outline:hover { background: #174D37; color: white; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>PAW TRACK Platform</h1>
            <p>Veterinary Surveillance, Identification & Ethical Adoption Grid</p>
            <a class="btn" href="http://localhost:5173/" target="_blank">Open Frontend Application (Port 5173)</a>
            <a class="btn btn-outline" href="/docs">Open Interactive Swagger API (/docs)</a>
            <a class="btn btn-outline" href="/api/health">System Health Check (/api/health)</a>
        </div>
    </body>
    </html>
    """)
