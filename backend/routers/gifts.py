from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db
from backend.models import User, MatchRequest, ManProfile, WomanProfile, Photo, GiftTransaction
from backend.schemas import GiftReplyRequest
from backend.utils.dependencies import require_woman, require_man
from backend.constants import GIFT_CATALOG, WOMAN_SHARE
from backend import storage

router = APIRouter(prefix="/gifts", tags=["gifts"])


def _primary_photo_url(user_id: int, db: Session) -> Optional[str]:
    photo = db.query(Photo).filter(Photo.user_id == user_id, Photo.is_primary == 1).first()
    if not photo:
        photo = db.query(Photo).filter(Photo.user_id == user_id).order_by(Photo.sort_order).first()
    return storage.photo_url(photo.file_path) if photo else None


class ManSenderInfo(BaseModel):
    man_id:     int
    first_name: str
    age:        Optional[int]
    country:    Optional[str]
    city:       Optional[str]
    photo_url:  Optional[str]


class GiftReceived(BaseModel):
    request_id:         int
    from_man_id:        int
    man_info:           Optional[ManSenderInfo]
    gift_type:          str
    gift_emoji:         str
    gift_label:         str
    gift_message:       Optional[str]
    woman_earning:      float
    reply_gift_type:    Optional[str]
    reply_gift_emoji:   Optional[str]
    reply_gift_label:   Optional[str]
    reply_gift_message: Optional[str]
    is_transaction:     bool = False
    request_status:     str = "accepted"   # status of the originating MatchRequest
    created_at:         datetime


class GiftSummary(BaseModel):
    total_gifts:   int
    total_earning: float
    gifts:         List[GiftReceived]


class GiftSent(BaseModel):
    request_id:   int
    to_woman_id:  int
    woman_name:   str
    woman_photo:  Optional[str]
    gift_type:    str
    gift_emoji:   str
    gift_label:   str
    gift_message: Optional[str]
    gift_value:   float
    reply_received:      bool
    reply_gift_type:     Optional[str]
    reply_gift_emoji:    Optional[str]
    reply_gift_label:    Optional[str]
    reply_gift_message:  Optional[str]
    is_transaction:      bool = False
    created_at:   datetime


class GiftSentSummary(BaseModel):
    total_sent:  int
    total_spent: float
    gifts:       List[GiftSent]


def _man_sender_info(man_id: int, db: Session) -> ManSenderInfo:
    man_profile = db.query(ManProfile).filter(ManProfile.user_id == man_id).first()
    if man_profile:
        return ManSenderInfo(
            man_id=man_id,
            first_name=man_profile.first_name or "Anónimo",
            age=man_profile.age,
            country=man_profile.country,
            city=man_profile.city,
            photo_url=_primary_photo_url(man_id, db),
        )
    return ManSenderInfo(
        man_id=man_id,
        first_name="Anónimo",
        age=None, country=None, city=None, photo_url=None,
    )


@router.get("/received", response_model=GiftSummary)
def received_gifts(current_user: User = Depends(require_woman), db: Session = Depends(get_db)):
    gifts_out: List[GiftReceived] = []
    total_earn = 0.0

    # 1) Initial gifts from MatchRequests (gift included in the request)
    rows = (
        db.query(MatchRequest)
        .filter(
            MatchRequest.woman_id == current_user.id,
            MatchRequest.gift_type.isnot(None),
        )
        .order_by(MatchRequest.created_at.desc())
        .all()
    )

    for r in rows:
        catalog  = GIFT_CATALOG.get(r.gift_type or "", {})
        full_val = float(r.gift_value) if r.gift_value else catalog.get("price", 0.0)
        earning  = round(full_val * WOMAN_SHARE, 2)
        total_earn += earning

        reply_catalog = GIFT_CATALOG.get(r.reply_gift_type or "", {}) if r.reply_gift_type else {}

        gifts_out.append(GiftReceived(
            request_id=r.id,
            from_man_id=r.man_id,
            man_info=_man_sender_info(r.man_id, db),
            gift_type=r.gift_type or "",
            gift_emoji=catalog.get("emoji", "🎁"),
            gift_label=catalog.get("label", r.gift_type or ""),
            gift_message=r.gift_message,
            woman_earning=earning,
            reply_gift_type=r.reply_gift_type,
            reply_gift_emoji=reply_catalog.get("emoji") if reply_catalog else None,
            reply_gift_label=reply_catalog.get("label") if reply_catalog else None,
            reply_gift_message=r.reply_gift_message,
            is_transaction=False,
            request_status=r.status,
            created_at=r.created_at,
        ))

    # 2) Additional gifts sent via GiftTransaction (after acceptance)
    transactions = (
        db.query(GiftTransaction)
        .filter(
            GiftTransaction.receiver_id == current_user.id,
            GiftTransaction.sender_role == "man",
        )
        .order_by(GiftTransaction.created_at.desc())
        .all()
    )

    for tx in transactions:
        catalog  = GIFT_CATALOG.get(tx.gift_type, {})
        full_val = float(tx.gift_value)
        earning  = round(full_val * WOMAN_SHARE, 2)
        total_earn += earning

        gifts_out.append(GiftReceived(
            request_id=tx.id,
            from_man_id=tx.sender_id,
            man_info=_man_sender_info(tx.sender_id, db),
            gift_type=tx.gift_type,
            gift_emoji=catalog.get("emoji", "🎁"),
            gift_label=catalog.get("label", tx.gift_type),
            gift_message=tx.gift_message,
            woman_earning=earning,
            reply_gift_type=None,
            reply_gift_emoji=None,
            reply_gift_label=None,
            reply_gift_message=None,
            is_transaction=True,
            request_status="accepted",   # transactions only exist for accepted requests
            created_at=tx.created_at,
        ))

    # Sort all gifts by most recent first
    gifts_out.sort(key=lambda g: g.created_at, reverse=True)

    return GiftSummary(
        total_gifts=len(gifts_out),
        total_earning=round(total_earn, 2),
        gifts=gifts_out,
    )


@router.post("/reply/{request_id}", status_code=200)
def reply_to_gift(
    request_id: int,
    body: GiftReplyRequest,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    req = db.query(MatchRequest).filter(
        MatchRequest.id == request_id,
        MatchRequest.woman_id == current_user.id,
        MatchRequest.gift_type.isnot(None),
        MatchRequest.status == "accepted",   # FIX: must be accepted
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Gift not found or request not accepted")
    if req.reply_gift_type:
        raise HTTPException(status_code=400, detail="Already replied to this gift")

    req.reply_gift_type = body.gift_type
    req.reply_gift_message = body.gift_message
    db.commit()
    return {"detail": "Reply sent"}


@router.get("/sent", response_model=GiftSentSummary)
def sent_gifts(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    gifts_out: List[GiftSent] = []
    total_spent = 0.0

    # 1) Initial gifts from MatchRequests
    rows = (
        db.query(MatchRequest)
        .filter(
            MatchRequest.man_id == current_user.id,
            MatchRequest.gift_type.isnot(None),
        )
        .order_by(MatchRequest.created_at.desc())
        .all()
    )

    for r in rows:
        catalog  = GIFT_CATALOG.get(r.gift_type or "", {})
        full_val = float(r.gift_value) if r.gift_value else catalog.get("price", 0.0)
        total_spent += full_val

        woman_profile = db.query(WomanProfile).filter(WomanProfile.user_id == r.woman_id).first()
        woman_name  = woman_profile.first_name if woman_profile else "Anónima"
        woman_photo = _primary_photo_url(r.woman_id, db)

        reply_catalog = GIFT_CATALOG.get(r.reply_gift_type or "", {}) if r.reply_gift_type else {}

        gifts_out.append(GiftSent(
            request_id=r.id,
            to_woman_id=r.woman_id,
            woman_name=woman_name,
            woman_photo=woman_photo,
            gift_type=r.gift_type or "",
            gift_emoji=catalog.get("emoji", "🎁"),
            gift_label=catalog.get("label", r.gift_type or ""),
            gift_message=r.gift_message,
            gift_value=full_val,
            reply_received=bool(r.reply_gift_type),
            reply_gift_type=r.reply_gift_type,
            reply_gift_emoji=reply_catalog.get("emoji") if reply_catalog else None,
            reply_gift_label=reply_catalog.get("label") if reply_catalog else None,
            reply_gift_message=r.reply_gift_message,
            is_transaction=False,
            created_at=r.created_at,
        ))

    # 2) Additional gifts via GiftTransaction
    transactions = (
        db.query(GiftTransaction)
        .filter(
            GiftTransaction.sender_id == current_user.id,
            GiftTransaction.sender_role == "man",
        )
        .order_by(GiftTransaction.created_at.desc())
        .all()
    )

    for tx in transactions:
        catalog  = GIFT_CATALOG.get(tx.gift_type, {})
        full_val = float(tx.gift_value)
        total_spent += full_val

        woman_profile = db.query(WomanProfile).filter(WomanProfile.user_id == tx.receiver_id).first()
        woman_name  = woman_profile.first_name if woman_profile else "Anónima"
        woman_photo = _primary_photo_url(tx.receiver_id, db)

        gifts_out.append(GiftSent(
            request_id=tx.id,
            to_woman_id=tx.receiver_id,
            woman_name=woman_name,
            woman_photo=woman_photo,
            gift_type=tx.gift_type,
            gift_emoji=catalog.get("emoji", "🎁"),
            gift_label=catalog.get("label", tx.gift_type),
            gift_message=tx.gift_message,
            gift_value=full_val,
            reply_received=False,
            reply_gift_type=None,
            reply_gift_emoji=None,
            reply_gift_label=None,
            reply_gift_message=None,
            is_transaction=True,
            created_at=tx.created_at,
        ))

    gifts_out.sort(key=lambda g: g.created_at, reverse=True)

    return GiftSentSummary(
        total_sent=len(gifts_out),
        total_spent=round(total_spent, 2),
        gifts=gifts_out,
    )
