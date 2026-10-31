"""Clerk session-token verification plus a single-user allowlist.

Verification happens in the app rather than an API Gateway authorizer so behaviour is
identical on Lambda, on the Fargate scale profile, and locally.
"""

import logging
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings

log = logging.getLogger(__name__)
bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    clerk_user_id: str


@lru_cache
def _jwks_client(jwks_url: str) -> jwt.PyJWKClient:
    return jwt.PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)


def verify_token(token: str, settings: Settings) -> Principal:
    if not settings.clerk_issuer:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Auth is not configured")
    try:
        signing_key = _jwks_client(settings.clerk_jwks_url).get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer.rstrip("/"),
            options={"require": ["exp", "iat", "sub", "iss"]},
            leeway=5,
        )
    except jwt.PyJWTError as exc:
        log.info("token rejected", extra={"fields": {"reason": type(exc).__name__}})
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc

    user_id = str(claims["sub"])
    if user_id not in settings.allowed_user_ids:
        log.warning("user not allowlisted", extra={"fields": {"clerk_user_id": user_id}})
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed")
    return Principal(clerk_user_id=user_id)


def current_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> Principal:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    return verify_token(credentials.credentials, settings)
