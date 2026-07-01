---
title: "ADR-0003 — React + Vite as Frontend Framework"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
note: This ADR resolves the inconsistency between technology-decisions.md (React + Vite) and the original system-architecture.md (Next.js). React + Vite is the accepted decision.
references:
  - docs/04-architecture/technology-decisions.md
  - docs/04-architecture/system-architecture.md
  - docs/11-adr/ADR-0005-typescript.md
---

# ADR-0003 — React + Vite as Frontend Framework

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum requires a frontend framework for its web application and Progressive Web App (PWA). The frontend must:

- Support a complex, data-intensive enterprise UI (forms, tables, dashboards, document viewers).
- Support RTL layouts (Arabic) and multilingual i18n.
- Support offline capabilities (PWA / service workers).
- Be compatible with TypeScript.
- Enable fast development iteration.
- Have a strong ecosystem for state management, data fetching, and UI components.
- Support AI-assisted code generation effectively.

**Historical note**: An early draft of `system-architecture.md` incorrectly listed Next.js as the frontend choice. `technology-decisions.md` — the authoritative ADR document — has always specified React + Vite. This ADR formalizes the correct decision.

---

## Decision

> **We will use React + Vite as the frontend framework, delivering a Single Page Application (SPA).**

- **React** for the component model and ecosystem.
- **Vite** for build tooling (fast HMR, fast production builds, native ESM).
- **TypeScript** for type safety (shared types possible between frontend and backend).
- **Tailwind CSS** for styling (utility-first, RTL support, small bundles).
- **TanStack Query** for server state management and data fetching.
- **Zustand** for lightweight client-side state.
- **i18next** for internationalization (Arabic RTL, French, English).

---

## Rationale

- **React maturity**: Largest ecosystem of enterprise-grade UI components, charts, tables, and form libraries.
- **Vite speed**: Sub-second HMR, significantly faster than Webpack-based setups.
- **SPA is sufficient**: Nudum is a private enterprise application. SEO is not a requirement. Server-side rendering would add infrastructure complexity with no business benefit.
- **TypeScript alignment**: Same language as the NestJS backend. Shared type definitions can be extracted to a shared package.
- **PWA compatibility**: Vite's PWA plugin provides service workers, offline cache, and installability without a custom framework.
- **RTL support**: Tailwind CSS has native RTL support via `dir="rtl"` and logical properties.
- **AI-assisted development**: React + TypeScript is the most extensively trained technology pair in LLM training data, maximizing AI code generation quality.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Next.js | SSR/SSG complexity not justified. Nudum is a private authenticated SaaS — SEO is irrelevant. Adds server infrastructure complexity (Node.js server for SSR), complicates PWA, and increases deployment surface. |
| Angular | Steeper learning curve, opinionated architecture conflicts with our DDD approach. Smaller AI training data coverage. |
| Vue 3 | Smaller ecosystem for complex enterprise UI components (data grids, document viewers, chart libraries). |
| Svelte / SvelteKit | Smaller ecosystem and community. Limited AI code generation support compared to React. |

---

## Consequences

### Positive
- Fast development with Vite HMR.
- Rich React ecosystem for enterprise components.
- Simple SPA deployment (static files on CDN or Nginx).
- Full TypeScript integration.
- Native PWA support.

### Negative / Trade-offs
- No SSR means a white screen on initial load (mitigated by a loading skeleton).
- Bundle size must be carefully managed with code splitting per module.
- No built-in routing — React Router v6 will be used.

### Neutral
- The frontend communicates with the backend exclusively through the REST API. This decision does not affect backend architecture.
- GraphQL may be introduced for specific modules in a future ADR without replacing this decision.

---

## Compliance

- Architecture Principle 6: *API-Centric Architecture* — Frontend is a pure API consumer.
- Engineering Principle 3: *Business Logic Belongs to the Backend* — No business logic in React components.
- Product Principle 13: *Multilingual by Design* — i18next handles AR/FR/EN.

---

## Review Trigger

Reconsider if public-facing marketing pages require SEO (a separate Next.js marketing site would be created, not replacing this decision). Reconsider if native mobile capabilities beyond PWA scope are required.
