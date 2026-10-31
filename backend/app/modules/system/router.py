from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.db import get_session

router = APIRouter(tags=["system"])


class Health(BaseModel):
    status: Literal["ok", "degraded"]
    environment: str
    database: Literal["ok", "unreachable"]


@router.get("/health")
def health(
    response: Response,
    settings: Annotated[Settings, Depends(get_settings)],
    session: Annotated[Session, Depends(get_session)],
) -> Health:
    try:
        session.execute(text("select 1"))
        database: Literal["ok", "unreachable"] = "ok"
    except Exception:
        session.rollback()
        database = "unreachable"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return Health(
        status="ok" if database == "ok" else "degraded",
        environment=settings.environment,
        database=database,
    )
