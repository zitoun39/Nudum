---
title: "ADR-0011 — ORM and Database Migrations Strategy"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/system-architecture.md
  - docs/11-adr/ADR-0002-postgresql.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0014-postgresql-schema-routing.md
---

# ADR-0011 — ORM and Database Migrations Strategy

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a modular monolith backend written in TypeScript with NestJS and PostgreSQL. Multi-tenancy uses a schema-per-tenant isolation strategy (ADR-0009).

We require an Object-Relational Mapper (ORM) and schema migration strategy that:
- Seamlessly supports TypeScript class decorators representing DDD domain entities.
- Supports dynamic connection routing to swap the active PostgreSQL schema per request.
- Manages migrations that can be run loop-style across N tenant schemas during updates.
- Integrates cleanly with NestJS Dependency Injection.

---

## Decision

> **We will use TypeORM as the primary ORM. Dynamic tenant schema routing is managed via a connection manager using AsyncLocalStorage. Database migrations are version-controlled in the codebase and executed across all schemas programmatically during startup.**

Implementation:
- **Entities**: Defined as TypeScript classes with TypeORM decorators. They map to database tables in the active schema.
- **Dynamic Schema Context**: A NestJS middleware intercepts requests, extracts the validated `organization_id`, and sets the active schema name in `AsyncLocalStorage`.
- **Dynamic Connection**: A custom NestJS dynamic database module resolves a query runner executing `SET LOCAL search_path TO tenant_[orgId], public` inside transaction boundaries to prevent connection state leaks (see ADR-0014).
- **Migrations**: Migrations are written as TypeScript classes. When running migrations:
  1. The platform migrations are executed once in the `public` schema.
  2. The tenant-scoped migrations are executed sequentially across all active schemas in the database by setting the target schema context dynamically before running the migration set.

---

## Rationale

- **DDD Class Alignment**: TypeORM supports class-based entities, making it a natural fit for Nudum's Canonical Domain Model (`domain-model.md`).
- **Dynamic Schema Switching**: TypeORM's query runner allows executing raw `SET search_path` commands on the connection easily, or instantiating metadata-based connections dynamically.
- **Mature Migration Framework**: TypeORM has a robust migration CLI and programmatic API, allowing us to write script loops that migrate all schemas safely.
- **PgBouncer Compatibility**: By setting the search path explicitly on queries or executing connection initialization blocks, we maintain compatibility with transaction-level connection pooling.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Prisma | Excellent DX, but does not support dynamic schema switching natively without instantiating separate client engines per tenant (major memory leak risk) and does not support class-based DDD domain entities. |
| MikroORM | Strong Unit-of-Work pattern, but has a smaller community and more complex dynamic schema configuration for NestJS compared to TypeORM. |
| Raw SQL (pg driver) | Requires writing excessive boilerplate CRUD code, reducing developer velocity. |

---

## Consequences

### Positive
- Unified DDD class model for both application code and database.
- Scalable, dynamic schema routing with connection safety.
- Reliable schema migrations across all tenants.

### Negative / Trade-offs
- TypeORM active record/data mapper can lead to lazy-loading performance gotchas if developers are not careful.
- Running migrations across 100+ schemas sequentially increases deployment downtime (mitigated by parallelizing schema migration scripts).

---

## Compliance

- ADR-0002: *PostgreSQL as Primary Database*
- ADR-0009: *Schema-Per-Tenant Multi-Tenancy Strategy*

---

## Review Trigger

Reconsider if schema-per-tenant migration execution times exceed acceptable deployment thresholds (would trigger introducing parallel migration runner workers or schema sharding).
