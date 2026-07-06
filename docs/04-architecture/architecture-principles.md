---
title: Nudum Architecture Principles
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-04
category: Architecture
supersedes-note: "2026-07-04 — Principle 3 rewritten (Modular Monolith First → Product Ecosystem with full technical independence: repo/pipeline/Docker/domain/version per product, monorepo-first pragmatic path). Principles 21 (Marketplace as Front Door), 22 (Feature-to-Product Boundary), 23 (Mawaridi — Supplier Marketplace as a Distinct Product), and 24 (Public Gateway vs. Protected Shell) added. History & Lessons Learned section added, referencing the testnudum and nudum-platform prototypes."
references:
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/technology-decisions.md
  - docs/11-adr/ (Product Ecosystem migration ADR — to be filed)
---

# Nudum Architecture Principles

## Purpose

This document defines the architectural principles that govern the design and evolution of the Nudum platform.

These principles establish the long-term architectural direction of the project and provide a framework for making consistent technical decisions.

Whenever new technologies, modules, or integrations are introduced, they must align with these principles.

---

# History & Lessons Learned

Nudum went through an earlier prototype (internally referenced as `testnudum`) before the current codebase. That prototype is useful precedent, not dead history — it already attempted, and partly proved, key parts of this vision:

- **Per-module backend independence was real.** Each business module ran its own Vite/React app, its own Docker Compose stack, and its own PostgreSQL database (`mahatati_db`, `jawdati_db`, etc.). The Mahattati backend was even written in a different stack (Python/FastAPI) from the Core portal backend (Node/Express) — a working precedent for Principle 18 (Technology Independence).
- **The delivery mechanism was wrong and must not be repeated.** Modules were embedded into the main portal via `<iframe src="http://127.0.0.1:517x">` with `postMessage` for cross-frame communication, and the frontend router (`App.tsx`) still lazy-loaded every module page (`ArchifiApp`, `JawdatiApp`, `MahatatiApp`, `Marketplace`, `Login`, `Register`) inside one single-page application — reproducing the exact "one app, many pages" anti-pattern this document now forbids in Principle 3, just one layer lower (iframe instead of shared router). The correct evolution of that idea is: independent subdomains (`mahattati.nudum.com`) reached via short-lived SSO tokens issued by Core (see Principle 3 and Principle 21) — never iframes, never hardcoded `localhost`/private-IP URLs baked into product code.
- **A hardcoded JWT secret shipped in source (`server/src/index.ts`) was a critical, self-documented vulnerability** in that prototype's own audit report. Principle 13 (Security as Architecture) is written to make this class of mistake structurally harder to repeat: secrets belong in environment variables or a secret manager, never in a committed file, in this codebase or any product built on top of it.

Any future migration work may reuse the _business logic_ found in `testnudum`'s per-module backends where useful, but must not reuse its iframe-based integration layer or its secret-handling.

---

# Architecture Vision

> **Nudum is not an application; it is a service ecosystem (Product Ecosystem).**
> Each business module — Mahattati, Jawdati, Archivi, and every module added afterward — is an independently built, deployed, and versioned product. Modules share only the account, the identity/design system, and the Core Platform infrastructure. No module may be folded into another module's runtime, deployment pipeline, or codebase merely for convenience.

This statement is binding on every developer and every AI coding agent operating on this repository. If an implementation places two or more business modules inside a single deployable process (a single `AppModule`, a single frontend `pages/` folder, a single Docker image, a single release pipeline), that implementation violates this vision regardless of how clean its internal module boundaries look.

The ecosystem is entered through one place — the **Marketplace** (Principle 21) — the same way Google Workspace or Microsoft 365 present Gmail/Drive/Sheets or Outlook/Teams/SharePoint behind a single account and a single discovery hub, while each service remains its own product underneath. Any capability that could stand on its own as a product must be built as one (Principle 22), never absorbed into the Marketplace/Shell.

---

# 1. Platform Before Product

Nudum is an enterprise platform, not a single-purpose application.

The architecture must support the continuous addition of new business domains without requiring major redesign.

Every architectural decision should strengthen the platform rather than optimize only for current modules.

---

# 2. Modular Architecture

The platform is composed of independent business modules built on top of a shared Core Platform.

Each module owns its business domain while relying on common infrastructure services such as:

- Authentication
- Authorization
- Organizations
- Notifications
- Workflow Engine
- File Storage
- Search
- Audit Logs
- AI Services
- Billing

Business modules must never duplicate platform capabilities.

---

# 3. Product Ecosystem — Full Technical Independence

Nudum does not follow a Modular Monolith. Each business module is a fully independent product with its own:

- **Git repository** — no module's source code lives inside another module's repository, and no module lives inside a shared monorepo package that also contains sibling business modules. A shared repo is acceptable only for Core Platform libraries explicitly designed to be consumed by every product (see Principle 8).
- **CI/CD Pipeline** — each product builds, tests, and releases through its own pipeline. A pipeline failure or a deployment in one product must never block, delay, or require coordination with another product's pipeline.
- **Docker image** — each product ships as its own image with its own tag and its own release notes. No image may bundle the runtime of more than one business module.
- **Domain / Subdomain** — each product is reachable at its own subdomain, matching the Google/Microsoft 365 ecosystem model rather than a single-domain application:

  ```text
  nudum.com
  ├── marketplace.nudum.com   (or nudum.com/marketplace — discovery & purchase)
  ├── accounts.nudum.com      (identity, SSO, profile)
  ├── billing.nudum.com       (subscriptions, invoices, payment methods)
  │
  ├── mahattati.nudum.com     (independent product)
  ├── jawdati.nudum.com       (independent product)
  ├── archivi.nudum.com       (independent product)
  ├── mawaridi.nudum.com      (independent product — supplier/procurement marketplace, see Principle 23)
  └── <new-product>.nudum.com (every future product follows the same pattern)
  ```

- **Version** — each product has its own version number and its own changelog. Mahattati v3.2 and Jawdati v1.0 may exist simultaneously; neither version implies anything about the other.

A Modular Monolith may still be used temporarily as a _migration technique_ inside a single product's own repository (e.g. while splitting a large domain into smaller internal packages before it becomes its own product), but it must never span two or more of the three core business modules (Mahattati, Jawdati, Archivi) or any product added after them.

Microservices-level separation between products is not a future evolution step—it is the starting architecture.

> **Pragmatic implementation note:** "independent repository" describes the _runtime and release_ independence a product must have — it does not mandate a separate Git repository per product from day one. For a small team, a single Monorepo (as already configured via `pnpm-workspace.yaml` and `turbo.json`) is the recommended implementation: each product lives in its own `apps/<product>-api` and `apps/<product>-web` folder with its own `Dockerfile` and its own CI workflow gated by path filters (`paths:` triggers), so a change to one product never builds, tests, or deploys another. This keeps development controllable from one Antigravity workspace while preserving the real independence the principle requires. Splitting a product into its own repository becomes worthwhile only once a dedicated team owns it exclusively — not before.

---

# 4. Evolution Without Rewrite

The architecture must evolve incrementally.

Growth should occur by:

- Adding modules.
- Adding services.
- Introducing infrastructure improvements.

The platform should never require a complete rewrite to support larger deployments.

---

# 5. Domain-Driven Organization

Business domains define architectural boundaries.

Technical layers should support the domain—not dictate it.

Examples of business domains include:

- Operations
- Laboratory Management
- Quality
- Document Management
- Workflow
- Maintenance
- Reporting

Architecture should reflect how organizations actually operate.

---

# 6. API-Centric Architecture

Every business capability is exposed through well-defined APIs.

The Web Application, PWA, Mobile Applications, AI Agents, and third-party integrations all communicate through the same application layer.

Business logic must never depend on a specific client.

---

# 7. Event-Oriented Communication

Modules communicate through business events whenever appropriate.

Examples:

- SampleCreated
- AnalysisCompleted
- DocumentApproved
- MaintenanceScheduled
- WorkflowCompleted

Events describe business facts rather than implementation details.

Loose coupling increases maintainability.

---

# 8. Shared Core Platform

The Core Platform provides reusable services for every module.

Core services remain independent from business domains.

The Core should never contain module-specific logic.

Modules consume the Core.

The Core never depends on modules.

---

# 9. Multi-Tenant by Design

Multi-tenancy is a fundamental architectural capability.

Every organization operates within an isolated environment while sharing the same application instance.

Tenant isolation must exist across:

- APIs
- Database
- Storage
- Cache
- Search
- Background Jobs
- Notifications
- Audit Logs

Isolation is enforced by architecture rather than convention.

---

# 10. Cloud First

The primary deployment model is Software-as-a-Service.

Cloud deployment provides:

- Simplified onboarding.
- Centralized updates.
- Lower operational costs.
- Better scalability.

Cloud-first does not exclude other deployment models.

---

# 11. On-Premise Ready

Many organizations require local deployment due to security or regulatory requirements.

The same codebase must support:

- Cloud SaaS
- Private Cloud
- On-Premise
- Hybrid Deployments

Deployment strategy must remain independent from application logic.

---

# 12. AI as a Platform Service

Artificial Intelligence is implemented as a shared platform capability.

AI services should be reusable across all modules.

Examples include:

- Semantic Search
- OCR
- Knowledge Retrieval
- Document Summarization
- Recommendation Engines
- Predictive Analytics

AI belongs to the platform—not individual modules.

---

# 13. Security as Architecture

Security is built into the architecture rather than added afterward.

Architectural security includes:

- Identity Management
- Authorization
- Tenant Isolation
- Encryption
- Auditability
- Secure APIs
- Secret Management

Every architectural layer contributes to security.

---

# 14. Asynchronous Processing

Long-running tasks should execute asynchronously.

Examples include:

- OCR
- Report Generation
- Notifications
- AI Processing
- Search Indexing
- Data Imports
- Scheduled Jobs

User interfaces should remain responsive regardless of processing time.

---

# 15. Stateless Application Layer

Application services should remain stateless whenever possible.

Persistent state belongs in dedicated storage systems.

Stateless services improve scalability, deployment flexibility, and fault tolerance.

---

# 16. Scalability Through Architecture

Scalability should result from good architecture rather than expensive infrastructure.

The platform should support increasing numbers of:

- Users
- Organizations
- Documents
- Laboratory Results
- Notifications
- AI Requests

without fundamental redesign.

---

# 17. Progressive Enhancement

The architecture supports gradual adoption of advanced technologies.

Possible future enhancements include:

- Distributed services
- Kubernetes
- OpenSearch
- Message Brokers
- AI Agents
- Native Mobile Applications

Future improvements should extend the architecture rather than replace it.

---

# 18. Technology Independence

Business domains should remain independent of specific frameworks.

Technologies may evolve.

Business knowledge should remain stable.

Replacing infrastructure should have minimal impact on business logic.

---

# 19. Observability by Default

Operational visibility is a core architectural capability.

The platform should provide:

- Logging
- Metrics
- Distributed Tracing
- Health Checks
- Performance Monitoring
- Audit Trails

Systems cannot be operated effectively without observability.

---

# 20. Longevity

Architectural decisions should favor long-term sustainability over short-term convenience.

The objective is to build a platform capable of evolving for many years while preserving consistency, maintainability, and operational reliability.

---

# 21. Marketplace as the Front Door

The main portal (`nudum.com` / Shell) is not a login screen. It is a **Marketplace**: the single place where a customer discovers products, compares plans, purchases or cancels a subscription, and manages every product they own — the same role the Google Account / Workspace hub plays for Gmail, Drive, and Sheets, or the Microsoft 365 portal plays for Outlook, Teams, and SharePoint.

The Marketplace is itself a product with its own repository, pipeline, and domain (`marketplace.nudum.com` or an equivalent path on the root domain), owned by the Core Platform team. It is responsible for:

- Product discovery — descriptions, pricing, plan comparison for Mahattati, Jawdati, Archivi, and every product added later.
- Purchase and activation — triggers `Entitlements.activate()` through the Billing service once payment is confirmed (SATIM, Chargily, and future international gateways).
- Subscription management — upgrade, downgrade, cancel, renew.
- Unified entry point (SSO) — the only place a user signs in; from there they are handed off to whichever product subdomains they are entitled to.

A business module must never implement its own standalone signup, pricing, or payment screen. All of that lives in the Marketplace and is consumed by every product through Core Platform APIs.

---

# 22. Feature-to-Product Boundary

Before building any new capability, ask: **could this capability live as its own product, sold and versioned independently?**

If the answer is yes, it must be built as a new product in the Nudum ecosystem — its own repository, pipeline, Docker image, subdomain, and entry in the Marketplace and the Entitlements table — never as a new page, tab, or module bolted onto the Shell or onto an existing product.

The Shell (Marketplace + Accounts + Billing) is intentionally kept thin. It orchestrates discovery, identity, and entitlement — it must never accumulate business logic that belongs to a product. A Shell that grows business features is the first symptom of the platform regressing from a Product Ecosystem back into a single bloated application.

This principle is what allows Nudum to scale to dozens of products without ever becoming a monolith again.

---

# 23. Mawaridi — Supplier Marketplace as a Distinct Product

**Naming disambiguation (read this before touching either "Marketplace" or "Mawaridi" in code or docs):**

- **Marketplace** (Principle 21) = the Core discovery/purchase hub for Nudum's own SaaS products (Mahattati, Jawdati, Archivi, and future modules). It is part of the Shell, kept thin, and never carries independent business logic.
- **Mawaridi (موردي)** = a separate, self-contained product: a B2B supplier marketplace connecting vendors of water-treatment chemicals, desalination equipment, and laboratory supplies with buyers. It follows Principle 3 in full — its own repository/app folder, its own pipeline, its own Docker image, its own subdomain (`mawaridi.nudum.com`), its own database, its own version — exactly like Mahattati, Jawdati, and Archivi. It is a product _sold alongside_ the other three, not a feature _of_ the Marketplace.

These two names must never be used interchangeably in code, database columns, API routes, or documentation. A reviewer (human or AI agent) who sees `marketplace` in Mawaridi's codebase, or sees Mahattati/Jawdati/Archivi purchase logic inside a route named `mawaridi`, should treat it as a naming-boundary violation of this principle.

**Account and entitlement model — Mawaridi is intentionally different from the other three:**

- Core registration (`auth-api`) is universal and free. Creating a Nudum account never requires a subscription to anything.
- Mahattati, Jawdati, and Archivi remain **opt-in and paid**: `module_entitlements.status` defaults to `disabled` and only becomes `active` after a completed payment (Principle 21's Marketplace + Billing flow), per Principle 3/21.
- Mawaridi defaults to `active` on the `free` plan **automatically at registration** — no payment required to browse the marketplace or publish a single listing. Publishing more than one simultaneous listing (or accessing paid seller features such as featured/boosted listings) requires upgrading to a paid Mawaridi plan.

Because Mawaridi's entitlement is quota-based rather than purely binary, its entitlement record needs a `quota` field in addition to `status` and `plan_tier`:

```sql
-- extension to public.module_entitlements (Principle 21 schema), Mawaridi-specific fields
ALTER TABLE public.module_entitlements
  ADD COLUMN listing_quota INTEGER;  -- NULL for Mahattati/Jawdati/Archivi; 1 for Mawaridi free tier, higher/NULL(unlimited) for paid tiers

-- Row created automatically by auth-api right after successful registration:
INSERT INTO public.module_entitlements (organization_id, module_key, status, plan_tier, listing_quota, activated_at)
VALUES (:org_id, 'mawaridi', 'active', 'free', 1, now());
```

Mawaridi's own service enforces the quota (reject a second concurrent listing on the free plan) using the same `EntitlementGuard` pattern described earlier, reading `listing_quota` instead of a plain boolean check.

Prior art: an earlier AI Studio prototype (`nudum-platform`) explored this concept under the name "Marketplace" — its vendor-listing UI, category taxonomy (chemicals, lab equipment, desalination parts), and boosted-listing concept are valid design references for Mawaridi's frontend, but must be re-skinned under the `mawaridi` name and re-wired to the entitlement model above rather than its original `localStorage`-only mock logic.

---

# 24. Public Gateway vs. Protected Shell — Public Is an Auth State, Not a Hosting Location

The root domain (`nudum.com`) splits into two layers with different jobs:

- **Public Gateway** — the marketing surface: SSR/static pages describing each product (Mahattati, Jawdati, Archivi, Mawaridi), pricing, docs, and blog. Optimized for SEO, fast, and reachable without an account.
- **Protected Shell** — Accounts, Billing, and the subscription Marketplace (Principle 21). Everything here requires authentication.

**Critical rule:** the Public Gateway must never host another product's live data, catalog, or business logic — not even content that is itself meant to be public. "Public" describes an _authentication state_ a route can be in, not a _hosting location_. A product decides for itself, inside its own app, which of its own routes require login and which don't.

Concretely, for Mawaridi (Principle 23): both its public buyer-facing catalog and its authenticated seller dashboard live inside the same product, on the same domain, in the same repository/pipeline/Docker image — only the route's auth requirement differs:

```
mawaridi.nudum.com/            → public route, no login, SSR/SEO-optimized catalog
mawaridi.nudum.com/dashboard   → protected route, requires Auth + 'mawaridi' entitlement
```

The Public Gateway's role toward Mawaridi (and every other product) is limited to a teaser card with a description and a link out — never the catalog UI or data itself:

```
nudum.com  →  "Mawaridi" teaser card  →  links to  →  mawaridi.nudum.com
```

This is what makes Principle 3's "own repository/pipeline/Docker/domain" guarantee real: a violation here (the Public Gateway silently absorbing another product's public pages "because they don't require login anyway") is the same class of drift as merging two products into one `AppModule` — just one layer higher, and easier to miss in review because no login screen makes it look safe.

A new component supports this split at the Core level: a **Public API Router** — a cached, rate-limited, read-only gateway that public routes (in any product) can sit behind when they need to serve anonymous traffic at scale, kept separate from the authenticated internal API surface so an open catalog can never become a path into protected entitlement or billing data.

---

# Architectural Principle Statement

> **Architecture is the foundation upon which every feature is built. A strong architecture enables continuous growth, while a weak architecture limits the future before it arrives.**

Every architectural decision in Nudum must support modularity, scalability, maintainability, security, and long-term evolution.
