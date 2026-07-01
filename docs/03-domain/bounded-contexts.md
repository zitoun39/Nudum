---
title: Nudum Bounded Contexts
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
references:
  - docs/03-domain/domain-model.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/module-registry.md
---

# Nudum Bounded Contexts

## Purpose

This document defines the bounded contexts of the Nudum platform.

Each bounded context represents an independent business domain with its own language, business rules, data ownership, and lifecycle. Bounded contexts enforce domain isolation, preventing technical coupling and duplicate responsibilities.

---

## Bounded Context Boundaries

```text
                           Nudum Monolith
                                 │
  ┌──────────────────────────────┼──────────────────────────────┐
  ▼                              ▼                              ▼
Core Platform Business     Core Platform Infra         Business Contexts
(Identity, Orgs, Users)    (File storage, event bus)   (Mahattati, Jawdati, Archivi)
                                                                │
                                                                ▼
                                                       Sibling Extensions
                                                       (AI Gateway, Billing)
```

---

## Core Platform Context

Provides shared infrastructural and identity capabilities.
* **Owns**: Organizations, Users, Authentication, Roles, Permissions, Global Audit Logs, Notification Dispatcher, Workflow State routing, File Client wrapper.

---

## Mahattati Context (Operations)

Manages operational water facility sites, equipment assets, and sensor telemetry.
* **Owns**: Sites, Stations, Equipment, Telemetry Sensors, Measurements, Maintenance logs.
* **Key Boundary**: Does not own Laboratory data, results, or document files.

---

## Jawdati Context (Quality Assurance)

Manages physicochemical and microbiological water testing and quality compliance.
* **Owns**: Laboratories, Instruments, Samples, Analyses, Results, Test Methods.
* **Key Boundary**: `Laboratory` is a root-level aggregate. It does not belong to or inherit from a Mahattati `Site`. It references operational Sites only by external ID lookup.

---

## Archivi Context (Information Governance)

Manages secure digital records and formal correspondence.
* **Owns**: Documents, Folders, Version records, Retention policies, Correspondence logs.
* **Key Boundary**: Business modules attach files using a core-level storage client; they do not write to Archivi's internal database directly.

---

## Sibling Context Extensions

### AI Gateway
- Centralized technical gateway for model routing, token auditing, and request caching.
- **Boundary**: Does not own prompts, context assembly, or parsers; those live in business modules.

### Billing Context
- Manages SaaS subscriptions, commercial tiers, and invoices.
- **Boundary**: Completely isolated from business module features.

---

## Context Integration Rules

1. **No Shared Database schemas**: Modules never join tables across contexts.
2. **References via ID**: When a context references an entity owned by another context, it stores only the ID (e.g. Jawdati `Sample` references Mahattati `Station` via `station_id`).
3. **Communication Contracts**: Inter-context communication uses public HTTP/REST endpoints or asynchronous domain events.
