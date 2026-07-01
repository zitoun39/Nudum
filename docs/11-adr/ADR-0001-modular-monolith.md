---
title: "ADR-0001 — Modular Monolith as Initial Application Architecture"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/system-architecture.md
  - docs/03-domain/bounded-contexts.md
---

# ADR-0001 — Modular Monolith as Initial Application Architecture

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a multi-module enterprise platform targeting water utilities and public institutions. The platform must support 3 initial business modules (Mahattati, Jawdati, Archivi) and grow to 10+ modules over several years.

The team is small and the platform is in its foundation phase. The architecture must:

- Allow fast development and iteration.
- Preserve strong domain boundaries (DDD bounded contexts).
- Support a future path toward distributed services without requiring a rewrite.
- Remain operationally simple (single deployment artifact).
- Be compatible with AI-assisted development workflows.

---

## Decision

> **We will implement Nudum as a Modular Monolith, not as Microservices.**

The backend will be a single deployable NestJS application internally structured as independent, well-bounded modules. Each bounded context (Core, Mahattati, Jawdati, Archivi) maps to a separate NestJS module with its own domain services, entities, and event contracts.

Modules communicate through:
1. Explicit service interfaces (injected through NestJS DI)
2. Domain events on an internal event bus
3. Shared Core Platform services

Direct cross-module database access is prohibited.

---

## Rationale

- **Faster development**: One codebase, one deployment, one test suite.
- **Easier debugging**: No network calls between modules — full stack traces.
- **Lower infrastructure cost**: Single PostgreSQL instance, single Redis, single container.
- **Domain boundaries preserved**: NestJS module system enforces separation without network overhead.
- **Migration path**: If a module needs to scale independently, it can be extracted as a separate service because its boundaries are already clean. No architectural rewrite required.
- **AI-assisted development compatibility**: AI coding assistants are significantly more effective in a single-repository, single-language codebase.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Microservices from day one | Excessive operational complexity for a founding team. Network latency, distributed tracing, and service mesh overhead not justified at this scale. Domain boundaries can be preserved without deployment separation. |
| Traditional layered monolith | No module isolation. All domains share the same layers, making future extraction impossible without a rewrite. |
| Serverless functions | Poor fit for stateful enterprise workflows, long-running processes, and complex domain logic. |

---

## Consequences

### Positive
- Fast initial development velocity.
- Simple deployment (single Docker container).
- Full stack debugging without distributed tracing.
- Strong domain isolation ready for future extraction.
- All AI assistants can reason about the full codebase.

### Negative / Trade-offs
- Cannot scale individual modules independently (all scale together).
- A single slow module can impact the whole application.
- Future microservice extraction requires careful planning.

### Neutral
- Kubernetes is deferred but not prevented.
- Event bus starts as in-process (NestJS EventEmitter); can migrate to RabbitMQ/Kafka without changing business logic.

---

## Compliance

- Architecture Principle 3: *Modular Monolith First*
- Architecture Principle 4: *Evolution Without Rewrite*
- Architecture Principle 8: *Shared Core Platform*

---

## Review Trigger

Reconsider when any single module handles >10,000 concurrent users independently, or when operational requirements (separate team, separate release cycle) justify extraction.
