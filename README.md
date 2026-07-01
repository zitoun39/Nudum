# Nudum | نُظُم

> **Enterprise Modular SaaS Platform for Water Utilities, Quality Management, Laboratory Operations, Digital Archiving, and Institutional Governance.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Status: Foundation Documentation](https://img.shields.io/badge/Status-Foundation%20Documentation-orange.svg)](./docs/00-foundation/)
[![Platform: Multi-Tenant SaaS](https://img.shields.io/badge/Platform-Multi--Tenant%20SaaS-green.svg)](./docs/04-architecture/)

---

## What is Nudum?

**Nudum (نُظُم)** is a modern, AI-native, modular enterprise SaaS platform designed to help organizations digitize, manage, and optimize their operational activities through integrated business modules, intelligent workflows, and secure information management.

Built with a **Modular-First Architecture**, Nudum allows organizations to activate only the modules they need while sharing a unified authentication system, permissions, notifications, reporting, workflows, and audit logs.

---

## Business Modules

### 🚰 Mahattati (محطتي) — Operations Management

Monitoring and management of treatment plants, production facilities, operational indicators, maintenance activities, production records, and equipment lifecycle.

### 🧪 Jawdati (جودتي) — Laboratory & Quality Management (LIMS/QMS)

Physicochemical and microbiological laboratory workflows, sample management, quality control, chemical dosage calculations, laboratory reporting, and compliance with operational standards.

### 📁 Archivi (أرشيفي) — Enterprise Document Management

Secure document archiving, correspondence management, OCR indexing, version control, intelligent search, approval workflows, and institutional record management.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Backend | NestJS |
| Frontend | React + Vite |
| UI | Tailwind CSS |
| Database | PostgreSQL |
| Cache / Queue | Redis |
| Object Storage | MinIO (S3-compatible) |
| Authentication | JWT + Refresh Tokens |
| Architecture | Modular Monolith → Distributed Services |

Full rationale in [Technology Decisions](./docs/04-architecture/technology-decisions.md) and [ADRs](./docs/11-adr/).

---

## Repository Structure

```text
Nudum/
├── AGENTS.md                    ← AI assistant instructions (read this first)
├── README.md
├── docs/
│   ├── 00-foundation/           ← Vision, Mission, Philosophy
│   ├── 01-product/              ← Product strategy & principles
│   ├── 02-business/             ← Business model
│   ├── 03-domain/               ← DDD: bounded contexts, domain model, ubiquitous language
│   ├── 04-architecture/         ← System architecture, tech decisions, core platform
│   ├── 05-development/          ← Engineering principles, coding standards, workflow
│   ├── 06-security/             ← Security guidelines
│   ├── 07-api/                  ← API design guidelines
│   ├── 08-database/             ← Database design rules
│   ├── 09-deployment/           ← Deployment, CI/CD, monitoring, backup
│   ├── 10-prd/                  ← Product Requirements Documents
│   ├── 11-adr/                  ← Architecture Decision Records
│   └── 12-diagrams/             ← Architecture diagrams (Mermaid)
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

---

## Documentation

All documentation lives in [`docs/`](./docs/). It is the **primary source of truth** for this project.

| Section | Description |
|---|---|
| [Foundation](./docs/00-foundation/) | Vision, Mission, Project Philosophy |
| [Product](./docs/01-product/) | Product strategy and principles |
| [Business](./docs/02-business/) | Business model and commercial strategy |
| [Domain](./docs/03-domain/) | Bounded contexts, domain model, ubiquitous language |
| [Architecture](./docs/04-architecture/) | System architecture, core platform, technology decisions |
| [Development](./docs/05-development/) | Engineering principles, development workflow |
| [Security](./docs/06-security/) | Security guidelines |
| [API Design](./docs/07-api/) | API design guidelines and standards |
| [Database](./docs/08-database/) | Database design rules |
| [Deployment](./docs/09-deployment/) | Deployment, CI/CD, monitoring, backup |
| [PRDs](./docs/10-prd/) | Product Requirements Documents |
| [ADRs](./docs/11-adr/) | Architecture Decision Records |
| [Diagrams](./docs/12-diagrams/) | Architecture diagrams |

---

## Development Philosophy

> *"Documentation drives development. Architecture drives implementation. Business domains drive architecture. AI accelerates implementation but never invents architecture."*

This project follows a **Documentation-Driven Engineering (DDE)** approach:

1. Document the feature first.
2. Validate the architecture.
3. Generate code from specifications.
4. Review, test, and release.

**For AI Assistants:** Read [`AGENTS.md`](./AGENTS.md) before generating any output in this repository.

---

## Target Markets

| Phase | Market |
|---|---|
| Phase 1 | Algeria |
| Phase 2 | North Africa |
| Phase 3 | Middle East |
| Phase 4 | International SaaS |

---

## Current Status

**Phase: Foundation Documentation**

The project is establishing its complete documentation before implementation begins. See the [Module Registry](./docs/03-domain/module-registry.md) for lifecycle status of each module.

---

## License

Copyright © 2026 Abdelhak Zitoun. Licensed under the [MIT License](./LICENSE).

---

## Author

**Abdelhak Zitoun** — Founder of the Nudum Platform

> *"Build the documentation once. Generate the software many times."*
