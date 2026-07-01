---
title: "ADR-0009 — Row-Level Multi-Tenancy Strategy"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/architecture-principles.md
  - docs/11-adr/ADR-0001-modular-monolith.md
  - docs/11-adr/ADR-0002-postgresql.md
  - docs/11-adr/ADR-0008-jwt-auth.md
---

# ADR-0009 — Row-Level Multi-Tenancy Strategy

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a multi-tenant SaaS platform where multiple organizations (tenants) share the same application instance and database. Complete data isolation between tenants is a non-negotiable architectural requirement.

Three multi-tenancy strategies exist:

1. **Separate database per tenant** — maximum isolation, maximum operational cost.
2. **Separate schema per tenant** — good isolation, significant migration complexity.
3. **Shared database, row-level isolation** — efficient, scalable, isolation enforced by application + optional RLS.

---

## Decision

> **We will use a shared database with row-level tenant isolation. Every tenant-scoped entity carries an `organization_id` foreign key. All queries are automatically scoped to the authenticated tenant.**

Implementation:

- Every tenant-scoped entity has `organization_id UUID NOT NULL` as a non-nullable foreign key to the `organizations` table.
- A NestJS global interceptor extracts `organizationId` from the JWT (`ADR-0008`) and stores it in a per-request `AsyncLocalStorage` context.
- All repository methods automatically inject `WHERE organization_id = :tenantId` — this is enforced by a base repository class, not by individual developers remembering to add the clause.
- PostgreSQL Row-Level Security (RLS) is enabled as a defence-in-depth measure on all tenant-scoped tables.
- A test suite validates that no query against tenant-scoped entities can succeed without a resolved `organization_id`.

---

## Rationale

- **Operational simplicity**: One database, one schema migration set, one backup strategy. Not managing 100+ database instances.
- **Cost efficiency**: PostgreSQL handles thousands of tenants in one instance with proper indexing on `organization_id`.
- **Performance**: Composite indexes `(organization_id, entity_id)` and `(organization_id, created_at)` ensure queries remain fast per tenant.
- **Scalability**: Can migrate to schema-per-tenant or database-per-tenant for specific high-value enterprise customers without rewriting business logic.
- **Defence in depth**: PostgreSQL RLS acts as a second enforcement layer even if application code has a bug.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Database per tenant | 100 tenants = 100 databases. Migration management, backup, and monitoring complexity is prohibitive at this stage. |
| Schema per tenant | PostgreSQL search_path management is error-prone. Migration tools (TypeORM, Prisma) have poor schema-per-tenant support. |
| No isolation (shared data) | Completely unacceptable. A data breach between tenants would be catastrophic. |

---

## Consequences

### Positive
- All tenants share infrastructure cost.
- One migration run updates all tenants.
- Application logic is clean — `organizationId` flows transparently through the request context.
- RLS provides a database-level safety net.

### Negative / Trade-offs
- A developer bug that omits `organization_id` filtering could expose cross-tenant data. Mitigated by: base repository enforcement, RLS, and automated tests.
- Very large tenants cannot be moved to a dedicated database without a migration strategy.
- Backup and restore for a single tenant requires filtering — not a simple database restore.

---

## Tenant Isolation Rules (Mandatory)

1. Every entity table that belongs to a tenant **must** have `organization_id UUID NOT NULL`.
2. No repository method may query a tenant-scoped table without `organizationId` in the WHERE clause.
3. The `organizationId` always comes from the JWT — never from user-supplied request parameters.
4. Cross-tenant reads are only permitted for explicitly shared data (e.g., reference tables like `water_quality_standards`).
5. Any deviation from these rules requires a documented ADR or security exception.

---

## Compliance

- Architecture Principle 9: *Multi-Tenant by Design*
- Engineering Principle 13: *Multi-Tenant Safety*
- Product Principle 7: *Multi-Tenant by Default*

---

## Review Trigger

Reconsider for individual enterprise customers who contractually require dedicated infrastructure. A database-per-tenant migration path for premium tiers should be designed at that point.
