from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, ManProfile, Photo, MatchRequest
from backend.schemas import ManProfileUpdate, ManProfileOut, PhotoOut
from backend.utils.dependencies import require_man, require_woman
from backend import storage

router = APIRouter(prefix="/men", tags=["men"])

MAX_MAN_PHOTOS = 3
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


def to_photo_out(p: Photo) -> PhotoOut:
    return PhotoOut(
        id=p.id,
        user_id=p.user_id,
        file_path=p.file_path,
        photo_url=storage.photo_url(p.file_path),
        is_primary=p.is_primary,
        sort_order=p.sort_order,
    )


def _get_or_create_profile(user_id: int, db: Session) -> ManProfile:
    profile = db.query(ManProfile).filter(ManProfile.user_id == user_id).first()
    if not profile:
        profile = ManProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("/profile", response_model=ManProfileOut)
def get_profile(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(current_user.id, db)
    photos = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).all()
    return ManProfileOut(
        user_id=current_user.id,
        first_name=profile.first_name or "",
        age=profile.age or 18,
        bio=profile.bio,
        country=profile.country,
        city=profile.city,
        occupation=profile.occupation,
        photos=[to_photo_out(p) for p in photos],
    )


@router.put("/profile", response_model=ManProfileOut)
def update_profile(
    body: ManProfileUpdate,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    profile = _get_or_create_profile(current_user.id, db)
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    photos = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).all()
    return ManProfileOut(
        user_id=current_user.id,
        first_name=profile.first_name or "",
        age=profile.age or 18,
        bio=profile.bio,
        country=profile.country,
        city=profile.city,
        occupation=profile.occupation,
        photos=[to_photo_out(p) for p in photos],
    )


@router.post("/photos", response_model=PhotoOut, status_code=201)
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    count = db.query(Photo).filter(Photo.user_id == current_user.id).count()
    if count >= MAX_MAN_PHOTOS:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_MAN_PHOTOS} photos allowed")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WEBP images allowed")

    content = await file.read()
    try:
        key, _ = storage.upload_photo(content, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Archivo de imagen inválido")

    is_primary = 1 if count == 0 else 0
    photo = Photo(
        user_id=current_user.id,
        file_path=key,
        is_primary=is_primary,
        sort_order=count,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return to_photo_out(photo)


@router.get("/photos", response_model=List[PhotoOut])
def list_photos(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    photos = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).all()
    return [to_photo_out(p) for p in photos]


@router.delete("/photos/{photo_id}", status_code=204)
def delete_photo(
    photo_id: int,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    photo = db.query(Photo).filter(Photo.id == photo_id, Photo.user_id == current_user.id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    was_primary = photo.is_primary
    storage.delete_photo(photo.file_path)

    db.delete(photo)
    db.flush()

    if was_primary:
        next_photo = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).first()
        if next_photo:
            next_photo.is_primary = 1

    db.commit()


@router.put("/photos/{photo_id}/primary", response_model=PhotoOut)
def set_primary(
    photo_id: int,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    db.query(Photo).filter(Photo.user_id == current_user.id).update({"is_primary": 0})
    photo = db.query(Photo).filter(Photo.id == photo_id, Photo.user_id == current_user.id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    photo.is_primary = 1
    db.commit()
    db.refresh(photo)
    return to_photo_out(photo)


@router.get("/profile/{man_id}", response_model=ManProfileOut)
def get_man_public_profile(
    man_id: int,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    """Public man profile - visible to men (own profile or others)."""
    profile = db.query(ManProfile).filter(ManProfile.user_id == man_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    photos = db.query(Photo).filter(Photo.user_id == man_id).order_by(Photo.sort_order).all()
    return ManProfileOut(
        user_id=man_id,
        first_name=profile.first_name or "",
        age=profile.age or 18,
        bio=profile.bio,
        country=profile.country,
        city=profile.city,
        occupation=profile.occupation,
        photos=[to_photo_out(p) for p in photos],
    )


@router.get("/public/{man_id}", response_model=ManProfileOut)
def get_man_public_for_woman(
    man_id: int,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    """Woman views man's profile only if he sent her a request."""
    req = db.query(MatchRequest).filter(
        MatchRequest.man_id == man_id,
        MatchRequest.woman_id == current_user.id,
    ).first()
    if not req:
        raise HTTPException(status_code=403, detail="No request found")
    profile = db.query(ManProfile).filter(ManProfile.user_id == man_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    photos = db.query(Photo).filter(Photo.user_id == man_id).order_by(Photo.sort_order).all()
    return ManProfileOut(
        user_id=man_id,
        first_name=profile.first_name or "",
        age=profile.age or 18,
        bio=profile.bio,
        country=profile.country,
        city=profile.city,
        occupation=profile.occupation,
        photos=[to_photo_out(p) for p in photos],
    )
