from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, SmallInteger, ForeignKey, UniqueConstraint, Numeric, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id                 = Column(Integer, primary_key=True, index=True)
    email              = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password    = Column(String(255), nullable=False)
    role               = Column(Enum("woman", "man"), nullable=False)
    is_active          = Column(SmallInteger, default=1)
    is_verified        = Column(SmallInteger, default=1, server_default='1')
    verification_token = Column(String(64), nullable=True)
    created_at         = Column(DateTime, default=datetime.utcnow)
    updated_at         = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile           = relationship("WomanProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    man_profile       = relationship("ManProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    photos            = relationship("Photo", back_populates="user", cascade="all, delete-orphan")
    subscription      = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sent_requests     = relationship("MatchRequest", foreign_keys="MatchRequest.man_id", back_populates="man", cascade="all, delete-orphan")
    received_requests = relationship("MatchRequest", foreign_keys="MatchRequest.woman_id", back_populates="woman", cascade="all, delete-orphan")


class WomanProfile(Base):
    __tablename__ = "woman_profiles"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name  = Column(String(100), default="")
    age         = Column(SmallInteger, default=18)
    bio         = Column(Text, nullable=True)
    country     = Column(String(100), nullable=True)
    city        = Column(String(100), nullable=True)
    location    = Column(String(255), nullable=True)
    occupation  = Column(String(255), nullable=True)
    phone       = Column(String(30), nullable=True)
    instagram   = Column(String(100), nullable=True)
    looking_for = Column(Enum("relationship", "casual", "commitment", "outing", "surprise"), nullable=True)
    is_complete = Column(SmallInteger, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class ManProfile(Base):
    __tablename__ = "man_profiles"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(100), default="")
    age        = Column(SmallInteger, default=18)
    bio        = Column(Text, nullable=True)
    country    = Column(String(100), nullable=True)
    city       = Column(String(100), nullable=True)
    occupation = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="man_profile")


class Photo(Base):
    __tablename__ = "photos"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path  = Column(String(500), nullable=False)
    is_primary = Column(SmallInteger, default=0)
    sort_order = Column(SmallInteger, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="photos")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    plan             = Column(Enum("monthly", "yearly"), default="monthly")
    status           = Column(Enum("active", "cancelled", "expired"), default="active")
    mock_payment_ref = Column(String(100), nullable=True)
    started_at       = Column(DateTime, default=datetime.utcnow)
    expires_at       = Column(DateTime, nullable=False)
    created_at       = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="subscription")


class MatchRequest(Base):
    __tablename__ = "match_requests"

    id            = Column(Integer, primary_key=True, index=True)
    man_id        = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    woman_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status        = Column(Enum("pending", "accepted", "rejected"), default="pending")
    message       = Column(String(500), nullable=True)
    gift_type     = Column(String(50), nullable=True)
    gift_message  = Column(String(200), nullable=True)
    gift_value    = Column(Numeric(10, 2), nullable=True)
    reply_gift_type    = Column(String(50), nullable=True)
    reply_gift_message = Column(String(200), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    man   = relationship("User", foreign_keys=[man_id], back_populates="sent_requests")
    woman = relationship("User", foreign_keys=[woman_id], back_populates="received_requests")

    __table_args__ = (UniqueConstraint("man_id", "woman_id", name="uq_mr_pair"),)


class GiftTransaction(Base):
    __tablename__ = "gift_transactions"

    id          = Column(Integer, primary_key=True, index=True)
    sender_id   = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(Enum("man", "woman"), nullable=False)
    gift_type   = Column(String(50), nullable=False)
    gift_message= Column(String(200), nullable=True)
    gift_value  = Column(Numeric(10, 2), nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


class WithdrawalRequest(Base):
    __tablename__ = "withdrawal_requests"

    id           = Column(Integer, primary_key=True, index=True)
    woman_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount       = Column(Numeric(10, 2), nullable=False)
    method       = Column(Enum("yape", "plin", "transfer"), nullable=False)
    account_info = Column(String(500), nullable=False)
    status       = Column(Enum("pending", "approved", "rejected"), default="pending")
    admin_notes  = Column(String(500), nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    woman = relationship("User")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id         = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String(45), nullable=True)
    details    = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
