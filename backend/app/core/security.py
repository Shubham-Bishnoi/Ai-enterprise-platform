from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from dataclasses import dataclass

from app.core.config import get_settings


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("utf-8").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    padded = value + "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(padded.encode("utf-8"))


def _sign(message: str, secret: str) -> str:
    signature = hmac.new(secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    return _b64url_encode(signature)


def create_access_token(payload: dict, *, expires_in_seconds: int = 60 * 60 * 8) -> tuple[str, int]:
    settings = get_settings()
    secret = os.getenv("GFF_PORTAL_JWT_SECRET", None) or getattr(settings, "secret_key", "dev-secret-change-me")
    header = {"alg": "HS256", "typ": "JWT"}
    exp = int(time.time()) + int(expires_in_seconds)
    body = dict(payload)
    body["exp"] = exp
    message = f"{_b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))}.{_b64url_encode(json.dumps(body, separators=(',', ':')).encode('utf-8'))}"
    signature = _sign(message, secret)
    return f"{message}.{signature}", expires_in_seconds


@dataclass
class VerifiedToken:
    payload: dict


def verify_access_token(token: str) -> VerifiedToken | None:
    settings = get_settings()
    secret = os.getenv("GFF_PORTAL_JWT_SECRET", None) or getattr(settings, "secret_key", "dev-secret-change-me")
    parts = token.split(".")
    if len(parts) != 3:
        return None
    message = ".".join(parts[0:2])
    signature = parts[2]
    expected = _sign(message, secret)
    if not hmac.compare_digest(signature, expected):
        return None
    try:
        payload = json.loads(_b64url_decode(parts[1]).decode("utf-8"))
    except Exception:
        return None
    exp = int(payload.get("exp") or 0)
    if exp and exp < int(time.time()):
        return None
    return VerifiedToken(payload=payload)


def hash_password(password: str, *, salt: str | None = None) -> tuple[str, str]:
    salt_value = salt or _b64url_encode(os.urandom(16))
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt_value.encode("utf-8"), 120_000)
    return salt_value, _b64url_encode(derived)


def verify_password(password: str, salt: str, password_hash: str) -> bool:
    _, computed = hash_password(password, salt=salt)
    return hmac.compare_digest(computed, password_hash)
