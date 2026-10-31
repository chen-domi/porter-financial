# Porter

Porter is a personal, iPhone-first finance app. Dominic is the only user and the only contributor.

## Key docs

- `docs/prd.html`: product spec (source of truth for scope and UI)
- `README.md`: setup and commands
- `docs/adr/`: architecture decisions

## Layout

- `apps/mobile`: Expo SDK 58, Expo Router, Clerk (`@clerk/expo`). Design tokens in `src/theme/tokens.ts`.
- `backend`: FastAPI modular monolith, SQLAlchemy 2, Alembic, Postgres. Runs on AWS Lambda.
- `infra`: Terraform (`shared`, `envs/staging`, `envs/prod`).

## Git rules (strict)

- Commit only as the configured git user. Never change the author or committer.
- Never add `Co-Authored-By`, "Generated with Claude Code", session links or any other AI attribution to commits, PRs or comments.
- Never push, open PRs or comment on GitHub unless explicitly asked.
- Always work on a feature branch, never directly on `main`.

## Checks before finishing a change

- backend (`backend/`): `uv run ruff format --check . && uv run ruff check . && uv run mypy app tests && uv run pytest`
- mobile (`apps/mobile/`): `npx prettier --check "src/**/*.{ts,tsx}" && npx eslint . && npx tsc --noEmit`
- infra (`infra/`): `terraform fmt -check -recursive`

## Conventions

- Money is stored as integer cents.
- Bank data goes through a `FinancialDataProvider` adapter.
- UI follows PRD section 05 ("Midnight & metal"): glass panels, serif display type, champagne accent only for value, no gradient buttons.
- Use `npx expo install` for Expo packages, and check the installed types: Expo APIs change every SDK.
- Ask before adding dependencies or anything that costs money on AWS.

## Workflow

For any non-trivial task, use the `clarify-first` skill before writing code.
