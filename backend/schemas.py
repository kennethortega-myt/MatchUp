from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        if v not in ("man", "woman"):
            raise ValueError("role must be 'man' or 'woman'")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        import re
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
            raise ValueError("La contraseña debe tener al menos una letra mayúscula")
        if not re.search(r"[a-z]", v):
            raise ValueError("La contraseña debe tener al menos una letra minúscula")
        if not re.search(r"\d", v):
            raise ValueError("La contraseña debe tener al menos un número")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-]", v):
            raise ValueError("La contraseña debe tener al menos un carácter especial (!@#$%...)")
        return v


class LoginResponse(BaseModel):
    access_token: str = ""
    token_type: str = "bearer"
    requires_verification: bool = False
    user_id: int = 0
    role: str = ""
    email: str = ""


# ── Woman Profile ─────────────────────────────────────────────────────────────

LOOKING_FOR_OPTIONS = ("relationship", "casual", "commitment", "outing", "surprise")

class ProfileUpdate(BaseModel):
    first_name:  Optional[str] = None
    age:         Optional[int] = None
    bio:         Optional[str] = None
    country:     Optional[str] = None
    city:        Optional[str] = None
    location:    Optional[str] = None
    occupation:  Optional[str] = None
    phone:       Optional[str] = None
    instagram:   Optional[str] = None
    looking_for: Optional[str] = None

    @field_validator("first_name", "bio", "occupation", "location", mode="before")
    @classmethod
    def sanitize_text(cls, v):
        from backend.sanitize import clean_text
        return clean_text(v) if v is not None else v

    @field_validator("looking_for")
    @classmethod
    def validate_looking_for(cls, v):
        if v is not None and v not in LOOKING_FOR_OPTIONS:
            raise ValueError(f"looking_for must be one of {LOOKING_FOR_OPTIONS}")
        return v


class ProfileOut(BaseModel):
    id:          int
    user_id:     int
    first_name:  str
    age:         int
    bio:         Optional[str]
    country:     Optional[str]
    city:        Optional[str]
    location:    Optional[str]
    occupation:  Optional[str]
    phone:       Optional[str]
    instagram:   Optional[str]
    looking_for: Optional[str]
    is_complete: int

    model_config = {"from_attributes": True}


# ── Man Profile ───────────────────────────────────────────────────────────────

class ManProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    age:        Optional[int] = None
    bio:        Optional[str] = None
    country:    Optional[str] = None
    city:       Optional[str] = None
    occupation: Optional[str] = None

    @field_validator("first_name", "bio", "occupation", mode="before")
    @classmethod
    def sanitize_text(cls, v):
        from backend.sanitize import clean_text
        return clean_text(v) if v is not None else v


class ManProfileOut(BaseModel):
    user_id:    int
    first_name: str
    age:        int
    bio:        Optional[str]
    country:    Optional[str]
    city:       Optional[str]
    occupation: Optional[str]
    photos:     List["PhotoOut"] = []

    model_config = {"from_attributes": True}


# ── Photos ────────────────────────────────────────────────────────────────────

class PhotoOut(BaseModel):
    id:         int
    user_id:    int
    file_path:  str
    photo_url:  str
    is_primary: int
    sort_order: int

    model_config = {"from_attributes": True}


ManProfileOut.model_rebuild()


# ── Subscription ──────────────────────────────────────────────────────────────

class CheckoutRequest(BaseModel):
    plan: str
    card_number: str
    card_expiry: str
    card_cvv: str

    @field_validator("plan")
    @classmethod
    def validate_plan(cls, v):
        if v not in ("monthly", "yearly"):
            raise ValueError("plan must be 'monthly' or 'yearly'")
        return v


class SubscriptionOut(BaseModel):
    id:               int
    user_id:          int
    plan:             str
    status:           str
    started_at:       datetime
    expires_at:       datetime
    mock_payment_ref: Optional[str]

    model_config = {"from_attributes": True}


# ── Match Requests ────────────────────────────────────────────────────────────

class MatchRequestCreate(BaseModel):
    message:      Optional[str] = None
    gift_type:    Optional[str] = None
    gift_message: Optional[str] = None

    @field_validator("message", "gift_message", mode="before")
    @classmethod
    def sanitize_text(cls, v):
        from backend.sanitize import clean_text
        return clean_text(v) if v is not None else v


class MatchRequestOut(BaseModel):
    id:           int
    man_id:       int
    woman_id:     int
    status:       str
    message:      Optional[str]
    gift_type:    Optional[str]
    gift_message: Optional[str]
    gift_value:   Optional[float]
    created_at:   datetime
    updated_at:   datetime

    model_config = {"from_attributes": True}


# ── Browse cards ──────────────────────────────────────────────────────────────

class WomanCardOut(BaseModel):
    user_id:           int
    first_name:        str
    age:               Optional[int] = None
    country:           Optional[str] = None
    city:              Optional[str] = None
    looking_for:       Optional[str] = None
    primary_photo_url: Optional[str]
    request_status:    Optional[str] = None


# ── Full profile (unlocked after match) ──────────────────────────────────────

class FullProfileOut(BaseModel):
    user_id:     int
    first_name:  str
    age:         int
    bio:         Optional[str]
    country:     Optional[str]
    city:        Optional[str]
    location:    Optional[str]
    occupation:  Optional[str]
    phone:       Optional[str]
    instagram:   Optional[str]
    looking_for: Optional[str]
    photos:      List[PhotoOut]


# ── Pending request as seen by woman ─────────────────────────────────────────

class ManSenderInfo(BaseModel):
    man_id:     int
    first_name: str
    age:        Optional[int]
    country:    Optional[str]
    city:       Optional[str]
    photo_url:  Optional[str]


class PendingRequestOut(BaseModel):
    request_id:        int
    man_id:            int
    man_info:          Optional[ManSenderInfo] = None
    message:           Optional[str]
    gift_type:         Optional[str]
    gift_message:      Optional[str]
    gift_value:        Optional[str]
    reply_gift_type:   Optional[str] = None
    reply_gift_message:Optional[str] = None
    created_at:        datetime
    status:            str


# ── Gift reply ────────────────────────────────────────────────────────────────

class GiftReplyRequest(BaseModel):
    gift_type:    str
    gift_message: Optional[str] = None

    @field_validator("gift_type")
    @classmethod
    def validate_gift_type(cls, v):
        from backend.constants import GIFT_CATALOG
        if v not in GIFT_CATALOG:
            raise ValueError("Invalid gift type")
        return v


# ── Man request out (enriched for man's view) ────────────────────────────────

class ManRequestOut(BaseModel):
    """Outgoing request as seen by man."""
    request_id:        int
    woman_id:          int
    woman_name:        str
    woman_photo:       Optional[str]
    status:            str
    message:           Optional[str]
    gift_type:         Optional[str]
    gift_emoji:        Optional[str]
    gift_label:        Optional[str]
    gift_message:      Optional[str]
    gift_value:        Optional[float]
    reply_gift_type:   Optional[str]
    reply_gift_emoji:  Optional[str]
    reply_gift_label:  Optional[str]
    reply_gift_message:Optional[str]
    extra_gifts_sent:  int
    created_at:        datetime


# ── Gift send request (man sending additional gift) ──────────────────────────

class GiftSendRequest(BaseModel):
    gift_type:    str
    gift_message: Optional[str] = None

    @field_validator("gift_type")
    @classmethod
    def validate_gift_type(cls, v):
        from backend.constants import GIFT_CATALOG
        if v not in GIFT_CATALOG:
            raise ValueError("Invalid gift type")
        return v


# ── Conversation gift entry ───────────────────────────────────────────────────

class ConversationGift(BaseModel):
    id:           int
    source:       str   # "request", "request_reply", or "transaction"
    sender_role:  str   # "man" or "woman"
    gift_type:    str
    gift_emoji:   str
    gift_label:   str
    gift_message: Optional[str]
    gift_value:   Optional[float]
    created_at:   datetime
