import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Subscription
from backend.schemas import CheckoutRequest, SubscriptionOut
from backend.utils.dependencies import require_man

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/status")
def subscription_status(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not sub:
        return {"status": None}

    if sub.status == "active" and sub.expires_at < datetime.utcnow():
        sub.status = "expired"
        db.commit()

    return SubscriptionOut.model_validate(sub)


@router.post("/checkout", response_model=SubscriptionOut, status_code=201)
def checkout(
    body: CheckoutRequest,
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
):
    if not body.card_number.strip() or not body.card_expiry.strip() or not body.card_cvv.strip():
        raise HTTPException(status_code=400, detail="Card details are required")

    days = 30 if body.plan == "monthly" else 365
    expires = datetime.utcnow() + timedelta(days=days)
    ref = f"mock_ch_{uuid.uuid4().hex[:16]}"

    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if sub:
        sub.plan             = body.plan
        sub.status           = "active"
        sub.mock_payment_ref = ref
        sub.started_at       = datetime.utcnow()
        sub.expires_at       = expires
    else:
        sub = Subscription(
            user_id=current_user.id,
            plan=body.plan,
            status="active",
            mock_payment_ref=ref,
            expires_at=expires,
        )
        db.add(sub)

    db.commit()
    db.refresh(sub)
    return sub


@router.delete("/cancel", status_code=204)
def cancel(current_user: User = Depends(require_man), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription")
    sub.status = "cancelled"
    db.commit()
