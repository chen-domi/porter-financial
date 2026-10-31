import os
import time
from collections.abc import Callable, Iterator
from typing import Any

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa

TEST_ISSUER = "https://clerk.porter.test"
TEST_USER = "user_allowed123"

os.environ["PORTER_ENVIRONMENT"] = "test"
os.environ["PORTER_DATABASE_URL"] = os.environ.get(
    "PORTER_TEST_DATABASE_URL", "postgresql+psycopg://porter:porter@localhost:5432/porter_test"
)
os.environ["PORTER_CLERK_ISSUER"] = TEST_ISSUER
os.environ["PORTER_ALLOWED_USER_IDS"] = TEST_USER

from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.core.db import get_engine  # noqa: E402
from app.main import create_app  # noqa: E402
from app.modules.identity import auth  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def _migrate() -> None:
    command.upgrade(Config("alembic.ini"), "head")


@pytest.fixture(autouse=True)
def _clean_tables() -> Iterator[None]:
    yield
    with get_engine().begin() as conn:
        conn.execute(text("truncate users restart identity cascade"))


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


@pytest.fixture(scope="session")
def signing_key() -> rsa.RSAPrivateKey:
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)


@pytest.fixture(autouse=True)
def _fake_jwks(monkeypatch: pytest.MonkeyPatch, signing_key: rsa.RSAPrivateKey) -> None:
    """Serve the test public key instead of fetching Clerk's JWKS over the network."""

    class FakeJwkClient:
        def get_signing_key_from_jwt(self, token: str) -> Any:
            return type("Key", (), {"key": signing_key.public_key()})()

    monkeypatch.setattr(auth, "_jwks_client", lambda url: FakeJwkClient())


@pytest.fixture
def make_token(signing_key: rsa.RSAPrivateKey) -> Callable[..., str]:
    def _make(
        sub: str = TEST_USER,
        issuer: str = TEST_ISSUER,
        expires_in: int = 60,
        key: rsa.RSAPrivateKey | None = None,
    ) -> str:
        now = int(time.time())
        claims = {"sub": sub, "iss": issuer, "iat": now, "nbf": now, "exp": now + expires_in}
        return jwt.encode(claims, key or signing_key, algorithm="RS256", headers={"kid": "test"})

    return _make
