# AGENTS.md — AI Development Instructions for Nudum

> **This file is mandatory reading for every AI coding assistant before generating any output in this repository.**
>
> This applies to: Claude, Gemini, GitHub Copilot, Cursor, GPT-4, Antigravity, and any future AI tool.

---

## 1. Project Identity

**Nudum (نُظُم)** is a modular enterprise SaaS platform targeting water utilities, laboratories, quality management, and document governance in Algeria, North Africa, the Middle East, and internationally.

- **Repository**: `D:\Nudum` / `https://github.com/zitoun39/nudum`
- **Author**: Abdelhak Zitoun
- **Phase**: Foundation Documentation (no implementation code yet)
- **License**: MIT

---

## 2. The Prime Directive

> **Documentation drives development. Architecture drives implementation. Business domains drive architecture. AI accelerates implementation but never invents architecture.**

When documentation and code conflict: **documentation wins** until officially updated.

When documentation is incomplete: **stop and ask** rather than inventing requirements.

---

## 3. Source of Truth Hierarchy

When any conflict arises, resolve it by this priority order:

| Priority | Source |
|---|---|
| 1 | `docs/00-foundation/vision.md` + `mission.md` |
| 2 | `docs/00-foundation/project-philosophy.md` |
| 3 | `docs/01-product/product-principles.md` |
| 4 | `docs/05-development/engineering-principles.md` |
| 5 | `docs/04-architecture/architecture-principles.md` |
| 6 | `docs/04-architecture/technology-decisions.md` |
| 7 | `docs/11-adr/` (individual ADRs) |
| 8 | `docs/10-prd/` (feature PRDs) |
| 9 | Source code |

---

## 4. Mandatory Reading Sequence

Before writing any code, read these documents in order:

1. `docs/00-foundation/project-philosophy.md`
2. `docs/03-domain/ubiquitous-language.md`
3. `docs/03-domain/bounded-contexts.md`
4. `docs/03-domain/module-boundaries.md`
5. `docs/04-architecture/architecture-principles.md`
6. `docs/04-architecture/system-architecture.md`
7. `docs/05-development/engineering-principles.md`
8. `docs/05-development/development-workflow.md`
9. The relevant PRD in `docs/10-prd/` (if implementing a feature)

---

## 5. Technology Stack (Authoritative)

| Layer | Technology | ADR |
|---|---|---|
| Language | TypeScript | ADR-0005 |
| Backend Framework | NestJS | ADR-0004 |
| Frontend | React + Vite (SPA) | ADR-0003 |
| UI Framework | Tailwind CSS | ADR-0003 |
| Database | PostgreSQL | ADR-0002 |
| Cache / Queue | Redis | ADR-0006 |
| Object Storage | MinIO (S3-compatible) | ADR-0007 |
| Authentication | JWT + Refresh Tokens | ADR-0008 |
| Application Architecture | Modular Monolith (first) | ADR-0001 |
| Multi-tenancy | Schema-per-tenant isolation | ADR-0009 |
| AI Integration | AI Gateway (provider-agnostic) | ADR-0010 |

> ⚠️ **Important**: The frontend is **React + Vite**, not Next.js. `system-architecture.md` previously contained an error that has been corrected. Always follow `technology-decisions.md` for the authoritative stack.

---

## 6. Business Modules

| ID | Module | Arabic | Status | Domain |
|---|---|---|---|---|
| BUS-001 | Mahattati | محطتي | Design | Water treatment plant operations |
| BUS-002 | Jawdati | جودتي | Design | Laboratory & Quality Management (LIMS/QMS) |
| BUS-003 | Archivi | أرشيفي | Design | Enterprise Document Management |

**Core Platform modules** (Organizations, Auth, RBAC, Workflows, Notifications, AI Gateway, etc.) are in **Design** status — no implementation exists yet.

---

## 7. Architecture Rules — What AI Must Never Violate

### Module Boundaries
- Every business entity has **exactly one owner module**. See `docs/03-domain/module-boundaries.md`.
- Business modules **never access another module's database** directly.
- Cross-module communication occurs **only** through: Public APIs · Domain Events · Shared Core Services.

### Core Platform Rules
- Business modules **never** implement: authentication, authorization, notification delivery, billing, search engines, workflow execution, or AI provider calls.
- All of these belong exclusively to the Core Platform.

### Multi-Tenancy
- Every query, service, and storage operation **must** enforce tenant schema isolation.
- Tenant schemas are isolated (`tenant_[org_id]`), and database connection routing must target the active tenant schema.
- No implementation may bypass tenant schema boundaries.

### Security
- Every endpoint requires: Authentication · Authorization · Validation · Audit Logging.
- Security cannot be deferred to a future version.

### AI Gateway
- Business modules **never** call LLM providers (OpenAI, Anthropic, Google, etc.) directly.
- All AI calls go through the central AI Gateway.

---

## 8. Ubiquitous Language — Canonical Terms

Use only these terms. Never use synonyms. See `docs/03-domain/ubiquitous-language.md` for the full glossary.

| Concept | Use This | Never Use |
|---|---|---|
| Tenant root | Organization | Company, Client, Institution |
| People | User | Operator, Employee, Person |
| Lab specimen | Sample | Specimen, Test Sample |
| Lab test | Analysis | Test, Examination |
| Lab output | Result | Reading, Output |
| Managed file | Document | File, Record |
| Business process | Workflow | Process, Procedure |
| Work item | Task | Job, Action |
| Physical asset | Equipment | Machine, Device |

---

## 9. Development Workflow Requirements

Every feature follows this sequence — AI must not skip phases:

1. **Discovery** — Understand the business problem
2. **Documentation** — Write or update PRD, database design, API spec
3. **Architecture Review** — Validate module ownership, tenant isolation, security
4. **Task Planning** — Break into small, independently testable tasks
5. **Implementation** — Follow architecture, coding standards, module boundaries
6. **Testing** — Unit + Integration + E2E tests required for business logic
7. **Code Review** — Architecture compliance, security, test coverage
8. **Documentation Update** — Code and docs evolve together

---

## 10. What AI Must NOT Do

| ❌ Prohibited |
|---|
| Invent undocumented business rules |
| Change the business vision or product scope |
| Simplify or remove architectural boundaries |
| Introduce frameworks or libraries not in the ADRs without creating a new ADR |
| Bypass multi-tenancy checks |
| Call LLM providers directly from business modules |
| Implement duplicate platform capabilities inside business modules |
| Commit or merge without human review |
| Generate code without reading the relevant PRD first |
| Use synonyms not listed in the Ubiquitous Language |

---

## 11. What AI CAN Do

| ✅ Permitted |
|---|
| Generate code that follows documented architecture |
| Suggest improvements to documentation (but wait for approval) |
| Create ADRs for new decisions (await approval before implementing) |
| Write tests that cover documented business rules |
| Refactor code to better align with architecture principles |
| Create PRDs for undocumented features (await approval) |
| Ask questions when documentation is incomplete |
| Flag inconsistencies between documents |

---

## 12. Code Conventions (Summary)

Full details in `docs/05-development/engineering-principles.md`.

- **Language**: TypeScript, strict mode, no `any`
- **Naming**: PascalCase for classes/types, camelCase for fields, SCREAMING_SNAKE_CASE for constants
- **Entities**: Singular nouns (`Sample`, not `Samples`)
- **Events**: Past tense (`SampleCollected`, not `CollectSample`)
- **API endpoints**: Plural resources (`/samples`, `/documents`)
- **Database tables**: `snake_case` plural (`laboratory_samples`, `workflow_tasks`)
- **Business logic**: Domain services only — never in controllers, routes, or UI

---

## 13. Documentation Standards

Every new document must include this YAML frontmatter:

```yaml
---
title: Document Title
status: Active | Draft | Deprecated
owner: Abdelhak Zitoun
last-updated: YYYY-MM-DD
category: Foundation | Product | Business | Domain | Architecture | Development | Security | API | Database | Deployment
references:
  - path/to/related/doc.md
---
```

---

## 14. Asking for Clarification

When documentation is missing or ambiguous, respond with:

```
I need clarification before proceeding:

1. [Specific question about missing requirement]
2. [Specific question about architectural boundary]

Relevant documentation checked:
- docs/[file1.md]
- docs/[file2.md]

I will not generate code until these questions are resolved.
```

---

## 15. Repository Status (as of 2026-07-01)

- ✅ Foundation documentation complete (18 core docs)
- ✅ `docs/` structure organized
- ✅ Bounded contexts, domain model, ubiquitous language defined
- ✅ Architecture principles, technology decisions documented
- ✅ Module boundaries and registry established
- 🔧 ADRs — to be created (see `docs/11-adr/`)
- 🔧 PRDs — to be created for each module (see `docs/10-prd/`)
- 🔧 Implementation — not started

---

> *"Build the documentation once. Generate the software many times."*
> — Nudum Development Philosophy
