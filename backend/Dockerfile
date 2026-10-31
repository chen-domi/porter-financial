# One image, several runtimes. Build with --platform linux/arm64.
#   lambda  -> AWS Lambda (API: app.lambda_handler.handler, migrations: app.migrate_handler.handler)
#   server  -> plain uvicorn, used by the ECS Fargate scale profile and local runs

FROM ghcr.io/astral-sh/uv:0.11.7 AS uv

FROM public.ecr.aws/lambda/python:3.13 AS lambda
COPY --from=uv /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv export --frozen --no-dev --no-emit-project -o /tmp/requirements.txt \
    && uv pip install --no-cache --target "${LAMBDA_TASK_ROOT}" -r /tmp/requirements.txt
COPY alembic.ini ${LAMBDA_TASK_ROOT}/
COPY alembic ${LAMBDA_TASK_ROOT}/alembic
COPY app ${LAMBDA_TASK_ROOT}/app
CMD ["app.lambda_handler.handler"]

FROM python:3.13-slim AS server
COPY --from=uv /uv /bin/uv
WORKDIR /srv
COPY pyproject.toml uv.lock ./
RUN uv export --frozen --no-dev --no-emit-project -o /tmp/requirements.txt \
    && uv pip install --no-cache --system -r /tmp/requirements.txt
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
RUN useradd --create-home porter
USER porter
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
