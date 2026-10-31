"""AWS Lambda entry point. The FastAPI app itself knows nothing about Lambda."""

from mangum import Mangum

from app.main import app

handler = Mangum(app, lifespan="off")
