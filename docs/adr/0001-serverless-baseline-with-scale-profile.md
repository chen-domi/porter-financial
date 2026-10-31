# ADR 0001: Serverless baseline with an on-demand scale profile

- Status: accepted
- Date: 2026-10-31

## Context

Porter has exactly one user, but it is also meant to show production-grade engineering.
An always-on design (ECS Fargate + Application Load Balancer + RDS) costs about $96/month,
almost all of it for idle capacity. Putting Lambda inside a VPC to reach RDS would also need
a NAT Gateway (about $32/month) so the functions can reach Plaid, APNs and Claude.

## Decision

- The FastAPI app ships as **one container image**. On AWS it runs on **Lambda** (via Mangum)
  behind an **API Gateway HTTP API**. The same image runs under uvicorn anywhere else.
- **Neon** serverless Postgres is the database. Lambdas stay outside a VPC and connect over
  TLS, so there is no NAT Gateway.
- Secrets live in **SSM Parameter Store** and are loaded at cold start, never in Terraform
  state or plain environment variables.
- A Terraform `scale` profile (milestone M4) adds ECS Fargate + ALB for load tests, then is
  destroyed.

## Consequences

- Baseline AWS cost is a few dollars a month; the total including Plaid, Apple and Claude is
  about $26.
- Cold starts add roughly a second to the first request after idle. The Dynamic Island is
  computed on the device, so it does not depend on API latency.
- Neon is a dependency outside AWS. Mitigations: nightly `pg_dump` to S3, and Aurora
  Serverless v2 with the Data API as a documented migration path.
