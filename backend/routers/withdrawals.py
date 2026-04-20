from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import get_db
from backend.models import User, MatchRequest, GiftTransaction, WithdrawalRequest
from backend.utils.dependencies import require_woman
from backend.constants import GIFT_CATALOG, WOMAN_SHARE

router = APIRouter(prefix="/withdrawals", tags=["withdrawals"])

VALID_METHODS = {"yape", "plin", "transfer"}


def _total_earned(woman_id: int, db: Session) -> float:
    total = 0.0
    for r in db.query(MatchRequest).filter(
        MatchRequest.woman_id == woman_id,
        MatchRequest.gift_type.isnot(None),
    ).all():
        catalog  = GIFT_CATALOG.get(r.gift_type or "", {})
        full_val = float(r.gift_value) if r.gift_value else catalog.get("price", 0.0)
        total   += round(full_val * WOMAN_SHARE, 2)
    for tx in db.query(GiftTransaction).filter(
        GiftTransaction.receiver_id == woman_id,
        GiftTransaction.sender_role  == "man",
    ).all():
        total += round(float(tx.gift_value) * WOMAN_SHARE, 2)
    return round(total, 2)


class WithdrawalRequestBody(BaseModel):
    amount:       float
    method:       str
    account_info: str


class WithdrawalOut(BaseModel):
    id:           int
    amount:       float
    method:       str
    account_info: str
    status:       str
    admin_notes:  Optional[str]
    created_at:   datetime


class BalanceOut(BaseModel):
    total_earned:    float
    total_withdrawn: float
    pending_held:    float
    available:       float
    withdrawals:     List[WithdrawalOut]


@router.get("/balance", response_model=BalanceOut)
def get_balance(
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    earned = _total_earned(current_user.id, db)
    rows   = (
        db.query(WithdrawalRequest)
        .filter(WithdrawalRequest.woman_id == current_user.id)
        .order_by(WithdrawalRequest.created_at.desc())
        .all()
    )
    withdrawn = round(sum(float(w.amount) for w in rows if w.status == "approved"), 2)
    held      = round(sum(float(w.amount) for w in rows if w.status == "pending"),  2)
    available = round(max(0.0, earned - withdrawn - held), 2)

    return BalanceOut(
        total_earned=earned,
        total_withdrawn=withdrawn,
        pending_held=held,
        available=available,
        withdrawals=[
            WithdrawalOut(
                id=w.id, amount=float(w.amount),
                method=w.method, account_info=w.account_info,
                status=w.status, admin_notes=w.admin_notes,
                created_at=w.created_at,
            )
            for w in rows
        ],
    )


@router.post("/request", status_code=201)
def request_withdrawal(
    body: WithdrawalRequestBody,
    current_user: User = Depends(require_woman),
    db: Session = Depends(get_db),
):
    if body.amount < 10:
        raise HTTPException(400, "El mínimo de retiro es S/. 10.00")
    if body.method not in VALID_METHODS:
        raise HTTPException(400, "Método de pago inválido")
    if not body.account_info.strip():
        raise HTTPException(400, "Los datos de cuenta son obligatorios")

    earned = _total_earned(current_user.id, db)
    rows   = db.query(WithdrawalRequest).filter(WithdrawalRequest.woman_id == current_user.id).all()
    withdrawn = sum(float(w.amount) for w in rows if w.status == "approved")
    held      = sum(float(w.amount) for w in rows if w.status == "pending")
    available = round(max(0.0, earned - withdrawn - held), 2)

    if round(body.amount, 2) > available:
        raise HTTPException(400, f"Saldo insuficiente. Disponible: S/. {available:.2f}")

    wr = WithdrawalRequest(
        woman_id     = current_user.id,
        amount       = body.amount,
        method       = body.method,
        account_info = body.account_info.strip(),
        status       = "pending",
    )
    db.add(wr)
    db.commit()
    db.refresh(wr)
    return {"detail": "Solicitud enviada correctamente", "id": wr.id}
