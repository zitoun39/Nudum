---
title: "ADR-0005 — TypeScript as the Primary Programming Language"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/technology-decisions.md
  - docs/11-adr/ADR-0003-frontend-framework.md
  - docs/11-adr/ADR-0004-nestjs.md
---

# ADR-0005 — TypeScript as the Primary Programming Language

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a full-stack TypeScript platform. The same language on both frontend (React + Vite) and backend (NestJS) enables shared type definitions, shared validation schemas, and a unified developer mental model.

---

## Decision

> **TypeScript is the sole programming language for all Nudum source code — frontend, backend, and tooling.**

TypeScript will be configured in **strict mode** (`"strict": true`) across all packages. The `any` type is prohibited in production code unless explicitly documented with a comment explaining why.

---

## Rationale

- **Type safety**: Catches entire categories of runtime errors at compile time. Critical for a multi-tenant SaaS where a type error could expose wrong-tenant data.
- **Shared types**: Domain entities, API request/response types, and validation schemas can be defined once and imported by both frontend and backend.
- **AI-assisted development**: TypeScript is the language most extensively supported by LLM code generation. Strict types constrain AI output to architecturally correct implementations.
- **Maintainability**: Types serve as living documentation. New developers (and AI assistants) understand intent from type signatures alone.
- **Ecosystem alignment**: NestJS, React, Prisma, TypeORM, Zod, and virtually all major libraries in the Nudum stack are TypeScript-first.
- **Refactoring safety**: Renaming a domain entity propagates type errors everywhere it is used — no silent bugs.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| JavaScript | No type safety. Unsuitable for a multi-module enterprise platform with strict domain boundaries. |
| Go (backend only) | Language split between frontend and backend. Cannot share types. Smaller ecosystem for enterprise web patterns. |
| Python (backend only) | Same language-split problem. Django/FastAPI patterns differ significantly from DDD NestJS structure. |

---

## Consequences

### Positive
- Compile-time safety across the entire codebase.
- Shared type definitions between frontend and backend.
- IDE intelligence and refactoring support across all modules.
- AI code generation constrained by type signatures.

### Negative / Trade-offs
- Build step required (TypeScript compilation). Mitigated by Vite (frontend) and `ts-jest` / `swc` (backend tests).
- Strict mode means more explicit type annotations. This is a feature, not a bug.

---

## Compliance

- Strict mode (`tsconfig.json` `"strict": true`) is non-negotiable.
- No `any` in production code without documented justification.
- All domain entities must be typed as interfaces or classes — not inferred from ORM models directly.

---

## Review Trigger

This decision is effectively permanent for the foreseeable life of the project. The only trigger would be a fundamental ecosystem shift (e.g., if NestJS or React abandoned TypeScript support).
