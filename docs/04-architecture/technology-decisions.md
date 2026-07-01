---
title: Technology Stack and Strategic Decisions
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
references:
  - docs/04-architecture/system-architecture.md
  - docs/11-adr/
---

# Technology Decisions Index

This document serves as the canonical index of strategic technology decisions for the Nudum platform.

Strategic decisions are formal and tracked individually as **Architectural Decision Records (ADRs)** inside [`../11-adr/`](../11-adr/). 

---

## Architectural Decision Records (ADRs)

| ADR ID | Decision Title | Status | Decided Date |
|---|---|---|---|
| [ADR-0001](../11-adr/ADR-0001-modular-monolith.md) | Modular Monolith as Initial Application Architecture | Accepted | 2026-07-01 |
| [ADR-0002](../11-adr/ADR-0002-postgresql.md) | PostgreSQL as Primary Database | Accepted | 2026-07-01 |
| [ADR-0003](../11-adr/ADR-0003-frontend-framework.md) | React + Vite as Frontend Framework | Accepted | 2026-07-01 |
| [ADR-0004](../11-adr/ADR-0004-nestjs.md) | NestJS as Backend Framework | Accepted | 2026-07-01 |
| [ADR-0005](../11-adr/ADR-0005-typescript.md) | TypeScript as the Primary Programming Language | Accepted | 2026-07-01 |
| [ADR-0006](../11-adr/ADR-0006-redis.md) | Redis for Cache, Session, and Background Queue | Accepted | 2026-07-01 |
| [ADR-0007](../11-adr/ADR-0007-minio.md) | MinIO as Object Storage | Accepted | 2026-07-01 |
| [ADR-0008](../11-adr/ADR-0008-jwt-auth.md) | JWT + Refresh Tokens via HttpOnly Cookies | Accepted | 2026-07-01 |
| [ADR-0009](../11-adr/ADR-0009-multi-tenancy.md) | Schema-Per-Tenant Multi-Tenancy Strategy | Accepted | 2026-07-01 |
| [ADR-0010](../11-adr/ADR-0010-ai-gateway.md) | AI Gateway Pattern | Accepted | 2026-07-01 |
| [ADR-0011](../11-adr/ADR-0011-orm-and-migrations.md) | ORM and Database Migrations Strategy | Accepted | 2026-07-01 |
| [ADR-0012](../11-adr/ADR-0012-platform-bootstrap.md) | Platform Administration and Tenant Bootstrapping Strategy | Accepted | 2026-07-01 |
| [ADR-0013](../11-adr/ADR-0013-nudum-copilot.md) | Nudum Copilot Architecture & Security Decisions | Accepted | 2026-07-01 |
| [ADR-0014](../11-adr/ADR-0014-postgresql-schema-routing.md) | PostgreSQL Schema Routing Strategy | Accepted | 2026-07-01 |

---

## Decision-Making Principles

When evaluating future technology changes, the Nudum platform adheres to these strategic criteria:
- **Long-term sustainability**: Select mature, widely adopted, and open-source frameworks.
- **Provider independence**: Abstract external providers (AI, storage, notifications) behind stable interfaces.
- **Developer productivity**: Standardize code structure and tooling (e.g. strict TypeScript, automated linting).
- **On-premise compatibility**: Guarantee all dependencies run locally in Docker containers (no hard cloud-only lock-ins).

For the template and guidelines on proposing a new ADR, see [`../11-adr/adr-template.md`](../11-adr/adr-template.md).
