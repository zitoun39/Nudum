---
title: "ADR-0015 — Transition to Product Ecosystem Architecture"
status: Accepted
owner: Abdelhak Zitoun
last-updated: 2026-07-04
category: ADR
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/system-architecture.md
  - docs/11-adr/ADR-0001-modular-monolith.md
---

# ADR-0015 — Transition to Product Ecosystem Architecture

> **Status**: Accepted
> **Date**: 2026-07-04
> **Deciders**: Abdelhak Zitoun

---

## Context

Originally, under [ADR-0001](./ADR-0001-modular-monolith.md), Nudum was designed as a Modular Monolith. The backend was planned as a single deployable NestJS process containing all business modules, and the frontend was a single SPA containing route handlers for all pages.

However, feedback and prototype implementations (specifically `testnudum` and `nudum-platform`) revealed the following issues:

1. **Coupling Risks**: Even with modular folders, developers are tempted to leak boundaries through cross-module imports or database connections.
2. **Release Coordination**: Deploying or updating one business module (e.g. Mahattati) required rebuilding and deploying the entire application, forcing unnecessary testing and risk overhead on unaffected modules (e.g. Archivi).
3. **Scale Constraints**: Large utilities (like ADE Oran or SEAAL) require independent scaling, custom features, or local deployment of specific modules without deploying the whole SaaS stack.
4. **Marketplace Integration**: To sell Nudum as a modular suite, customers must be able to discover, buy, and subscribe to individual services (Mahattati, Jawdati, Archivi) under a unified identity framework.

---

## Decision

> **We will transition Nudum from a Modular Monolith to a Product Ecosystem with full technical independence per business module, managed pragmatically via a Monorepo-first setup.**

Each business module—Mahattati, Jawdati, Archivi, and the upcoming Mawaridi—is treated as an independent product.

### Key Structural Rules:

1. **Ecosystem Architecture**:
   - Each product is accessed via its own subdomain (e.g. `mahattati.nudum.com`, `jawdati.nudum.com`).
   - The root domain (`nudum.com`) hosts the **Public Gateway** (static marketing surface) and the **Protected Shell** (Central Accounts, Billing, and the Marketplace subscription portal).
   - SSO authentication is centralized. A user logs in once at the Core Portal (`accounts.nudum.com`) and receives an SSO handoff to the product subdomains they are entitled to.

2. **Technical Independence**:
   - Each product builds, tests, and deploys its own runtime container images.
   - Products maintain separate database schemas (`tenant_[org_id]` in isolated namespaces) to prevent direct cross-product database reads/writes.

3. **Pragmatic Monorepo Setup**:
   - A single Monorepo (using `pnpm` workspaces and `turbo.json`) is maintained for development efficiency.
   - Separate services live in distinct workspaces (e.g., `apps/mahattati-api`, `apps/jawdati-api`).
   - CI/CD pipelines use path-based filtering (`paths:` triggers) to build and deploy only the modified products.

---

## Rationale

- **Strict Boundaries**: Eliminates logical import pollution between modules.
- **Independent Lifecycles**: A bug or deployment failure in `Jawdati` has zero impact on `Mahattati` operations.
- **Enterprise Suitability**: Supports hybrid architectures where a client runs `Mahattati` on-premise at a plant while consuming `Archivi` from the Nudum Cloud.
- **Monorepo Feasibility**: Single Git repository keeps code sharing (via common packages like `packages/ui` or `packages/tsconfig`) easy for a small team, avoiding multiple repository synchronization overhead.

---

## Alternatives Considered

| Option                  | Reason Not Chosen                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| Pure Multi-Repo         | High overhead for code sharing, package updates, and developer environment setup in the early foundation phase. |
| Strict Modular Monolith | Failed to support independent module deployment, custom subdomains, and selective module purchase structures.   |

---

## Consequences

### Positive

- True microservice runtime isolation per business product.
- Independent deployment cycles and custom release tags.
- Flexible pricing and entitlement models (e.g., free quotas for Mawaridi vs. paid subscription tiers for Mahattati).
- Scale-out ready for future dedicated engineering teams.

### Negative / Trade-offs

- Increased complexity in setting up local Docker compose files with multiple API and web frontends.
- Centralized auth tokens must be shared securely across subdomains.

### Neutral

- Standardizes on Turborepo/pnpm monorepo structure.

---

## Compliance

- Ref: `docs/04-architecture/architecture-principles.md` — Principle 3 (Product Ecosystem)
- Ref: `docs/04-architecture/architecture-principles.md` — Principle 21 (Marketplace as Front Door)
- Ref: `docs/04-architecture/architecture-principles.md` — Principle 22 (Feature-to-Product Boundary)
- Ref: `docs/04-architecture/architecture-principles.md` — Principle 23 (Mawaridi)
- Ref: `docs/04-architecture/architecture-principles.md` — Principle 24 (Public Gateway vs. Protected Shell)

---

## Review Trigger

This decision should be reconsidered when:

- The team scales to a size where maintaining a single Monorepo causes Git commit congestion, at which point specific products can be migrated to independent Git repositories.
