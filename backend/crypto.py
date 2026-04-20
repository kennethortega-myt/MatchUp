import os
import hashlib
import base64


def _fernet():
    raw = os.getenv("ENCRYPTION_KEY", "")
    if not raw:
        return None
    try:
        from cryptography.fernet import Fernet
        key = base64.urlsafe_b64encode(hashlib.sha256(raw.encode()).digest())
        return Fernet(key)
    except ImportError:
        return None


def encrypt(value: str | None) -> str | None:
    if not value:
        return value
    f = _fernet()
    if not f:
        return value
    return f.encrypt(value.encode()).decode()


def decrypt(value: str | None) -> str | None:
    if not value:
        return value
    f = _fernet()
    if not f:
        return value
    try:
        return f.decrypt(value.encode()).decode()
    except Exception:
        return value  # already plaintext (backwards-compatible)
