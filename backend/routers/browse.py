from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, WomanProfile, Photo, MatchRequest
from backend.schemas import WomanCardOut
from backend.utils.dependencies import require_subscription
from backend import storage

router = APIRouter(prefix="/browse", tags=["browse"])


def primary_photo_url(user_id: int, db: Session) -> Optional[str]:
    photo = db.query(Photo).filter(Photo.user_id == user_id, Photo.is_primary == 1).first()
    if not photo:
        photo = db.query(Photo).filter(Photo.user_id == user_id).order_by(Photo.sort_order).first()
    return storage.photo_url(photo.file_path) if photo else None


@router.get("/women", response_model=List[WomanCardOut])
def browse_women(
    page:    int = Query(1, ge=1),
    size:    int = Query(12, ge=1, le=50),
    country: Optional[str] = Query(None),
    city:    Optional[str] = Query(None),
    current_user: User = Depends(require_subscription),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * size
    query = db.query(WomanProfile).filter(WomanProfile.is_complete == 1)

    if country:
        query = query.filter(WomanProfile.country.ilike(f"%{country}%"))
    if city:
        query = query.filter(WomanProfile.city.ilike(f"%{city}%"))

    profiles = query.offset(offset).limit(size).all()

    result = []
    for p in profiles:
        req = db.query(MatchRequest).filter(
            MatchRequest.man_id == current_user.id,
            MatchRequest.woman_id == p.user_id,
        ).first()

        result.append(WomanCardOut(
            user_id=p.user_id,
            first_name=p.first_name,
            age=p.age,
            country=p.country,
            city=p.city,
            looking_for=p.looking_for,
            primary_photo_url=primary_photo_url(p.user_id, db),
            request_status=req.status if req else None,
        ))

    return result
