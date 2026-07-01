---
title: "ADR-0004 — NestJS as Backend Framework"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/11-adr/ADR-0001-modular-monolith.md
  - docs/11-adr/ADR-0005-typescript.md
  - docs/04-architecture/technology-decisions.md
---

# ADR-0004 — NestJS as Backend Framework

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum's backend must implement a Modular Monolith (ADR-0001) containing multiple bounded contexts with complex business logic, background jobs, event buses, REST APIs, and future GraphQL capabilities.

The framework must:

- Enforce module-level separation natively.
- Support Dependency Injection for testable business services.
- Provide first-class TypeScript support.
- Support REST API, WebSockets, and background queues in the same process.
- Enable large, AI-generated codebases to remain consistent and structured.

---

## Decision

> **We will use NestJS as the backend application framework.**

NestJS's module system directly maps to Nudum's bounded contexts. Each bounded context becomes a NestJS module with its own controllers, services, repositories, and event handlers.

---

## Rationale

- **Module system**: NestJS modules enforce encapsulation — modules explicitly declare what they export and what they import. This aligns precisely with bounded context boundaries.
- **Dependency Injection**: DI makes domain services testable in isolation without framework coupling.
- **Decorator-based architecture**: Controllers, guards, interceptors, and pipes provide clean separation of cross-cutting concerns (auth, logging, validation, transformation).
- **Enterprise patterns built-in**: Interceptors, guards, pipes, exception filters, and middleware correspond directly to enterprise concerns (auth, audit, rate limiting, error handling).
- **Queue support**: `@nestjs/bull` / `@nestjs/bullmq` for background processing without an additional framework.
- **Event system**: `@nestjs/event-emitter` for internal domain events; migrates to external brokers without business logic changes.
- **Testing**: NestJS Test module supports full unit and integration tests with DI.
- **AI code generation quality**: NestJS is extensively covered in LLM training data with consistent patterns.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Express.js | No built-in module system, DI, or architectural conventions. Each developer invents their own structure. Inconsistent at scale. |
| Fastify (raw) | Same problem as Express — low-level, no enforced architecture. |
| AdonisJS | Smaller ecosystem, less AI training data, less community adoption. |
| ASP.NET Core (C#) | Different language from the frontend. Loses the TypeScript full-stack alignment. |
| Spring Boot (Java) | Same — language mismatch, JVM infrastructure overhead. |

---

## Consequences

### Positive
- Clean module-to-bounded-context mapping.
- Testable domain services through DI.
- Consistent code structure across all modules.
- Built-in support for guards (auth), interceptors (logging), pipes (validation).

### Negative / Trade-offs
- NestJS abstraction layer adds some learning overhead.
- Decorators can obscure execution flow for new developers.
- Startup time slightly higher than raw Express (acceptable for an enterprise SaaS).

---

## Compliance

- ADR-0001: NestJS modules implement the Modular Monolith boundaries.
- Architecture Principle 5: *Domain-Driven Organization* — module structure mirrors domain structure.
- Engineering Principle 4: *Single Responsibility* — each NestJS service has one clear responsibility.

---

## Review Trigger

Reconsider if a module needs to be extracted as a standalone microservice — at that point, NestJS microservices transport adapters allow extraction without rewriting business logic.
