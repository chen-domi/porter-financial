# Porter

A private, iPhone-first personal finance app: net worth, credit cards, points, expiring card
benefits, and real-time budgets. Product requirements: [`docs/prd.html`](docs/prd.html).

## Repository

| Path | What |
|---|---|
| `apps/mobile` | Expo (React Native) iOS app. Expo Router, Clerk auth, Face ID lock. |
| `backend` | FastAPI modular monolith. SQLAlchemy 2, Alembic, PostgreSQL. Runs on AWS Lambda. |
| `infra` | Terraform: `shared` (state, ECR, CI role, budget) and `envs/{staging,prod}`. |
| `docs` | PRD and architecture decision records. |

## Local development

Prerequisites: Docker, [uv](https://docs.astral.sh/uv/), Node 22, Xcode (for the iOS build).

```bash
# 1. Database
docker compose up -d

# 2. API  (http://localhost:8000/docs)
cd backend
cp .env.example .env          # fill in the Clerk values
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 0.0.0.0

# 3. App (needs a development build: Face ID, blur and Clerk use native code)
cd apps/mobile
cp .env.example .env          # API URL = your Mac's LAN IP, plus the Clerk publishable key
npm install
npx expo run:ios --device
```

### Clerk setup (one time)

1. Create a Clerk application with **Email** sign-in using **email verification code**.
2. Under *Restrictions*, enable **Restricted mode** so nobody else can sign up, then create
   your own user in the dashboard.
3. Put the publishable key in `apps/mobile/.env`, and the Frontend API URL plus your user ID
   in `backend/.env`.

## Tests and checks

```bash
cd backend && uv run ruff check . && uv run mypy app tests && uv run pytest
cd apps/mobile && npx eslint . && npx tsc --noEmit
```

CI runs all of these plus `terraform validate` on every pull request.

## Deploying to AWS

1. `cd infra/shared && terraform init && terraform apply -var github_repository=<owner>/<repo> -var budget_email=<you>`
2. In GitHub, add the repository variables listed at the top of `.github/workflows/deploy.yml`.
3. Create a free Neon project (one branch per environment), then store each connection string:
   `aws ssm put-parameter --name /porter/staging/database_url --type SecureString --overwrite --value 'postgresql+psycopg://…'`
4. Push to `main`. CI builds the image, deploys staging, runs migrations, smoke-tests, then
   waits for approval on the `prod` environment before promoting the same image.

See [ADR 0001](docs/adr/0001-serverless-baseline-with-scale-profile.md) for why the stack is
serverless.
