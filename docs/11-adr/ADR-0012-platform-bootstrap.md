---
title: "ADR-0012 — Platform Administration and Tenant Bootstrapping Strategy"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/core-platform.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
---

# ADR-0012 — Platform Administration and Tenant Bootstrapping Strategy

> **Status**: Accepted — 2026-07-01

---

## Context

Every standard business operation in Nudum requires an active `organization_id` and a validated tenant database schema (ADR-0009). However, this creates a bootstrap paradox:
- A new customer cannot sign up without their organization existing.
- A database schema cannot exist before it is provisioned.
- A standard user cannot log in to a non-existent schema.
- We need a system-level role ("Platform Administrator") that operates outside of tenant boundaries to provision schemas, manage global billing, and bootstrap the first admin user of a tenant.

---

## Decision

> **We will introduce a distinct, non-tenant-scoped Platform Administration Context within the Core Platform, and a multi-phase tenant bootstrapping sequence.**

### 1. Platform Administration
- Stored in the database's `public` schema.
- Platform Administrators are flagged with `is_platform_admin = true` on the global `users` table.
- They bypass the tenant schema router, operating in the `public` schema context.
- Responsibilities: Tenant creation, billing plan definitions, system configuration, global audit logs.

### 2. Tenant Bootstrapping Sequence
When a new organization signs up:
1. **Org Registration**: The organization metadata is saved in the `public.organizations` table.
2. **Schema Provisioning**: The database runner creates a new isolated schema `tenant_[org_id]` by cloning the `tenant_template` schema structure.
3. **Admin User Creation**: A new user record is created, flagged as the `tenant_admin` for that organization, and assigned to the new schema.
4. **Role Provisioning**: The default enterprise roles (Admin, Operator, Lab Analyst, etc.) are seeded into the new schema's roles table.
5. **Activation**: The tenant admin receives an activation email to set their password and log in.

---

## Rationale

- **Bypasses the Isolation Paradox**: By placing system users and metadata in the `public` schema, we can safely run tenant provisioning operations without violating tenant schema isolation.
- **Auditable Provisioning**: Isolating tenant onboarding to a core administrative service ensures all tenant creations are audited centrally.
- **Clean Separation of Concerns**: Standard business modules (Mahattati, Jawdati, Archivi) are completely unaware of system administration logic.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Auto-onboarding via default tenant | Security risk. Bypassing schema isolation automatically from a standard client connection increases code complexity and vulnerability surface. |
| External Admin Panel (separate DB) | Excessive infrastructure complexity for the initial phase. |

---

## Consequences

### Positive
- Standardized, repeatable tenant onboarding.
- Clear separation between Platform Admins (system operators) and Tenant Admins (customer administrators).
- Prevents database isolation bypasses within standard business modules.

### Negative / Trade-offs
- Platform Admin operations must be secured with multi-factor authentication (MFA) and audited heavily, as a compromised Platform Admin account has system-wide access.

---

## Compliance

- ADR-0009: *Schema-Per-Tenant Multi-Tenancy Strategy*
- Core Platform: *Identity & Organization Services*

---

## Review Trigger

Reconsider if a third-party provisioning manager or Kubernetes-level database automation is adopted (would modify the deployment script, not this logical bootstrap flow).
