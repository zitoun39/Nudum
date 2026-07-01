---
title: "ADR-0007 — MinIO as Object Storage"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/technology-decisions.md
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/core-platform.md
---

# ADR-0007 — MinIO as Object Storage

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum manages large binary files across all modules:

- **Archivi**: Documents, correspondence, scanned files, PDFs, versioned attachments.
- **Jawdati**: Laboratory report PDFs, instrument data files, certificate images.
- **Mahattati**: Maintenance photo evidence, equipment documentation.
- **Core**: User avatars, organization logos, report exports.

These files cannot be stored in PostgreSQL (performance, cost, backup complexity). A dedicated object storage service is required.

The storage solution must:
- Be S3-compatible (industry standard API).
- Run on-premise for customers with data sovereignty requirements.
- Support multi-tenant isolation (objects namespaced by tenant).
- Support signed URLs for secure, time-limited access.
- Support large file uploads (multi-part).

---

## Decision

> **We will use MinIO as the default object storage provider, accessed through the S3-compatible API.**

The application layer will use an S3-compatible client (`@aws-sdk/client-s3`) that abstracts the storage backend. MinIO is the default for development and on-premise deployments. Cloud deployments can substitute any S3-compatible service (AWS S3, Azure Blob via S3 gateway, Cloudflare R2, Backblaze B2) without application code changes.

---

## Rationale

- **On-premise deployment**: MinIO runs in a Docker container on any server. Critical for Algerian public institutions with data sovereignty requirements.
- **S3 compatibility**: The `@aws-sdk/client-s3` client works identically with MinIO and AWS S3. Switching providers requires only environment variable changes.
- **Tenant isolation**: Objects stored under `/{organizationId}/{moduleId}/{fileId}` — no cross-tenant access possible.
- **Signed URLs**: Time-limited presigned URLs allow secure file downloads without routing binary data through the application server.
- **Multi-part uploads**: Large documents and OCR batches upload directly to MinIO without buffering in the NestJS process.
- **Operational simplicity**: MinIO has a web console, Prometheus metrics export, and lifecycle policies (automatic expiration of temporary files).

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| AWS S3 directly | Not available for on-premise deployments. Vendor lock-in without abstraction layer. |
| Storing files in PostgreSQL (bytea) | Poor performance, enormous database size, expensive backups, no CDN integration. |
| Local filesystem | Not scalable across multiple instances, no replication, no managed lifecycle. |
| Seaweedfs | More complex to operate. MinIO has better documentation and wider adoption. |

---

## Consequences

### Positive
- True cloud/on-premise portability — same code, different environment variables.
- Files never route through the application server (presigned URLs).
- Per-tenant namespacing enforces data isolation at the storage layer.
- Virus scanning can be integrated as a MinIO lifecycle hook.

### Negative / Trade-offs
- MinIO requires its own data volume and backup strategy (separate from PostgreSQL backups).
- Access policy configuration must be correct — misconfiguration could expose objects.

---

## Compliance

- Architecture Principle 11: *On-Premise Ready* — MinIO is the on-premise storage strategy.
- Architecture Principle 9: *Multi-Tenant by Design* — object key namespacing enforces isolation.
- Core Platform: File Service abstracts the storage provider — business modules never call MinIO directly.

---

## Review Trigger

Reconsider if cloud-only deployments dominate and operational teams prefer to eliminate MinIO in favour of native cloud storage (a provider-specific ADR would be created, not replacing this one).
