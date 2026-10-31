from collections.abc import Callable

import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_me_requires_a_token(client: TestClient) -> None:
    assert client.get("/v1/me").status_code == 401


def test_me_creates_user_on_first_call_and_is_idempotent(
    client: TestClient, make_token: Callable[..., str]
) -> None:
    first = client.get("/v1/me", headers=bearer(make_token()))
    second = client.get("/v1/me", headers=bearer(make_token()))

    assert first.status_code == 200
    assert first.json()["clerk_user_id"] == "user_allowed123"
    assert first.json()["timezone"] == "America/New_York"
    assert second.json()["id"] == first.json()["id"]


@pytest.mark.parametrize(
    "token_kwargs",
    [
        pytest.param({"expires_in": -120}, id="expired"),
        pytest.param({"issuer": "https://evil.example.com"}, id="wrong-issuer"),
    ],
)
def test_me_rejects_invalid_tokens(
    client: TestClient, make_token: Callable[..., str], token_kwargs: dict[str, object]
) -> None:
    assert client.get("/v1/me", headers=bearer(make_token(**token_kwargs))).status_code == 401


def test_me_rejects_token_signed_with_another_key(
    client: TestClient, make_token: Callable[..., str]
) -> None:
    other_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

    response = client.get("/v1/me", headers=bearer(make_token(key=other_key)))

    assert response.status_code == 401


def test_me_rejects_users_outside_the_allowlist(
    client: TestClient, make_token: Callable[..., str]
) -> None:
    response = client.get("/v1/me", headers=bearer(make_token(sub="user_stranger")))

    assert response.status_code == 403


def test_me_is_unavailable_when_auth_is_not_configured(
    client: TestClient, make_token: Callable[..., str]
) -> None:
    client.app.dependency_overrides[get_settings] = lambda: Settings(clerk_issuer="")  # type: ignore[attr-defined]

    response = client.get("/v1/me", headers=bearer(make_token()))

    assert response.status_code == 503


def test_allowed_user_ids_parse_from_comma_separated_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PORTER_ALLOWED_USER_IDS", " user_a, user_b ,,")

    assert Settings().allowed_user_ids == ["user_a", "user_b"]
