"""Lambda entry point that runs Alembic migrations.

Deploys invoke this function (same image as the API) so database credentials stay in
SSM and never need to reach CI.
"""

import logging
from pathlib import Path
from typing import Any

from alembic import command
from alembic.config import Config

from app.core.config import get_settings

log = logging.getLogger(__name__)
ALEMBIC_INI = Path(__file__).resolve().parent.parent / "alembic.ini"


def handler(event: dict[str, Any], context: object) -> dict[str, str]:
    get_settings()  # loads SSM parameters into the environment before env.py reads them
    config = Config(str(ALEMBIC_INI))
    config.set_main_option("script_location", str(ALEMBIC_INI.parent / "alembic"))
    command.upgrade(config, event.get("revision", "head"))
    log.info("migrations applied")
    return {"status": "ok"}
