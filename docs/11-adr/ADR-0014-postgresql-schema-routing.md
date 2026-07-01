---
title: "ADR-0014 — PostgreSQL Schema Routing Strategy"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0011-orm-and-migrations.md
---

# ADR-0014 — PostgreSQL Schema Routing Strategy

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum adopts a **Schema-Per-Tenant** multi-tenancy model (ADR-0009). Each organization's database tables reside in a dedicated PostgreSQL schema (e.g. `tenant_[org_id]`), while common administration data resides in the `public` schema.

To support high-concurrency SaaS scalability and regional on-premise deployments, Nudum utilizes **PgBouncer** for database connection pooling. In production cloud deployments, PgBouncer is configured in **Transaction Pooling Mode**.

### The Pooling and State Leakage Problem

In transaction pooling mode:
1. A database connection from the pool is assigned to a client **only for the duration of a single transaction**.
2. Between transactions (or statements outside transactions), PgBouncer can assign different physical server connections to the same client session, or assign the same server connection to different clients.
3. If the application layer issues a session-level configuration change like `SET search_path = tenant_a, public`, the schema routing parameter is bound to the **physical database session**.
4. When that connection is returned to the pool and subsequently reused by another client, that client will execute its queries in `tenant_a` instead of its own schema. This results in a critical cross-tenant data leak.
5. Conversely, if a single HTTP request performs multiple queries outside of a transaction block, different queries may execute on different connections, leading to query failures or disjointed data reads.

Therefore, session-level schema switching is fundamentally incompatible with transaction-level connection pooling. We require a schema routing mechanism that is completely isolated per transaction and leaves no state residue on pooled connections.

---

## Decision

> **We will enforce a transaction-scoped schema routing strategy using `SET LOCAL search_path` within explicit transaction blocks for all database operations.**

### 1. Transaction Boundaries and `SET LOCAL`
- Every database read and write query must execute inside an explicit database transaction block (`BEGIN` / `COMMIT` / `ROLLBACK`).
- The very first statement executed immediately after opening the transaction must be:
  ```sql
  SET LOCAL search_path TO tenant_[org_id], public;
  ```
- The `LOCAL` modifier restricts the configuration change to the lifetime of the transaction. Once the transaction completes (commits or rolls back), the connection's `search_path` automatically reverts to its default, preventing leakage of the tenant context to subsequent clients reusing the connection.

### 2. ORM and Connection Manager Responsibilities
- The database connection manager (managed via TypeORM, see ADR-0011) must intercept database requests and extract the active tenant schema from `AsyncLocalStorage`.
- For standard repository access (e.g. `repository.find()`), the connection manager must wrap the operation inside a short-lived transaction block under the hood, retrieving a transaction-bound `QueryRunner`, executing `SET LOCAL search_path`, running the ORM command, and committing the transaction.
- Global queries targeting the shared context (`public` schema) bypass this wrapper and route directly using the default pool connection.

### 3. Migration Execution Behavior
- Database migrations alter schema structure (DDL) and require session-level control.
- Migrations must bypass PgBouncer's transaction pooling port (e.g. connecting directly to the PostgreSQL server port 5432 or utilizing a separate PgBouncer port configured for session pooling).
- The migration runner will sequentially or concurrently switch the session-level `search_path` to execute schema updates across all tenant schemas.

---

## Rationale

- **Absolute Data Security**: `SET LOCAL` guarantees that schema switching is transaction-bound. In the event of an application crash or connection pool return, PostgreSQL natively resets the `search_path`, eliminating the risk of cross-tenant data leaks.
- **PgBouncer Compatibility**: Supports high-scale transaction pooling, enabling Nudum to support thousands of concurrent requests over a small number of physical database connections.
- **ORM Native Compliance**: TypeORM's `QueryRunner` exposes direct transaction lifecycle controls, allowing clean implementation of this pattern within a custom NestJS connection manager middleware.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Session-level `SET search_path` | **Rejected**. Causes severe state leakage across transactions in PgBouncer transaction pooling mode, resulting in cross-tenant data contamination. |
| Connection-per-tenant pool | **Rejected**. Does not scale. Maintaining a separate connection pool for hundreds or thousands of tenants quickly exhausts PostgreSQL's connection capacity and memory. |
| Table-name prefixing (e.g. `tenant_x.users`) in queries | **Rejected**. Breaks standard ORM relationships, dynamic schema-generation features, and complicates migration structures, making the codebase brittle. |

---

## Consequences

### Positive
- Strict, transaction-level multi-tenant security isolation.
- Seamless compatibility with PgBouncer transaction pooling, optimizing database connection overhead.
- Safe reuse of database connections without manual connection resets (`DISCARD ALL`).

### Negative / Trade-offs
- Every read-only select query must be wrapped in a transaction block, which increases transaction overhead on PostgreSQL.
- Long-running transactions will hold connections longer, potentially starving the PgBouncer pool under high load. Transactions must be kept extremely short and focused.

### Neutral
- Standard NestJS service methods must use the transaction-aware context wrappers rather than direct repository calls.

---

## Compliance

- ADR-0002: *PostgreSQL as Primary Database*
- ADR-0009: *Schema-Per-Tenant Multi-Tenancy Strategy*
- ADR-0011: *ORM and Database Migrations Strategy*

---

## Testing Requirements

- **Concurrency Leak Tests**: Integration tests must spin up a simulated transaction-pooling connection pool, launch 100+ concurrent asynchronous queries for multiple different tenant schemas, and assert that every query reads/writes data strictly to its designated schema.
