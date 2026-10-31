from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.modules.identity.models import User


def get_or_create_user(session: Session, clerk_user_id: str) -> User:
    """Return the user for a Clerk ID, creating the row on first sign-in."""
    session.execute(
        insert(User)
        .values(clerk_user_id=clerk_user_id)
        .on_conflict_do_nothing(index_elements=[User.clerk_user_id])
    )
    return session.scalars(select(User).where(User.clerk_user_id == clerk_user_id)).one()
