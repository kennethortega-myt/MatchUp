from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, WomanProfile, Photo
from backend.schemas import ProfileUpdate, ProfileOut, PhotoOut, WomanCardOut, FullProfileOut
from backend.utils.dependencies import require_woman
from backend import storage

router = APIRouter(prefix="/women", tags=["women"])

MAX_PHOTOS = 8
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


@router.get("/profile", response_model=ProfileOut)
def get_profile(current_user: User = Depends(require_woman), db: Session = Depends(get_db)):
    profile = db.query(WomanProfile).filter(WomanProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profile", response_model=ProfileOut)
def update_profile(
    body: ProfileUpdate,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    profile = db.query(WomanProfile).filter(WomanProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    required = [profile.first_name, profile.age]
    profile.is_complete = 1 if all(required) else 0

    db.commit()
    db.refresh(profile)
    return profile


@router.post("/photos", response_model=PhotoOut, status_code=201)
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    count = db.query(Photo).filter(Photo.user_id == current_user.id).count()
    if count >= MAX_PHOTOS:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_PHOTOS} photos allowed")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WEBP images allowed")

    content = await file.read()
    try:
        key, _ = storage.upload_photo(content, current_user.id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

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
def list_photos(current_user: User = Depends(require_woman), db: Session = Depends(get_db)):
    photos = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).all()
    return [to_photo_out(p) for p in photos]


@router.delete("/photos/{photo_id}", status_code=204)
def delete_photo(
    photo_id: int,
    current_user: User = Depends(require_woman),
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
    current_user: User = Depends(require_woman),
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


@router.get("/profile/preview", response_model=FullProfileOut)
def preview_public_profile(
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    """Returns the woman's own profile exactly as a matched man would see it."""
    profile = db.query(WomanProfile).filter(WomanProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    photos = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).all()
    return FullProfileOut(
        user_id=current_user.id,
        first_name=profile.first_name,
        age=profile.age,
        bio=profile.bio,
        country=profile.country,
        city=profile.city,
        location=profile.location,
        occupation=profile.occupation,
        phone=profile.phone,
        instagram=profile.instagram,
        looking_for=profile.looking_for,
        photos=[to_photo_out(p) for p in photos],
    )


@router.get("/profile/card-preview", response_model=WomanCardOut)
def preview_card(
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    """Returns the woman's card as a man browsing would see it (photo + first name only)."""
    profile = db.query(WomanProfile).filter(WomanProfile.user_id == current_user.id).first()
    primary = db.query(Photo).filter(Photo.user_id == current_user.id, Photo.is_primary == 1).first()
    if not primary:
        primary = db.query(Photo).filter(Photo.user_id == current_user.id).order_by(Photo.sort_order).first()
    return WomanCardOut(
        user_id=current_user.id,
        first_name=profile.first_name if profile else "",
        primary_photo_url=storage.photo_url(primary.file_path) if primary else None,
        request_status=None,
    )
