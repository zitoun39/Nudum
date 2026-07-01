# ARCHITECT_REVIEW.md — Nudum Full Architecture Audit

**Auditor**: Antigravity (Lead Architect)
**Date**: 2026-07-01
**Scope**: All 29 documents in `docs/` + `AGENTS.md` + `README.md`
**Commit audited**: `f8c0605`

---

## Summary

The Nudum documentation foundation is architecturally sound at the strategic level. The DDD bounded context design, module boundary enforcement philosophy, and AI-native platform vision are coherent and well-reasoned. However, the documentation contains **5 critical gaps** that will block or corrupt implementation if unaddressed, plus **9 high-priority issues** that will cause costly rework once code begins.

---

## CRITICAL

> These issues will directly cause data integrity violations, security breaches, or blocked implementation if not resolved before writing any code.

---

### C1 — ORM/Data Access Layer Not Decided (Blocks All Implementation)

**Files**: `docs/11-adr/ADR-0002-postgresql.md` (L78), `docs/11-adr/ADR-0005-typescript.md` (L72)

ADR-0002 explicitly defers: *"ORM selection (TypeORM vs Prisma vs MikroORM) is a separate decision not governed by this ADR."* ADR-0009 mandates a **base repository class** that auto-injects `organization_id` filtering to enforce multi-tenancy. But this base class cannot be designed without knowing the ORM.

The three candidates are architecturally different:
- **TypeORM**: Active Record + Data Mapper, class-based entities, runtime reflection. Mature but type inference is weak.
- **Prisma**: Schema-first, generated client, no class decorators. Excellent DX, but wrapping it in a base repository that intercepts all queries requires middleware patterns.
- **MikroORM**: Unit of Work, Identity Map, DDD-friendly. Best alignment with Nudum's aggregate model but smallest ecosystem.

**Risk**: If different developers choose different patterns (Prisma in one module, TypeORM in another), the codebase becomes unmaintainable.

**Required**: ADR-0011 (ORM + Migration strategy) before any module implementation begins.

---

### C2 — Tenant Bootstrap Problem: No First-User Creation Path Defined

**Files**: `docs/03-domain/domain-model.md`, `docs/04-architecture/core-platform.md`, `docs/03-domain/module-registry.md`

Every entity in the system requires an `organization_id`. Authentication requires a `User`. Authorization requires a `Role`. But nowhere in any document is the following question answered:

> **Who creates the first Organization? Who creates its first admin User? How does a fresh tenant get into the system?**

This is the classic multi-tenant bootstrap paradox. The platform has no concept of:
- A **Platform Administrator** (Nudum staff who provision new tenants)
- A **Tenant Super Admin** (first user created during onboarding)
- A **Tenant Onboarding Flow** (invitation → registration → org setup)

Without this, no one can log in, ever. The module registry lists "Organizations" and "Users" as Core modules but says nothing about who creates the first one.

**Risk**: This cannot be added as an afterthought. It affects the `organizations` table design, the authentication flow, the billing integration, and the invitation/onboarding UX.

**Required**: Define Platform Administrator role (system-level, not tenant-scoped) and the tenant provisioning sequence. This determines schema design for `organizations`, `users`, and `invitations` tables.

---

### C3 — `technology-decisions.md` Directly Contradicts the ADR System (Dual Source of Truth)

**Files**: `docs/04-architecture/technology-decisions.md`, `docs/11-adr/`

`technology-decisions.md` still contains 22 decisions in a flat proprietary format labeled "ADR-000". Now that `docs/11-adr/` contains 10 individually tracked ADRs (ADR-0001 through ADR-0010), the same decisions exist in two different documents with different levels of detail.

Specific contradictions visible today:
- `technology-decisions.md` Decision 017 says search migrates to "OpenSearch or Elasticsearch". ADR-0002 says "Meilisearch or OpenSearch". Different options listed for the same migration path.
- `technology-decisions.md` contains decisions not yet in any ADR (Decision 010: RBAC/ABAC, Decision 018: Tesseract OCR, Decision 019: Notifications, Decision 020: Payments) — these are orphaned.
- The `technology-decisions.md` heading says "ADR-000" but it is neither the ADR template format nor an individual ADR.

**Risk**: Any future AI agent or developer reading both documents will get contradictory information. Violates "Single Source of Truth" — a documented first principle.

**Required**: Either (a) deprecate `technology-decisions.md` immediately, redirecting readers to `docs/11-adr/`, and create the missing ADRs (RBAC, OCR, Notifications, Payments, Search) or (b) define it as a "Decision Index" with no content — just a table pointing to individual ADRs. Option (a) is correct.

---

### C4 — AI Context (bounded-contexts.md) vs AI Gateway (core-platform.md) — Unresolved Ownership Conflict

**Files**: `docs/03-domain/bounded-contexts.md` (L221), `docs/04-architecture/core-platform.md` (L306), `docs/11-adr/ADR-0010-ai-gateway.md`

`bounded-contexts.md` defines a separate **"AI Context"** bounded context that **owns**: AI Sessions, Prompt Templates, AI Model Configuration, Semantic Indexes, Knowledge Retrieval.

`core-platform.md` defines an **"AI Gateway"** Core Platform service that **manages**: Prompt management, Context assembly, Token accounting, Rate limiting, Semantic search.

`ADR-0010` says the AI Gateway is a Core Platform service.

These are describing the **same things** from two different conceptual positions. This creates ambiguity:
- Is the "AI Context" a Core module or a separate bounded context?
- Who owns Prompt Templates — Core Platform or a domain team?
- Is "AI Context" in `bounded-contexts.md` meant to be the same as "AI Gateway" in `core-platform.md` or a separate consumer module?

The `module-boundaries.md` makes it worse: it lists "AI Module (Future)" as a separate future module at line 255, implying AI grows beyond Core — but no migration path or scope distinction is described.

**Risk**: Two teams (or two AI agents) could implement competing AI infrastructure. Prompt template schema could be defined in two incompatible ways.

**Required**: Consolidate to a single statement: "AI Gateway is a Core Platform service (not a separate bounded context). The `bounded-contexts.md` AI Context section should be removed or explicitly marked as the internal design of the AI Gateway module."

---

### C5 — No Specification for Cross-Aggregate Transactions or Consistency Model

**Files**: `docs/03-domain/domain-model.md`, `docs/04-architecture/architecture-principles.md`

The domain model defines Aggregates (Sample → Analysis → Result, Document → Version → Approval) and states that Aggregates are consistency boundaries. But the documents never address:

1. **What happens when a use case spans two aggregates?** Example: Approving a Document triggers a WorkflowTask completion. Document belongs to Archivi. WorkflowTask belongs to Core. Are both updated in one database transaction? Via an event? What is the consistency model?
2. **Are Sagas or Process Managers planned?** Long-running business processes (multi-step approval chains) require compensating transactions if a step fails.
3. **Is eventual consistency acceptable for cross-module operations?** If yes, where? If no, how is it avoided?

**Risk**: Without this specification, developers will either (a) use cross-module database transactions (violating module boundaries), or (b) introduce eventual consistency bugs where partial state is visible. Both are serious.

**Required**: A short consistency model document or an addition to `architecture-principles.md` that states: within an aggregate = ACID, within a module = can span aggregates via UoW, across modules = eventual consistency via domain events + idempotent event handlers.

---

## HIGH

> These issues will cause costly architectural rework once implementation begins if not resolved first.

---

### H1 — Reporting Context Is Defined in Three Conflicting Locations

**Files**: `docs/03-domain/bounded-contexts.md` (L203), `docs/04-architecture/core-platform.md` (L288), `docs/03-domain/module-boundaries.md` (L236)

- `bounded-contexts.md` defines "Reporting Context" as a full bounded context with its own ownership.
- `core-platform.md` defines "Reporting Foundation" as a Core Platform service.
- `module-boundaries.md` defines "Reporting Module (Future)" as a future module.

Three different documents place Reporting in three different architectural positions (Context / Core Foundation / Future Module). They cannot all be correct simultaneously.

The likely intent is: Core Platform provides "Reporting Foundation" (shared infrastructure: report generation engine, export service, scheduled reports). Individual modules provide module-specific reports using that foundation. There is no separate "Reporting" bounded context as a standalone domain.

**Required**: Consolidate. Remove "Reporting Context" from `bounded-contexts.md`. Update "Reporting Module (Future)" in `module-boundaries.md` to clarify it is a future consumer of the Core Reporting Foundation, not an independent bounded context.

---

### H2 — Workflow Engine Is a Black Box

**Files**: `docs/04-architecture/core-platform.md` (L177), `docs/03-domain/module-registry.md` (L202)

The Workflow Engine is referenced 15+ times across documents as a critical Core Platform service. Every module depends on it: Document approval (Archivi), Sample validation (Jawdati), Maintenance requests (Mahattati). It is marked "MVP" status — meaning it must be built in the first release.

Yet there is zero specification of:
- **Internal model**: State machine? BPMN? Custom JSON-configured process definition?
- **Definition storage**: Are workflow definitions in code or in the database?
- **Execution model**: Synchronous? Asynchronous? Can a workflow pause indefinitely (waiting for human action)?
- **Error handling**: What happens if a workflow step fails? Who is notified?

This is not a detail — it is an entire system that must be designed before any module that uses it can be specified.

**Required**: A PRD or design doc for the Workflow Engine at minimum specifying: definition format, execution model, persistence strategy, and the Task entity lifecycle (how a Task is assigned, accepted, completed, rejected, escalated).

---

### H3 — Audit Log Architecture Is Undefined

**Files**: `docs/03-domain/module-registry.md` (L206: "Audit Logs — MVP — Core"), `docs/05-development/engineering-principles.md` (L165)

Audit Logs are marked as an MVP Core requirement. Every document emphasizes traceability. But there is no specification of:
- **Schema**: What fields? (`who`, `when`, `what`, `before_value`, `after_value`, `action`, `entity_type`, `entity_id`, `organization_id`, `correlation_id`?)
- **Storage**: Same PostgreSQL database or separate append-only store?
- **Access pattern**: Who can query audit logs? (Admins only? Users can see their own? External compliance export?)
- **Retention policy**: How long are logs kept? Are old logs archived or deleted?
- **Performance**: High-volume audit logging can significantly impact write performance.

**Required**: Audit Log schema design in `docs/03-domain/` or as a PRD in `docs/10-prd/`. At minimum, a stable schema for the `audit_events` table before any MVP module is implemented.

---

### H4 — No API Versioning, Pagination, or Error Response Standard

**Files**: `docs/04-architecture/technology-decisions.md` (Decision 008), `docs/03-domain/ubiquitous-language.md` (L508)

The ubiquitous language correctly specifies API endpoint naming (`/organizations`, `/samples`). But the documents contain no specification for:
- **Versioning**: `/v1/samples`? Header-based versioning? URI versioning? No version at all initially?
- **Pagination**: Cursor-based? Offset-based? What is the response envelope? (`{ data: [], meta: { page, total, limit } }` ?)
- **Error responses**: RFC 7807 Problem Details? Custom format? What fields are required?
- **Filtering and sorting**: Query parameter conventions? (`?filter[status]=active&sort=-created_at`?)

Without a standard, the first three modules will implement three different pagination formats. This is guaranteed to happen.

**Required**: `docs/07-api/api-design-guidelines.md` must be written before any REST endpoint is implemented (it is currently an empty directory).

---

### H5 — `Correspondence` Is Not Defined in the Ubiquitous Language

**Files**: `docs/03-domain/ubiquitous-language.md`, `docs/03-domain/module-registry.md` (L294), `docs/03-domain/bounded-contexts.md` (L180)

`Correspondence` appears 6 times across domain documents as an entity owned by Archivi. It is never defined in the Ubiquitous Language, and `domain-model.md` lists it under the Archivi domain at line 124 but does not define its structure.

Critical ambiguities:
- Is Correspondence a subtype of Document, or a separate entity?
- Does Correspondence require a recipient (Organization/User)?
- Is "administrative correspondence" (letters between departments) the same concept as "external correspondence" (letters to government agencies)?
- Does Correspondence have a mandatory workflow (it appears to, based on product-principles.md L151)?

**Required**: Add `Correspondence` to the Ubiquitous Language with its official definition, distinguish it from `Document`, and specify whether it inherits Document's workflow or has a distinct lifecycle.

---

### H6 — No Soft Delete Strategy Anywhere

**Files**: All entity definitions across `docs/03-domain/`

Nudum handles regulated operational data (laboratory results, water quality measurements, audit records). These entities **cannot** be hard-deleted in a compliant system. Yet the word "delete" appears in the engineering principles (CRUD operations) without specifying soft delete.

Unresolved questions:
- Which entities support soft delete? (All? Only some?)
- What is the column name? (`deleted_at TIMESTAMPTZ`, `is_deleted BOOLEAN`?)
- Should soft-deleted records be hidden from normal queries automatically (base repository responsibility)?
- Can a soft-deleted entity be restored? By whom?
- Does deleting a parent cascade soft-delete to children?

**Required**: A short decision (ADR or addition to `database-design-rules.md`) specifying the soft delete strategy before any entity schema is designed.

---

### H7 — Module Registry Build Order Not Specified

**Files**: `docs/03-domain/module-registry.md`

The Module Registry lists Core modules as "Design" and marks some as "MVP". But no document specifies:
1. Which Core modules must exist before any business module can begin.
2. What is the minimum Core for an MVP of Mahattati?
3. What is the dependency order within Core? (Authentication must exist before Authorization. Authorization must exist before Workflow Engine. Etc.)

This is blocking for any developer who wants to start implementation.

**Required**: A build order / dependency graph. Minimum: a table showing "Module X requires Module Y to exist first" for all MVP modules.

---

### H8 — No Specification of How Modules Reference Cross-Context Entities

**Files**: `docs/03-domain/module-boundaries.md`, `docs/03-domain/bounded-contexts.md`

Module-boundaries.md correctly prohibits direct database access between modules. But it never specifies the **Anti-Corruption Layer (ACL)** pattern for how modules reference entities they don't own.

Example: A `Sample` in Jawdati is collected at a `Station` owned by Mahattati. If Jawdati needs to display the station name, does it:
1. Store a `station_id` and call Mahattati's Public API to fetch the station name? (real-time, network dependency)
2. Store a `station_id` + `station_name` snapshot at collection time? (denormalized, no cross-module dependency)
3. Subscribe to `StationUpdated` domain events to keep a local read model? (CQRS-lite)

Option 2 (snapshot at event time) is the DDD-correct approach for cross-context references, but it requires explicit specification. Without it, developers will default to option 1 (cross-module API calls), creating tight coupling the architecture explicitly prohibits.

**Required**: Add an explicit "Cross-Context Reference Pattern" section to `module-boundaries.md` specifying whether cross-context entity references use IDs only, ID+snapshot, or local read models.

---

### H9 — Scalability Risk: No Database Connection Pooling Strategy

**Files**: `docs/11-adr/ADR-0002-postgresql.md`, `docs/04-architecture/system-architecture.md`

NestJS + PostgreSQL without connection pooling is a known scalability bottleneck. Each NestJS instance opens its own connection pool. Under load with multiple app instances, the number of PostgreSQL connections exceeds the server's `max_connections` limit (typically 100 by default).

The ADR and system architecture documents never mention:
- **PgBouncer** (the standard PostgreSQL connection pooler)
- Maximum connections per instance
- Pool size tuning strategy
- Read replica routing for reporting queries

At 50 concurrent tenants doing laboratory analysis and document uploads simultaneously, this becomes critical.

**Required**: Add connection pooling strategy to ADR-0002 or a new infrastructure decision. For the on-premise deployment target (Algerian municipal infrastructure running on modest servers), this is especially important.

---

## MEDIUM

> These issues will not block initial implementation but will create technical debt or confusion within the first year of development.

---

### M1 — `API Gateway (Future)` in system-architecture.md Is Undocumented

**File**: `docs/04-architecture/system-architecture.md` (L68)

The ASCII architecture diagram shows an `API Gateway (Future)` layer between the internet and the frontend/backend. This component does not appear in any other document, any ADR, any planning document, or the module registry. There is no decision about which API Gateway (Kong, AWS API Gateway, NGINX, Traefik?) is intended, or what triggers its introduction.

An API Gateway at the infrastructure level is architecturally significant — it implies centralized auth enforcement, rate limiting, and routing at the infrastructure layer rather than the application layer. This conflicts partially with ADR-0006 (rate limiting at the application layer via `@nestjs/throttler`).

**Required**: Either remove `API Gateway (Future)` from the diagram and plan it as a future ADR, or write ADR-0012 defining the intent, timing, and responsibilities.

---

### M2 — Search Migration Trigger Is Undefined

**Files**: `docs/04-architecture/technology-decisions.md` (L390), `docs/11-adr/ADR-0002-postgresql.md`

Both documents say search will migrate from PostgreSQL FTS to Meilisearch/OpenSearch "when PostgreSQL capabilities are exceeded." No measurable threshold is defined. This means the migration will happen reactively (when search becomes slow in production), not proactively — typically the worst time to migrate.

Additionally, `technology-decisions.md` says "OpenSearch or Elasticsearch" while ADR-0002 says "Meilisearch or OpenSearch" — inconsistent candidates for the same migration path.

**Required**: Define the migration trigger in `ADR-0002` (e.g., "when full-text search queries exceed 500ms P95 or indexed documents exceed 500,000") and standardize on Meilisearch (simpler, self-hosted, MIT license) vs OpenSearch (more powerful, higher ops cost).

---

### M3 — Workflow Engine vs Domain Events: Overlap and Confusion

**Files**: `docs/04-architecture/core-platform.md`, `docs/11-adr/ADR-0001-modular-monolith.md`, `docs/11-adr/ADR-0004-nestjs.md`

The Core Platform defines both a "Workflow Engine" and an "Event Bus" as separate services. ADR-0001 says inter-module communication uses "Domain events on an internal event bus." ADR-0004 says NestJS EventEmitter is the event bus.

The distinction between these is never drawn:
- When should a business process use the **Workflow Engine** (multi-step, human-in-the-loop, stateful)?
- When should it use **Domain Events** (fire-and-forget, decoupled, not stateful)?
- Can domain events trigger workflow state transitions? If yes, how is idempotency guaranteed?

Developers will make inconsistent choices — some using events for things that should be workflow steps, and vice versa.

**Required**: A decision matrix or brief architecture note defining: "Use the Workflow Engine when the process has human actors, requires state persistence, or has compensating steps. Use Domain Events for side effects and cross-module notifications."

---

### M4 — Notification Architecture: Channel vs Content Ownership Unclear

**Files**: `docs/04-architecture/core-platform.md`, `docs/03-domain/ubiquitous-language.md` (L320-L338)

The ubiquitous language correctly separates `Notification` (content) from `Channel` (delivery). Core Platform owns notifications. But no document specifies:
- Who creates the notification content/template? (The business module? The Core Notification service?)
- How does a business module trigger a notification without knowing which channels a user has enabled?
- Are notification templates per-tenant or platform-wide?

A typical implementation decision: modules publish a `NotificationRequested` domain event with an event type and a data payload. Core Platform's Notification service resolves the template, the user's channel preferences, and delivers. This is the correct approach but it's not specified.

**Required**: Short specification of the Notification dispatch contract in `core-platform.md`. Minimum: what event does a module publish, and what data does it include.

---

### M5 — No Correlation ID / Distributed Tracing Strategy

**Files**: `docs/05-development/engineering-principles.md` (L165: mentions observability)

`engineering-principles.md` mentions observability as a requirement. But no document specifies:
- Whether every request gets a `X-Correlation-ID` header (critical for debugging in production)
- Whether background jobs carry a correlation ID through async processing chains
- Whether the correlation ID is included in audit log entries

Without this, debugging a failed multi-step workflow (e.g., "why did this document approval fail?") in production is extremely difficult.

**Required**: Add correlation ID strategy as a subsection of observability in `engineering-principles.md` or as a short note in the future `coding-standards.md`.

---

### M6 — RBAC vs ABAC Boundary Is Undefined

**Files**: `docs/04-architecture/technology-decisions.md` (Decision 010)

Decision 010 says: "Role-Based Access Control (RBAC). Future extensions: Attribute-Based Access Control (ABAC), Policy Engine."

This is architecturally consequential. The initial `Role` → `Permission` model defines what business users can do. But enterprise use cases immediately require attribute conditions: "User can approve Samples **only if** the sample belongs to their Laboratory." This is ABAC, not RBAC.

If the permission system is designed as pure RBAC initially and ABAC is bolted on later, it typically requires a breaking refactor of the permission check call site across the entire codebase.

**Required**: Define whether the initial permission system is designed to be **ABAC-ready** from the start (using a policy-aware permission service that can accept context parameters) even if only simple role checks are used initially. This is a design-time decision, not an implementation-time decision.

---

### M7 — Missing Entities in Ubiquitous Language

**Files**: `docs/03-domain/ubiquitous-language.md`

The following concepts appear in domain documents but are absent from the Ubiquitous Language:

| Missing Term | Referenced In |
|---|---|
| `Correspondence` | bounded-contexts.md, module-registry.md, domain-model.md |
| `Production Record` | module-registry.md (Mahattati owns it) |
| `Dosage` | domain-model.md (Jawdati — chemical dosage calculations) |
| `Deviation` | Referenced in LIMS context for out-of-spec results |
| `Certificate` | domain-model.md (Archivi) |
| `Corrective Action` | product-principles.md (L148) |
| `Calibration` | Implied by laboratory equipment management |
| `Incident` | Referenced in Mahattati operational context |

These will be inconsistently named in code without official definitions.

**Required**: Schedule a ubiquitous language extension pass before each module's PRD is written.

---

### M8 — `technology-decisions.md` Contains 4 Undocumented Decisions Not Yet in ADRs

**Files**: `docs/04-architecture/technology-decisions.md`, `docs/11-adr/`

The following decisions exist in `technology-decisions.md` but have no corresponding ADR:

| Decision # | Topic |
|---|---|
| 010 | RBAC / ABAC authorization model |
| 018 | Tesseract OCR as initial OCR engine |
| 019 | Notification channels and pluggable providers |
| 020 | Payment provider strategy |

These need ADRs (ADR-0011 is reserved for ORM per C1 above). Suggested: ADR-0012 (RBAC/ABAC), ADR-0013 (OCR), ADR-0014 (Notification providers), ADR-0015 (Payment).

---

## LOW

> Quality improvements and future-proofing items that can be addressed incrementally.

---

### L1 — No Core Module Build Order / MVP Dependency Graph

**Files**: `docs/03-domain/module-registry.md`

Core modules marked "Design" with some marked "MVP" but no dependency ordering. The implicit dependency chain is:
`Organizations → Authentication → Roles/Permissions → Users → [Workflow Engine, Notifications, Audit Logs, File Service]`

Explicitly documenting this prevents a developer from building the Workflow Engine before Authentication exists.

---

### L2 — System Architecture ASCII Diagram Should Have a Mermaid Version

**File**: `docs/04-architecture/system-architecture.md`

The architecture is described in ASCII art which does not render well on GitHub mobile, does not support hyperlinking, and is error-prone to maintain. The `docs/12-diagrams/` directory exists for this purpose. When diagrams are created, the ASCII diagram should be replaced with a reference to the Mermaid diagram.

---

### L3 — No Frontend Architecture Decisions (State, Routing, Forms)

**Files**: `docs/11-adr/ADR-0003-frontend-framework.md`

ADR-0003 lists recommended libraries (TanStack Query, Zustand, i18next) but does not specify:
- State boundary: what belongs in TanStack Query (server state) vs Zustand (client state)?
- Routing: React Router v6 structure — flat or nested? Module-based code splitting strategy?
- Form library: React Hook Form? Formik? Custom? Critical for complex laboratory forms.
- Component library: Headless UI? Radix UI? shadcn/ui? Or fully custom? RTL compatibility matters here.

These decisions will be made inconsistently across modules without specification.

---

### L4 — Module Registry Status "Planned" Has No Lifecycle Criteria

**File**: `docs/03-domain/module-registry.md`

The registry defines lifecycle statuses (Design, MVP, Stable, Deprecated) but no criteria for transitioning between them. What does "Stable" mean? 100% test coverage? No known bugs? External security audit? Certification by a customer?

---

### L5 — `project-philosophy.md` and `product-principles.md` Overlap Significantly

**Files**: `docs/00-foundation/project-philosophy.md`, `docs/01-product/product-principles.md`

Both documents cover modular design, documentation-first, API-first, multi-tenant, security-by-default, and extensibility. The distinction is blurred. `project-philosophy.md` should describe the *why* (values and intent). `product-principles.md` should describe the *what* (concrete rules). Currently both mix both concerns.

This is not critical but creates redundant reading for AI assistants and new contributors.

---

### L6 — Deployment Targets for On-Premise Are Under-Specified

**File**: `docs/04-architecture/technology-decisions.md` (Decision 011-012)

Decision 011 says "Docker-first deployment." Decision 012 says "Docker Compose → Kubernetes." But Algerian municipal infrastructure typically runs on:
- Bare metal Linux servers (Ubuntu or CentOS)
- VMware virtualized environments
- Older hardware with limited RAM

Docker Compose is appropriate but the minimum hardware requirements (RAM, CPU, disk) for a single-tenant on-premise deployment should be stated. A Workflow Engine + PostgreSQL + Redis + MinIO + NestJS + React stack has real minimum requirements.

---

## Decision Backlog (Missing ADRs)

The following decisions need formal ADRs before the corresponding modules can be implemented:

| # | Topic | Priority | Blocks |
|---|---|---|---|
| ADR-0011 | ORM + Database Migration Tool | **CRITICAL** | All implementation |
| ADR-0012 | RBAC/ABAC Permission System Design | HIGH | Auth module |
| ADR-0013 | API Design Standard (versioning, pagination, errors) | HIGH | All REST endpoints |
| ADR-0014 | Workflow Engine Internal Design | HIGH | Archivi, Jawdati, Mahattati MVP |
| ADR-0015 | Tenant Onboarding + Platform Admin Model | **CRITICAL** | All implementation |
| ADR-0016 | Audit Log Schema + Storage Strategy | HIGH | MVP Core |
| ADR-0017 | Soft Delete Strategy | HIGH | All entity design |
| ADR-0018 | OCR Provider (Tesseract initial) | MEDIUM | Archivi |
| ADR-0019 | Notification Provider Architecture | MEDIUM | Core |
| ADR-0020 | Payment Provider Strategy | LOW | Billing module |
| ADR-0021 | Search Migration Trigger + Target | MEDIUM | Scale milestone |
| ADR-0022 | Frontend Component + Form Library | MEDIUM | All UI |
| ADR-0023 | Cross-Context Reference Pattern | HIGH | Inter-module data reads |

---

## Prioritized Action Order

Execute in this sequence before writing any application code:

1. **ADR-0011** — ORM decision *(C1)*
2. **ADR-0015** — Tenant bootstrap + Platform Admin *(C2)*
3. **Deprecate `technology-decisions.md`** → create Decision Index pointing to ADRs *(C3)*
4. **Consolidate AI Context** → remove from bounded-contexts.md, keep in core-platform.md *(C4)*
5. **Consistency model** → add cross-aggregate consistency policy to architecture-principles.md *(C5)*
6. **Workflow Engine PRD** → document internal model before any module uses it *(H2)*
7. **Audit Log schema** → design before any module writes audit entries *(H3)*
8. **`docs/07-api/api-design-guidelines.md`** → write before any endpoint is implemented *(H4)*
9. **Ubiquitous Language** → add missing terms before each module's PRD *(H5 / M7)*
10. **Cross-Context Reference Pattern** → add to module-boundaries.md *(H8)*

---

*This audit covers the repository state as of commit `f8c0605`. It should be re-run after each major documentation milestone.*
