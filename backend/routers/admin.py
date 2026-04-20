import os
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import get_db
from backend.models import User, Subscription, MatchRequest, WomanProfile, WithdrawalRequest, AuditLog
from backend.constants import GIFT_CATALOG, WOMAN_SHARE, ADMIN_SHARE, MONTHLY_PRICE, YEARLY_PRICE
from backend.crypto import decrypt

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_SECRET     = os.getenv("ADMIN_SECRET_KEY", "admin")
ADMIN_TOTP_SECRET = os.getenv("ADMIN_TOTP_SECRET", "")


def verify_admin(
    x_admin_key:  str = Header(...),
    x_admin_totp: str = Header(None),
):
    if x_admin_key != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")
    if ADMIN_TOTP_SECRET:
        import pyotp
        totp = pyotp.TOTP(ADMIN_TOTP_SECRET)
        if not x_admin_totp or not totp.verify(x_admin_totp, valid_window=1):
            raise HTTPException(status_code=403, detail="Invalid TOTP code")


# ── Response models ───────────────────────────────────────────────────────────

class SubscriptionStat(BaseModel):
    total_active: int
    total_monthly: int
    total_yearly: int
    revenue_monthly_plans: float
    revenue_yearly_plans: float
    total_revenue: float


class GiftStat(BaseModel):
    total_gifts_sent: int
    total_gift_value: float
    total_woman_earnings: float
    total_admin_earnings: float


class WomanBalance(BaseModel):
    user_id: int
    email: str
    first_name: str
    gifts_received: int
    total_gift_value: float
    woman_earning: float
    admin_earning: float


class RecentGift(BaseModel):
    request_id: int
    man_id: int
    woman_id: int
    gift_type: str
    gift_emoji: str
    gift_label: str
    full_value: float
    woman_gets: float
    admin_gets: float
    created_at: datetime


class WithdrawalAdminOut(BaseModel):
    id:           int
    woman_id:     int
    woman_email:  str
    woman_name:   str
    amount:       float
    method:       str
    account_info: str
    status:       str
    admin_notes:  Optional[str]
    created_at:   datetime


class AdminDashboard(BaseModel):
    generated_at: datetime
    subscriptions: SubscriptionStat
    gifts: GiftStat
    women_balances: List[WomanBalance]
    recent_gifts: List[RecentGift]
    recent_subscriptions: List[dict]
    pending_withdrawals_count: int


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=AdminDashboard, dependencies=[Depends(verify_admin)])
def admin_dashboard(db: Session = Depends(get_db)):

    # ── Subscriptions ─────────────────────────────────────────────────────────
    active_subs = db.query(Subscription).filter(
        Subscription.status == "active",
        Subscription.expires_at > datetime.utcnow(),
    ).all()

    monthly_count = sum(1 for s in active_subs if s.plan == "monthly")
    yearly_count  = sum(1 for s in active_subs if s.plan == "yearly")
    rev_monthly   = round(monthly_count * MONTHLY_PRICE, 2)
    rev_yearly    = round(yearly_count  * YEARLY_PRICE,  2)

    sub_stat = SubscriptionStat(
        total_active=len(active_subs),
        total_monthly=monthly_count,
        total_yearly=yearly_count,
        revenue_monthly_plans=rev_monthly,
        revenue_yearly_plans=rev_yearly,
        total_revenue=round(rev_monthly + rev_yearly, 2),
    )

    # Recent subs
    recent_subs_raw = db.query(Subscription).order_by(Subscription.created_at.desc()).limit(10).all()
    recent_subs = []
    for s in recent_subs_raw:
        user = db.query(User).filter(User.id == s.user_id).first()
        recent_subs.append({
            "user_id": s.user_id,
            "email": user.email if user else "?",
            "plan": s.plan,
            "status": s.status,
            "started_at": s.started_at.isoformat(),
            "expires_at": s.expires_at.isoformat(),
        })

    # ── Gifts ─────────────────────────────────────────────────────────────────
    gift_requests = db.query(MatchRequest).filter(MatchRequest.gift_type.isnot(None)).all()

    total_gift_val   = 0.0
    total_woman_earn = 0.0
    total_admin_earn = 0.0

    for r in gift_requests:
        catalog  = GIFT_CATALOG.get(r.gift_type or "", {})
        full_val = float(r.gift_value) if r.gift_value else catalog.get("price", 0.0)
        total_gift_val   += full_val
        total_woman_earn += round(full_val * WOMAN_SHARE, 2)
        total_admin_earn += round(full_val * ADMIN_SHARE, 2)

    gift_stat = GiftStat(
        total_gifts_sent=len(gift_requests),
        total_gift_value=round(total_gift_val, 2),
        total_woman_earnings=round(total_woman_earn, 2),
        total_admin_earnings=round(total_admin_earn, 2),
    )

    # ── Women balances ────────────────────────────────────────────────────────
    women = db.query(User).filter(User.role == "woman").all()
    women_balances = []
    for w in women:
        w_gifts = [r for r in gift_requests if r.woman_id == w.id]
        w_total = sum(
            float(r.gift_value) if r.gift_value else GIFT_CATALOG.get(r.gift_type or "", {}).get("price", 0.0)
            for r in w_gifts
        )
        w_earn = round(w_total * WOMAN_SHARE, 2)
        w_admin = round(w_total * ADMIN_SHARE, 2)
        profile = db.query(WomanProfile).filter(WomanProfile.user_id == w.id).first()
        women_balances.append(WomanBalance(
            user_id=w.id,
            email=w.email,
            first_name=profile.first_name if profile else "",
            gifts_received=len(w_gifts),
            total_gift_value=round(w_total, 2),
            woman_earning=w_earn,
            admin_earning=w_admin,
        ))

    # ── Recent gifts ──────────────────────────────────────────────────────────
    recent_gift_rows = (
        db.query(MatchRequest)
        .filter(MatchRequest.gift_type.isnot(None))
        .order_by(MatchRequest.created_at.desc())
        .limit(20)
        .all()
    )
    recent_gifts = []
    for r in recent_gift_rows:
        catalog  = GIFT_CATALOG.get(r.gift_type or "", {})
        full_val = float(r.gift_value) if r.gift_value else catalog.get("price", 0.0)
        recent_gifts.append(RecentGift(
            request_id=r.id,
            man_id=r.man_id,
            woman_id=r.woman_id,
            gift_type=r.gift_type or "",
            gift_emoji=catalog.get("emoji", "🎁"),
            gift_label=catalog.get("label", r.gift_type or ""),
            full_value=full_val,
            woman_gets=round(full_val * WOMAN_SHARE, 2),
            admin_gets=round(full_val * ADMIN_SHARE, 2),
            created_at=r.created_at,
        ))

    pending_withdrawals = db.query(WithdrawalRequest).filter(WithdrawalRequest.status == "pending").count()

    return AdminDashboard(
        generated_at=datetime.utcnow(),
        subscriptions=sub_stat,
        gifts=gift_stat,
        women_balances=women_balances,
        recent_gifts=recent_gifts,
        recent_subscriptions=recent_subs,
        pending_withdrawals_count=pending_withdrawals,
    )


# ── Withdrawal admin endpoints ────────────────────────────────────────────────

@router.get("/withdrawals", dependencies=[Depends(verify_admin)])
def list_withdrawals(status: str = "pending", db: Session = Depends(get_db)):
    rows = (
        db.query(WithdrawalRequest)
        .filter(WithdrawalRequest.status == status)
        .order_by(WithdrawalRequest.created_at.desc())
        .all()
    )
    result = []
    for w in rows:
        user    = db.query(User).filter(User.id == w.woman_id).first()
        profile = db.query(WomanProfile).filter(WomanProfile.user_id == w.woman_id).first()
        result.append(WithdrawalAdminOut(
            id=w.id,
            woman_id=w.woman_id,
            woman_email=user.email if user else "?",
            woman_name=profile.first_name if profile else "Sin nombre",
            amount=float(w.amount),
            method=w.method,
            account_info=decrypt(w.account_info),
            status=w.status,
            admin_notes=w.admin_notes,
            created_at=w.created_at,
        ))
    return result


class WithdrawalAction(BaseModel):
    notes: Optional[str] = None


@router.patch("/withdrawals/{withdrawal_id}/approve", dependencies=[Depends(verify_admin)])
def approve_withdrawal(
    withdrawal_id: int,
    body: WithdrawalAction = WithdrawalAction(),
    db: Session = Depends(get_db),
):
    w = db.query(WithdrawalRequest).filter(WithdrawalRequest.id == withdrawal_id).first()
    if not w:
        raise HTTPException(404, "Solicitud no encontrada")
    if w.status != "pending":
        raise HTTPException(400, "Solo se pueden aprobar solicitudes pendientes")
    w.status      = "approved"
    w.admin_notes = body.notes
    db.commit()
    return {"detail": "Aprobado"}


@router.patch("/withdrawals/{withdrawal_id}/reject", dependencies=[Depends(verify_admin)])
def reject_withdrawal(
    withdrawal_id: int,
    body: WithdrawalAction = WithdrawalAction(),
    db: Session = Depends(get_db),
):
    w = db.query(WithdrawalRequest).filter(WithdrawalRequest.id == withdrawal_id).first()
    if not w:
        raise HTTPException(404, "Solicitud no encontrada")
    if w.status != "pending":
        raise HTTPException(400, "Solo se pueden rechazar solicitudes pendientes")
    w.status      = "rejected"
    w.admin_notes = body.notes
    db.commit()
    return {"detail": "Rechazado"}
