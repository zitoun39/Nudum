---
title: Nudum Core Platform
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
references:
  - docs/04-architecture/system-architecture.md
  - docs/03-domain/bounded-contexts.md
  - docs/11-adr/ADR-0008-jwt-auth.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0012-platform-bootstrap.md
---

# Nudum Core Platform

## Purpose

The Core Platform is the foundational layer of the Nudum ecosystem. It provides the shared technical infrastructure and administrative identity management required by business modules, while remaining independent of specific business domains.

To prevent monolithic bloat, the Core Platform is divided into two distinct logical areas:
1. **Core Infrastructure**: Common technical utilities and abstractions.
2. **Core Business Services**: Identity, tenant organization metadata, and licensing.

---

## Architectural Reorganization

```text
                           Nudum Monolith
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
  Core Platform (Infra + Identity)               Business Modules
         │                                       (Mahattati, Jawdati, Archivi)
         ├─ Core Infrastructure (File client, bus, logs)
         ├─ Core Identity (Orgs, Users, Auth)
         │
  Standalone Modules (Sibling contexts dependent on Core)
         ├─ AI Gateway Module (routing, metrics)
         └─ Billing Module (subscriptions)
```

By separating Billing and AI Gateway as sibling modules, the core platform remains decoupled and lean.

---

## Core Infrastructure Services

Core Infrastructure manages shared, domain-agnostic technical operations.

- **File Storage Client**: Wrapper around MinIO/S3-compatible storage. Generates presigned URLs and handles virus scanning. Business modules consume the client rather than calling MinIO directly.
- **Event Bus**: Internal in-process publisher/subscriber engine (utilizing NestJS EventEmitter). Provides decoupled asynchronous communication between modules.
- **Observability Stack**: Logging, OpenTelemetry tracing exporters, health checks, and global Correlation ID injection interceptors.
- **Audit Logging Service**: Provides a standardized, tamper-evident audit trail. Business modules publish audit requests via the event bus.

---

## Core Business Services

Core Business Services manage metadata and access control.

- **Organization Registry**: Manages organization lifecycles, metadata, and default system settings. Located in the database's `public` schema.
- **Identity & Session Manager**: Standard email/password authentication, multi-factor authentication (MFA) validation, and session verification against the Redis revocation blacklist.
- **Access Control Engine (RBAC/ABAC)**: Manages global and tenant-specific roles and permissions. Provides guards that enforce context-aware authorization.

---

## Platform Administration & Tenant Bootstrapping

Core Business Services support system-level bootstrapping (ADR-0012):
- **Platform Administrators**: Users flagged with `is_platform_admin = true` on the global `users` table. They operate within the database's `public` schema to provision new organizations and manage billing plans.
- **Onboarding Sequence**:
  1. Register organization in `public.organizations`.
  2. Create an isolated PostgreSQL schema `tenant_[org_id]` by cloning `tenant_template`.
  3. Seed standard roles (Admin, Operator, Analyst) and metadata into the new schema.
  4. Create the primary tenant user, flagging them as `tenant_admin` for that organization.

---

## Workflow Engine & Callback Architecture

The Workflow Engine manages business process state routing (e.g., approval cycles).
To prevent business logic from leaking into the Core Platform, the engine operates via a **Callback and Event loop**:

1. **Instantiation**: A business module (e.g., Jawdati) instantiates a workflow using a schema definition registered in the database.
2. **State Management**: The engine maintains the active step, assigned users, and deadlines.
3. **Execution Callbacks**: When a state transition occurs, the engine emits a domain event (e.g. `WorkflowTaskPendingApproval`).
4. **Business Validation**: The owning module catches the event, executes its local domain validation rules (e.g., checking sample value compliance), and invokes the Workflow API to approve/reject the step.
5. **Separation**: The engine never contains math, validations, or rules specific to Mahattati, Jawdati, or Archivi.

---

## Platform Success Criteria

The Core Platform is successful when:
* Shared infrastructure eliminates duplicate database access or utility code.
* Changing a business module has zero impact on identity security or database isolation.
* Tenant schema provisioning is fully automated, isolated, and auditable.
* Observing, tracing, and logging a user transaction across modules is seamless.
