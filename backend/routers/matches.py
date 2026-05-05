from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth import get_current_user
from backend.models import User, WomanProfile, ManProfile, Photo, MatchRequest, GiftTransaction
from backend.schemas import (
    MatchRequestCreate, MatchRequestOut, PendingRequestOut, FullProfileOut, PhotoOut,
    ManSenderInfo, ManRequestOut, GiftSendRequest, ConversationGift,
)
from backend.utils.dependencies import require_man, require_woman, require_subscription
from backend.constants import GIFT_CATALOG
from backend import storage

router = APIRouter(prefix="/matches", tags=["matches"])


def to_photo_out(p: Photo) -> PhotoOut:
    return PhotoOut(
        id=p.id,
        user_id=p.user_id,
        file_path=p.file_path,
        photo_url=storage.photo_url(p.file_path),
        is_primary=p.is_primary,
        sort_order=p.sort_order,
    )


# ── Man: send request ─────────────────────────────────────────────────────────

@router.post("/request/{woman_user_id}", response_model=MatchRequestOut, status_code=201)
def send_request(
    woman_user_id: int,
    body: MatchRequestCreate,
    current_user: User = Depends(require_subscription),
    db: Session = Depends(get_db),
):
    man_has_photo = db.query(Photo).filter(Photo.user_id == current_user.id).first()
    if not man_has_photo:
        raise HTTPException(status_code=400, detail="Debes subir al menos una foto antes de enviar solicitudes")

    woman = db.query(User).filter(User.id == woman_user_id, User.role == "woman").first()
    if not woman:
        raise HTTPException(status_code=404, detail="Woman not found")

    existing = db.query(MatchRequest).filter(
        MatchRequest.man_id == current_user.id,
        MatchRequest.woman_id == woman_user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Request already sent")

    gift_value = None
    if body.gift_type and body.gift_type in GIFT_CATALOG:
        gift_value = str(GIFT_CATALOG[body.gift_type]["price"])

    req = MatchRequest(
        man_id=current_user.id,
        woman_id=woman_user_id,
        message=body.message,
        gift_type=body.gift_type,
        gift_message=body.gift_message,
        gift_value=gift_value,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


# ── Man: see my outgoing requests (enriched) ─────────────────────────────────

@router.get("/my-requests", response_model=List[ManRequestOut])
def my_requests(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    requests = db.query(MatchRequest).filter(MatchRequest.man_id == current_user.id).all()

    result = []
    for r in requests:
        # Woman info
        woman_profile = db.query(WomanProfile).filter(WomanProfile.user_id == r.woman_id).first()
        woman_name = (woman_profile.first_name or "Mujer") if woman_profile else "Mujer"
        primary_photo = db.query(Photo).filter(
            Photo.user_id == r.woman_id, Photo.is_primary == 1
        ).first()
        woman_photo = storage.photo_url(primary_photo.file_path) if primary_photo else None

        # Enrich initial gift info
        gift_emoji: Optional[str] = None
        gift_label: Optional[str] = None
        gift_value_float: Optional[float] = None
        if r.gift_type and r.gift_type in GIFT_CATALOG:
            catalog = GIFT_CATALOG[r.gift_type]
            gift_emoji = catalog["emoji"]
            gift_label = catalog["label"]
            gift_value_float = float(catalog["price"])

        # Enrich reply gift info
        reply_gift_emoji: Optional[str] = None
        reply_gift_label: Optional[str] = None
        if r.reply_gift_type and r.reply_gift_type in GIFT_CATALOG:
            reply_catalog = GIFT_CATALOG[r.reply_gift_type]
            reply_gift_emoji = reply_catalog["emoji"]
            reply_gift_label = reply_catalog["label"]

        # Count extra gifts sent via GiftTransaction
        extra_gifts_sent = db.query(GiftTransaction).filter(
            GiftTransaction.sender_id == current_user.id,
            GiftTransaction.receiver_id == r.woman_id,
            GiftTransaction.sender_role == "man",
        ).count()

        result.append(ManRequestOut(
            request_id=r.id,
            woman_id=r.woman_id,
            woman_name=woman_name,
            woman_photo=woman_photo,
            status=r.status,
            message=r.message,
            gift_type=r.gift_type,
            gift_emoji=gift_emoji,
            gift_label=gift_label,
            gift_message=r.gift_message,
            gift_value=gift_value_float,
            reply_gift_type=r.reply_gift_type,
            reply_gift_emoji=reply_gift_emoji,
            reply_gift_label=reply_gift_label,
            reply_gift_message=r.reply_gift_message,
            extra_gifts_sent=extra_gifts_sent,
            created_at=r.created_at,
        ))

    return result


# ── Woman: see incoming requests (with man_info) ──────────────────────────────

@router.get("/pending", response_model=List[PendingRequestOut])
def pending_requests(current_user: User = Depends(require_woman), db: Session = Depends(get_db)):
    requests = db.query(MatchRequest).filter(MatchRequest.woman_id == current_user.id).all()
    result = []
    for r in requests:
        man_profile = db.query(ManProfile).filter(ManProfile.user_id == r.man_id).first()
        primary_photo = db.query(Photo).filter(
            Photo.user_id == r.man_id, Photo.is_primary == 1
        ).first()
        man_info = None
        if man_profile:
            man_info = ManSenderInfo(
                man_id=r.man_id,
                first_name=man_profile.first_name or "",
                age=man_profile.age,
                country=man_profile.country,
                city=man_profile.city,
                photo_url=storage.photo_url(primary_photo.file_path) if primary_photo else None,
            )

        result.append(PendingRequestOut(
            request_id=r.id,
            man_id=r.man_id,
            man_info=man_info,
            message=r.message,
            gift_type=r.gift_type,
            gift_message=r.gift_message,
            gift_value=str(r.gift_value) if r.gift_value is not None else None,
            reply_gift_type=r.reply_gift_type,
            reply_gift_message=r.reply_gift_message,
            created_at=r.created_at,
            status=r.status,
        ))

    return result


# ── Woman: accept ─────────────────────────────────────────────────────────────

@router.put("/{request_id}/accept", response_model=MatchRequestOut)
def accept_request(
    request_id: int,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    req = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.woman_id == current_user.id,
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request already processed")

    req.status = "accepted"
    db.commit()
    db.refresh(req)
    return req


# ── Woman: reject ─────────────────────────────────────────────────────────────

@router.put("/{request_id}/reject", response_model=MatchRequestOut)
def reject_request(
    request_id: int,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    req = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.woman_id == current_user.id,
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request already processed")

    req.status = "rejected"
    db.commit()
    db.refresh(req)
    return req


# ── Man: see accepted matches (full profile unlocked) ────────────────────────

@router.get("/accepted", response_model=List[FullProfileOut])
def accepted_matches(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    requests = db.query(MatchRequest).filter(
        MatchRequest.man_id == current_user.id,
        MatchRequest.status == "accepted",
    ).all()

    result = []
    for req in requests:
        profile = db.query(WomanProfile).filter(WomanProfile.user_id == req.woman_id).first()
        if not profile:
            continue
        photos = db.query(Photo).filter(Photo.user_id == req.woman_id).order_by(Photo.sort_order).all()
        result.append(FullProfileOut(
            user_id=req.woman_id,
            first_name=profile.first_name,
            age=profile.age,
            bio=profile.bio,
            country=profile.country,
            city=profile.city,
            location=profile.location,
            occupation=profile.occupation,
            phone=profile.phone,
            instagram=profile.instagram,
            telegram=profile.telegram,
            tiktok=profile.tiktok,
            looking_for=profile.looking_for,
            photos=[to_photo_out(p) for p in photos],
        ))

    return result


@router.get("/accepted/{woman_user_id}", response_model=FullProfileOut)
def accepted_profile(
    woman_user_id: int,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    req = db.query(MatchRequest).filter(
        MatchRequest.man_id == current_user.id,
        MatchRequest.woman_id == woman_user_id,
        MatchRequest.status == "accepted",
    ).first()
    if not req:
        raise HTTPException(status_code=403, detail="Profile not unlocked")

    profile = db.query(WomanProfile).filter(WomanProfile.user_id == woman_user_id).first()
    photos = db.query(Photo).filter(Photo.user_id == woman_user_id).order_by(Photo.sort_order).all()

    return FullProfileOut(
        user_id=woman_user_id,
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


# ── Man: send additional gift on accepted request ─────────────────────────────

@router.post("/gift/{request_id}", status_code=201)
def send_gift_on_request(
    request_id: int,
    body: GiftSendRequest,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    """Man sends an additional gift on an already-accepted request."""
    req = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.man_id == current_user.id,
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "accepted":
        raise HTTPException(status_code=400, detail="Request must be accepted to send a gift")

    catalog = GIFT_CATALOG[body.gift_type]  # already validated by schema
    gift_value = float(catalog["price"])

    tx = GiftTransaction(
        sender_id=current_user.id,
        receiver_id=req.woman_id,
        sender_role="man",
        gift_type=body.gift_type,
        gift_message=body.gift_message,
        gift_value=gift_value,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return {
        "id": tx.id,
        "gift_type": tx.gift_type,
        "gift_emoji": catalog["emoji"],
        "gift_label": catalog["label"],
        "gift_value": gift_value,
        "gift_message": tx.gift_message,
        "created_at": tx.created_at,
    }


# ── Conversation: full gift history for a request pair ───────────────────────

@router.get("/conversation/{request_id}", response_model=List[ConversationGift])
def get_conversation_history(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns full gift history for a match request. Accessible by the man or the woman of the pair."""
    req = db.query(MatchRequest).filter(MatchRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if current_user.id not in (req.man_id, req.woman_id):
        raise HTTPException(status_code=403, detail="Access denied")

    history: List[ConversationGift] = []

    # 1) Initial gift from the MatchRequest (man → woman)
    if req.gift_type and req.gift_type in GIFT_CATALOG:
        catalog = GIFT_CATALOG[req.gift_type]
        history.append(ConversationGift(
            id=req.id,
            source="request",
            sender_role="man",
            gift_type=req.gift_type,
            gift_emoji=catalog["emoji"],
            gift_label=catalog["label"],
            gift_message=req.gift_message,
            gift_value=float(catalog["price"]),
            created_at=req.created_at,
        ))

    # 2) Reply gift stored on the MatchRequest (woman → man)
    if req.reply_gift_type and req.reply_gift_type in GIFT_CATALOG:
        catalog = GIFT_CATALOG[req.reply_gift_type]
        history.append(ConversationGift(
            id=req.id,
            source="request_reply",
            sender_role="woman",
            gift_type=req.reply_gift_type,
            gift_emoji=catalog["emoji"],
            gift_label=catalog["label"],
            gift_message=req.reply_gift_message,
            gift_value=float(catalog["price"]),
            created_at=req.updated_at,
        ))

    # 3) All GiftTransactions between this man/woman pair
    transactions = db.query(GiftTransaction).filter(
        ((GiftTransaction.sender_id == req.man_id) & (GiftTransaction.receiver_id == req.woman_id)) |
        ((GiftTransaction.sender_id == req.woman_id) & (GiftTransaction.receiver_id == req.man_id))
    ).order_by(GiftTransaction.created_at).all()

    for tx in transactions:
        if tx.gift_type not in GIFT_CATALOG:
            continue
        catalog = GIFT_CATALOG[tx.gift_type]
        history.append(ConversationGift(
            id=tx.id,
            source="transaction",
            sender_role=tx.sender_role,
            gift_type=tx.gift_type,
            gift_emoji=catalog["emoji"],
            gift_label=catalog["label"],
            gift_message=tx.gift_message,
            gift_value=float(tx.gift_value),
            created_at=tx.created_at,
        ))

    history.sort(key=lambda g: g.created_at)
    return history
