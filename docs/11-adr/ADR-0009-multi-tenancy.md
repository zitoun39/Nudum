---
title: "ADR-0009 — Schema-Per-Tenant Multi-Tenancy Strategy"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
note: Supersedes the previous Row-Level Multi-Tenancy decision per Principal Architect Review to ensure absolute data isolation and native database-level backups.
references:
  - docs/04-architecture/architecture-principles.md
  - docs/11-adr/ADR-0001-modular-monolith.md
  - docs/11-adr/ADR-0002-postgresql.md
  - docs/11-adr/ADR-0008-jwt-auth.md
  - docs/11-adr/ADR-0011-orm-and-migrations.md
  - docs/11-adr/ADR-0014-postgresql-schema-routing.md
---

# ADR-0009 — Schema-Per-Tenant Multi-Tenancy Strategy

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a multi-tenant enterprise platform serving water utilities, public laboratories, and government archiving agencies. Complete data isolation between tenants (organizations) is a critical compliance and security requirement.

Three multi-tenancy models exist:
1. **Database-per-tenant**: Maximum isolation, but high infrastructure cost and high operational complexity.
2. **Row-level isolation (shared table)**: Cost-efficient, but carries high risk of accidental data leakage if a developer omits a filter. It also makes single-tenant backups, restores, and client-specific schema customizations extremely complex.
3. **Schema-per-tenant (separate schema in a shared database instance)**: Separate PostgreSQL schemas (e.g., `tenant_ade_alger`, `tenant_ade_oran`) sharing a single database engine. It provides strong logical isolation, supports easy single-tenant backup/restore (`pg_dump -n schema`), and allows client-specific schema extensions where contractually required.

---

## Decision

> **We will use Schema-Per-Tenant multi-tenancy. Each organization operates in its own isolated PostgreSQL schema within a shared database instance. The application layer routes queries dynamically to the active tenant schema based on the request context.**

Implementation details:
- **Default schemas**: The system maintains a `public` schema for shared platform data (Organizations list, Billing plans, global audit templates) and a template schema (`tenant_template`) for provisioning new tenants.
- **Tenant routing**: Resolved dynamically at the transaction level using transaction-scoped search path routing (`SET LOCAL search_path`) to ensure compatibility with PgBouncer transaction pooling (see ADR-0014).
- **ORM abstraction**: The database connection manager (managed via TypeORM, see ADR-0011) resolves the active connection/schema context dynamically using `AsyncLocalStorage` for the active request.
- **Single-tenant backups**: Operations teams can back up or restore a single tenant schema without impacting other clients using native `pg_dump -n tenant_x` and `pg_restore` commands.

---

## Rationale

- **High Isolation & Compliance**: Essential for municipal utility and laboratory data under national regulations (Algeria/Middle East).
- **Simplified Operations**: Restoring a single corrupted tenant to a previous state is a native DB backup restore operation, rather than an application-level script filtering row-by-row.
- **Client Customizations**: Large municipal customers (such as ADE) can have specific custom fields or custom DB tables added to their isolated schema without altering the shared schema of other SaaS clients.
- **Developer Safety**: Eliminates the risk of developers writing queries that accidentally leak another organization's data since the connection's `search_path` physically hides other tenant data.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Row-level isolation | Rejected due to high data leak risk, complex single-tenant backup/restore, and inability to support custom tenant-specific fields or database views without complicating the global schema. |
| Database-per-tenant | Rejected for initial phase due to high operational cost (managing 100+ database instances and memory footprints on modest on-premise hardware). |

---

## Consequences

### Positive
- Strict security isolation between tenants.
- Native PostgreSQL schema backups and restores per tenant.
- Support for client-specific database customization.
- Immune to application-level query bugs leaking cross-tenant data.

### Negative / Trade-offs
- Connection pool sizing must be monitored closely since schema switching requires active connection management.
- Running schema migrations requires iterating over all tenant schemas sequentially, increasing deployment time.
- Cross-tenant global queries (e.g., system-wide metrics) require union queries or a dedicated global reporting schema.

---

## Tenant Isolation Rules

1. No business module may create a table inside the `public` schema; all business tables belong to tenant schemas.
2. Tenant schema connection routing must be resolved at the database adapter level, transparently to the business logic code.
3. Every dynamic tenant connection must be validated against the caller's JWT organization context before execution.

---

## Compliance

- Architecture Principle 9: *Multi-Tenant by Design*
- Product Principle 7: *Multi-Tenant by Default*
- Engineering Principle 13: *Multi-Tenant Safety*

---

## Review Trigger

Reconsider if a tenant's size or specific security contracts require a dedicated database server (the database adapter can route their requests to an external database instance using the same schema structure).
