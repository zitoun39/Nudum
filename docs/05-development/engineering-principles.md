---
title: Nudum Engineering Principles
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Development
references:
  - docs/05-development/development-workflow.md
  - docs/04-architecture/architecture-principles.md
---

# Nudum Engineering Principles

## Purpose

This document defines the engineering standards that govern the implementation of the Nudum platform.

Its purpose is to ensure that every contributor—human or AI—produces software that is consistent, maintainable, secure, scalable, and aligned with the long-term architecture of the project.

---

## Coding Standards

* **Language**: Strict TypeScript. No `any` without comments explaining why.
* **Architecture**: Clean Architecture / Domain-Driven Design (DDD).
* **Test Coverage**: 80%+ coverage for core business logic and domain services.
* **Encapsulation**: Domain services do not expose internal database logic or HTTP details.

---

## Database Standards & Soft Delete Policy

To maintain regulatory compliance (critical for water quality and auditing), data must never be hard-deleted from the database in standard business operations:

- **Soft Delete Field**: Every auditable or operational table must carry a nullable column `deleted_at TIMESTAMPTZ` (or `deletedAt: Date | null` in TypeORM).
- **Deletion Operation**: Deleting an entity sets `deleted_at = NOW()`.
- **Query Isolation**: All standard read queries must automatically filter out soft-deleted records (`WHERE deleted_at IS NULL`). This should be implemented at the Base Repository level in TypeORM.
- **Cascade Rules**: If a parent entity is soft-deleted, the application layer must trigger a cascading soft-delete of all direct dependent child records.
- **Hard Deletes**: Hard deletes (`DELETE FROM`) are restricted to temporary data, session caches, or executed manually by a Platform Administrator in the `public` registry.

---

## Security & Multi-Tenancy Enforcement

- **No Shared Rows**: Every business entity must belong to a tenant database schema.
- **Access Verification**: Every API query must validate that the request context matches the active database schema name dynamically.
- **Secrets Management**: Credentials, private keys, and API tokens must never be hardcoded. Use environment variables resolved at startup.

---

## API Design Standards

- **RESTful endpoints**: Resources are plural (e.g. `/samples`, `/documents`).
- **Pagination**: Large collections must implement cursor-based or limit-offset pagination, returning standard metadata wrappers.
- **Error Formatting**: Error responses must follow the RFC 7807 (Problem Details) specification, providing clear error codes and translations.
