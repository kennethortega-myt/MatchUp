from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import json

from backend.database import get_db
from backend.models import User, WomanProfile, AuditLog
from backend.schemas import RegisterRequest, LoginResponse
from backend.auth import (
    hash_password, verify_password, create_access_token, create_refresh_token,
    decode_refresh_token, get_current_user,
)
from backend.limiter import limiter
from backend.email_service import send_verification_email, send_reset_email, generate_token, REQUIRE_VERIFICATION

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE = "refresh_token"
COOKIE_MAX_AGE = 7 * 24 * 60 * 60  # 7 days


def _audit(db: Session, event_type: str, request: Request, user_id: int = None, details: dict = None):
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    db.add(AuditLog(
        event_type=event_type,
        user_id=user_id,
        ip_address=ip.split(",")[0].strip(),
        details=json.dumps(details) if details else None,
    ))
    db.commit()


def _set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=COOKIE_MAX_AGE,
        path="/api/auth",
    )


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def register(
    request: Request,
    response: Response,
    body: RegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="Este email ya está registrado")

    token = generate_token()
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        role=body.role,
        is_verified=0 if REQUIRE_VERIFICATION else 1,
        verification_token=token if REQUIRE_VERIFICATION else None,
    )
    db.add(user)
    db.flush()

    if body.role == "woman":
        db.add(WomanProfile(user_id=user.id))

    db.commit()
    db.refresh(user)

    _audit(db, "register", request, user_id=user.id, details={"email": body.email, "role": body.role})

    if REQUIRE_VERIFICATION:
        background_tasks.add_task(send_verification_email, body.email, token)
        return LoginResponse(requires_verification=True)

    access_token  = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    _set_refresh_cookie(response, refresh_token)
    return LoginResponse(access_token=access_token, user_id=user.id, role=user.role, email=user.email)


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form.username).first()

    if not user or not verify_password(form.password, user.hashed_password):
        _audit(db, "login_failed", request, details={"email": form.username})
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    if REQUIRE_VERIFICATION and not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Debes verificar tu correo electrónico antes de iniciar sesión",
        )

    _audit(db, "login_success", request, user_id=user.id)

    access_token  = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    _set_refresh_cookie(response, refresh_token)
    return LoginResponse(access_token=access_token, user_id=user.id, role=user.role, email=user.email)


@router.post("/refresh", response_model=LoginResponse)
def refresh_token(
    response: Response,
    refresh_token: Optional[str] = Cookie(None, alias=REFRESH_COOKIE),
    db: Session = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    new_access  = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    _set_refresh_cookie(response, new_refresh)
    return LoginResponse(access_token=new_access, user_id=user.id, role=user.role, email=user.email)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=REFRESH_COOKIE, path="/api/auth", samesite="none", secure=True)
    return {"message": "Sesión cerrada"}


@router.get("/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=404, detail="Token inválido o expirado")
    if user.is_verified:
        return {"message": "Cuenta ya verificada"}
    user.is_verified = 1
    user.verification_token = None
    db.commit()
    return {"message": "¡Cuenta verificada! Ya puedes iniciar sesión."}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(
    request: Request,
    background_tasks: BackgroundTasks,
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == body.email).first()
    if user:
        from backend.schemas import RegisterRequest
        import re
        token = generate_token()
        user.reset_token = token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        background_tasks.add_task(send_reset_email, body.email, token)
    return {"message": "Si el email existe, recibirás un enlace para restablecer tu contraseña"}


@router.post("/reset-password")
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    import re
    pw = body.password
    if (len(pw) < 8 or not re.search(r"[A-Z]", pw) or not re.search(r"[a-z]", pw)
            or not re.search(r"\d", pw) or not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-]", pw)):
        raise HTTPException(status_code=422, detail="La contraseña no cumple los requisitos de seguridad")

    user = db.query(User).filter(User.reset_token == body.token).first()
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    user.hashed_password = hash_password(body.password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    return {"message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión."}


@router.post("/resend-verification")
@limiter.limit("2/minute")
async def resend_verification(
    request: Request,
    background_tasks: BackgroundTasks,
    email: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if user and not user.is_verified:
        token = generate_token()
        user.verification_token = token
        db.commit()
        background_tasks.add_task(send_verification_email, email, token)
    return {"message": "Si el email existe y no está verificado, recibirás un nuevo enlace"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }
    if current_user.role == "woman" and current_user.profile:
        result["profile_complete"] = bool(current_user.profile.is_complete)
    return result
