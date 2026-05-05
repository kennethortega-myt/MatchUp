from dotenv import load_dotenv
load_dotenv()

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from sqlalchemy import text
from backend.database import engine, Base
from backend.routers import auth, women, subscriptions, browse, matches
from backend.routers import gifts, admin as admin_router, men, withdrawals
from backend import storage
from backend.limiter import limiter

# Create all DB tables
Base.metadata.create_all(bind=engine)

# ── Startup migrations (idempotent) ───────────────────────────────────────────
def _run_migrations():
    stmts = [
        # Add missing columns to woman_profiles
        "ALTER TABLE woman_profiles ADD COLUMN telegram VARCHAR(100) NULL",
        "ALTER TABLE woman_profiles ADD COLUMN tiktok   VARCHAR(100) NULL",
        # Change looking_for from ENUM to VARCHAR to support multiple values
        "ALTER TABLE woman_profiles MODIFY COLUMN looking_for VARCHAR(255) NULL",
    ]
    with engine.connect() as conn:
        for stmt in stmts:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception:
                pass  # column already exists or already migrated

_run_migrations()

app = FastAPI(title="MatchUp API", version="1.0.0")

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"]  = "nosniff"
    response.headers["X-Frame-Options"]         = "DENY"
    response.headers["X-XSS-Protection"]        = "1; mode=block"
    response.headers["Referrer-Policy"]         = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"]      = "camera=(), microphone=(), geolocation=()"
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

_extra_origins = [o.strip() for o in os.getenv("FRONTEND_ORIGIN", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_extra_origins,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded photos only when using local storage
if storage.STORAGE_BACKEND == "local":
    storage.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(storage.UPLOAD_DIR)), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(women.router)
app.include_router(subscriptions.router)
app.include_router(browse.router)
app.include_router(matches.router)
app.include_router(gifts.router)
app.include_router(admin_router.router)
app.include_router(men.router)
app.include_router(withdrawals.router)


@app.on_event("startup")
async def startup_check():
    from backend.email_service import REQUIRE_VERIFICATION, MAIL_USERNAME, MAIL_SERVER, MAIL_PORT, FRONTEND_URL
    print(f"[STARTUP] REQUIRE_EMAIL_VERIFICATION={REQUIRE_VERIFICATION}")
    print(f"[STARTUP] MAIL_USERNAME={'set' if MAIL_USERNAME else 'EMPTY'}")
    print(f"[STARTUP] MAIL_SERVER={MAIL_SERVER} MAIL_PORT={MAIL_PORT}")
    print(f"[STARTUP] FRONTEND_URL={FRONTEND_URL}")


@app.get("/")
def root():
    return {"app": "MatchUp API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
