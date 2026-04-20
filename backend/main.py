from dotenv import load_dotenv
load_dotenv()

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import engine, Base
from backend.routers import auth, women, subscriptions, browse, matches
from backend.routers import gifts, admin as admin_router, men, withdrawals
from backend import storage

# Create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MatchUp API", version="1.0.0")

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


@app.get("/")
def root():
    return {"app": "MatchUp API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
