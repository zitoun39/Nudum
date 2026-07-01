# docs/

This directory contains all documentation for the Nudum platform.

Documentation is the **primary source of truth**. No implementation begins before its corresponding documentation is completed.

---

## Structure

| Section | Contents |
|---|---|
| [00-foundation/](./00-foundation/) | Vision, Mission, Project Philosophy |
| [01-product/](./01-product/) | Product Strategy, Product Principles |
| [02-business/](./02-business/) | Business Model |
| [03-domain/](./03-domain/) | Bounded Contexts, Domain Model, Ubiquitous Language, Module Registry, Module Boundaries |
| [04-architecture/](./04-architecture/) | System Architecture, Architecture Principles, Core Platform, Technology Decisions |
| [05-development/](./05-development/) | Engineering Principles, Development Workflow, Coding Standards, Branching Strategy |
| [06-security/](./06-security/) | Security Guidelines |
| [07-api/](./07-api/) | API Design Guidelines |
| [08-database/](./08-database/) | Database Design Rules |
| [09-deployment/](./09-deployment/) | Deployment, CI/CD, Monitoring, Backup |
| [10-prd/](./10-prd/) | Product Requirements Documents |
| [11-adr/](./11-adr/) | Architecture Decision Records |
| [12-diagrams/](./12-diagrams/) | Architecture Diagrams (Mermaid) |

---

## Source of Truth Priority

When documentation and code conflict, documentation wins until officially updated:

1. Vision & Mission
2. Project Philosophy
3. Product Principles
4. Engineering Principles
5. Architecture Principles
6. Technology Decisions (ADRs)
7. PRDs
8. Source Code

---

## Reading Guide for AI Assistants

Start with [`../AGENTS.md`](../AGENTS.md) before reading any section of this documentation.

Then follow this sequence:

1. `00-foundation/` — Understand the why
2. `03-domain/` — Understand the what (bounded contexts, ubiquitous language)
3. `04-architecture/` — Understand the how
4. `05-development/` — Understand the process
5. `11-adr/` — Understand the decisions
