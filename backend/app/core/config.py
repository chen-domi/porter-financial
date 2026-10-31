"""Application settings, loaded from environment variables prefixed with PORTER_.

On Lambda, secrets live in SSM Parameter Store. When PORTER_SSM_PARAMETER_PATH is set,
every parameter under that path is loaded into the environment before settings are read,
so secrets never pass through Terraform state or plain Lambda environment variables.
"""

import os
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="PORTER_", env_file=".env", extra="ignore")

    environment: Literal["local", "test", "staging", "prod"] = "local"
    database_url: str = "postgresql+psycopg://porter:porter@localhost:5432/porter"
    db_pool_size: int = 2

    # Clerk: the Frontend API URL (JWT issuer), e.g. https://clerk.example.com
    clerk_issuer: str = ""
    # Only these Clerk user IDs may use the API. Empty means nobody can.
    allowed_user_ids: Annotated[list[str], NoDecode] = Field(default_factory=list)

    log_level: str = "INFO"

    @property
    def clerk_jwks_url(self) -> str:
        return f"{self.clerk_issuer.rstrip('/')}/.well-known/jwks.json"

    @field_validator("allowed_user_ids", mode="before")
    @classmethod
    def _split_ids(cls, value: object) -> object:
        if isinstance(value, str):
            return [part.strip() for part in value.split(",") if part.strip()]
        return value


def load_ssm_parameters(path: str) -> None:
    """Copy SSM parameters under `path` into os.environ (existing variables win)."""
    import boto3

    client = boto3.client("ssm")
    paginator = client.get_paginator("get_parameters_by_path")
    prefix = path.rstrip("/") + "/"
    for page in paginator.paginate(Path=prefix, Recursive=True, WithDecryption=True):
        for param in page["Parameters"]:
            name = param["Name"].removeprefix(prefix).replace("/", "_").upper()
            os.environ.setdefault(f"PORTER_{name}", param["Value"])


@lru_cache
def get_settings() -> Settings:
    ssm_path = os.environ.get("PORTER_SSM_PARAMETER_PATH")
    if ssm_path:
        load_ssm_parameters(ssm_path)
    return Settings()
