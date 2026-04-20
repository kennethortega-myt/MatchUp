from datetime import datetime
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.auth import get_current_user
from backend.database import get_db
from backend.models import User, Subscription


def require_woman(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "woman":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Women only")
    return current_user


def require_man(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "man":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Men only")
    return current_user


def require_subscription(
    current_user: User = Depends(require_man),
    db: Session = Depends(get_db),
) -> User:
    sub = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active",
        Subscription.expires_at > datetime.utcnow(),
    ).first()
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Active subscription required",
        )
    return current_user
