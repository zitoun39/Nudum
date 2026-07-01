---
title: "ADR-0002 — PostgreSQL as Primary Database"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/technology-decisions.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
---

# ADR-0002 — PostgreSQL as Primary Database

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum manages complex relational data across multiple domains: laboratory analyses, operational measurements, equipment records, document metadata, workflow states, audit logs, and multi-tenant organization data.

The database must:

- Guarantee ACID compliance for all transactional business operations.
- Support complex relational queries across entities (samples → analyses → results).
- Handle multi-tenant schema-level isolation efficiently.
- Support full-text search as an initial search strategy (before dedicated search engines).
- Run on-premise on customer infrastructure.
- Be available as a managed cloud service.

---

## Decision

> **We will use PostgreSQL as the sole primary relational database for all Nudum business data.**

All bounded contexts (Core, Mahattati, Jawdati, Archivi) will store their data in PostgreSQL. Multi-tenancy is implemented at the schema level (separate schema per organization) sharing a single database instance (see ADR-0009).

---

## Rationale

- **ACID compliance**: Laboratory results, regulatory measurements, and document approvals require strict transactional integrity.
- **JSON support**: `jsonb` columns allow flexible metadata storage without sacrificing relational integrity.
- **Advanced indexing**: GIN indexes for full-text search, partial indexes for tenant-scoped queries, composite indexes for analytical queries.
- **Schema-level Isolation**: Restricts database search path per connection dynamically, ensuring logical data isolation at the database level.
- **Strong ecosystem**: TypeORM, Prisma, Drizzle, and MikroORM all support PostgreSQL with mature TypeScript clients.
- **On-premise deployable**: Runs on any Linux server, Docker container, or managed service (AWS RDS, Azure Database, Supabase, Neon).
- **Longevity**: PostgreSQL has a 30+ year track record of reliability and backward compatibility.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| MySQL / MariaDB | Weaker JSON support, less advanced indexing, JSON_TABLE syntax differences. PostgreSQL is the stronger enterprise choice. |
| MongoDB | No ACID transactions across documents by default. Complex relational queries (sample → analysis → result → compliance) are significantly harder. |
| SQL Server | Proprietary license, higher cost, weaker on-premise flexibility. |
| SQLite | Not suitable for multi-tenant SaaS or concurrent production workloads. |

---

## Consequences

### Positive
- Full relational integrity across all business entities.
- Native multi-tenant isolation via dynamic schema switching.
- Full-text search available immediately via `tsvector` / `tsquery`.
- JSON flexibility for extensible metadata without schema changes.

### Negative / Trade-offs
- Horizontal sharding is complex; will require read replicas or partitioning at scale.
- Time-series data (sensor measurements) may eventually benefit from TimescaleDB extension or a dedicated TSDB.

### Neutral
- ORM selection (TypeORM vs Prisma vs MikroORM) is a separate decision governed by ADR-0011.
- Search will migrate to Meilisearch or OpenSearch when PostgreSQL FTS is no longer sufficient.

---

## Compliance

- Architecture Principle 9: *Multi-Tenant by Design*
- Architecture Principle 13: *Security as Architecture*
- Engineering Principle 11: *Database Is Not Business Logic*

---

## Review Trigger

Reconsider when sensor/IoT time-series data volume requires a dedicated time-series database, or when per-tenant data volumes require database-level sharding.
