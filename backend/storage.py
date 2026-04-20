import os
import uuid
from io import BytesIO
from pathlib import Path

from PIL import Image

STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))

R2_ACCOUNT_ID        = os.getenv("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID     = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME       = os.getenv("R2_BUCKET_NAME", "matchup-photos")
R2_PUBLIC_URL        = os.getenv("R2_PUBLIC_URL", "")


def _r2():
    import boto3
    return boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
    )


def _process(content: bytes) -> bytes:
    img = Image.open(BytesIO(content)).convert("RGB")
    img.thumbnail((1200, 1200))
    buf = BytesIO()
    img.save(buf, "JPEG", quality=85)
    return buf.getvalue()


def upload_photo(content: bytes, user_id: int) -> tuple[str, str]:
    """Returns (file_key, public_url). Raises on invalid image."""
    jpeg = _process(content)
    key = f"{user_id}/{uuid.uuid4().hex}.jpg"

    if STORAGE_BACKEND == "r2":
        _r2().put_object(Bucket=R2_BUCKET_NAME, Key=key, Body=jpeg, ContentType="image/jpeg")
        url = f"{R2_PUBLIC_URL.rstrip('/')}/{key}"
    else:
        dest = UPLOAD_DIR / key
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(jpeg)
        url = f"/uploads/{key}"

    return key, url


def delete_photo(key: str) -> None:
    if STORAGE_BACKEND == "r2":
        _r2().delete_object(Bucket=R2_BUCKET_NAME, Key=key)
    else:
        p = UPLOAD_DIR / key
        if p.exists():
            p.unlink()


def photo_url(key: str) -> str:
    if STORAGE_BACKEND == "r2":
        return f"{R2_PUBLIC_URL.rstrip('/')}/{key}"
    return f"/uploads/{key}"
