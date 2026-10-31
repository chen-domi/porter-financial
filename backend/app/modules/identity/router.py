import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_session
from app.modules.identity.auth import Principal, current_principal
from app.modules.identity.service import get_or_create_user

router = APIRouter(prefix="/v1", tags=["identity"])


class MeResponse(BaseModel):
    id: uuid.UUID
    clerk_user_id: str
    timezone: str


@router.get("/me")
def me(
    principal: Annotated[Principal, Depends(current_principal)],
    session: Annotated[Session, Depends(get_session)],
) -> MeResponse:
    user = get_or_create_user(session, principal.clerk_user_id)
    return MeResponse(id=user.id, clerk_user_id=user.clerk_user_id, timezone=user.timezone)
