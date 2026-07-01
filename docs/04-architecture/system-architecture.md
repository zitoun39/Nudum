---
title: Nudum System Architecture
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
note: Core architecture updated to reflect Schema-Per-Tenant multi-tenancy, stateful token revocation, dynamic connections, and code-managed prompt templates.
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/technology-decisions.md
  - docs/04-architecture/core-platform.md
  - docs/11-adr/ADR-0003-frontend-framework.md
  - docs/11-adr/ADR-0008-jwt-auth.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0010-ai-gateway.md
  - docs/11-adr/ADR-0011-orm-and-migrations.md
  - docs/11-adr/ADR-0012-platform-bootstrap.md
---

# Nudum System Architecture

## Purpose

This document defines the official system architecture of the Nudum platform.

It describes the logical architecture, physical architecture, deployment topology, infrastructure components, communication patterns, security boundaries, scalability model, and technology interactions.

It is the primary architectural reference for software engineers, DevOps engineers, AI coding assistants, and future contributors.

---

## Architectural Vision

Nudum is designed as a modular enterprise platform that supports:
* Cloud SaaS deployment
* On-Premise deployment
* Hybrid deployment
* Schema-based Multi-tenancy
* High availability
* AI-native capabilities
* Modular business domains
* Long-term scalability

---

## Architecture Principles

The architecture follows these principles:
* API-First
* Modular Monolith (Initial Phase)
* Evolution toward Distributed Services
* Domain-Driven Design (DDD)
* Clean Architecture
* Event-Driven Communication
* Security by Design
* Cloud Native
* Provider Independence (AI, Storage, Notifications)

---

## System Overview

```text
                           Internet
                              │
                    Reverse Proxy / CDN
                              │
                 ┌────────────┴────────────┐
                 │                         │
          Frontend (React + Vite)     Mobile (PWA)
                 │                         │
                 └────────────┬────────────┘
                              │
                    Backend Application (NestJS)
                              │
       ┌──────────────┬───────┴──────┬──────────────┐
       │              │              │              │
  Core Platform   Business Modules  AI Gateway   Integration Layer
       │              │              │              │
       └──────────────┴───────┬──────┴──────────────┘
                              │
                         PgBouncer
                              │
                     PostgreSQL Database 
              (Isolated schemas per organization)
                              │
           Redis ─ Object Storage ─ Message Queue
                              │
                      Monitoring Stack
```

---

## Client Layer

The client layer provides user interaction.

Supported clients:
* Web Application (React SPA)
* Progressive Web App (PWA)
* Future Native Applications

All clients consume the same backend APIs. Business logic never resides inside the client.

---

## Frontend

* **Framework**: React + Vite (Single Page Application).
* **State Management**: TanStack Query (server state), Zustand (client UI state).
* **Styling**: Tailwind CSS (utility-first, native RTL/LTR configuration).
* **Internationalization**: i18next (preconfigured for Arabic RTL, French, English).
* **Cabs/PWA**: Service workers for background sync and offline local caching.

---

## Backend Application

The backend is built as a Modular Monolith in Node.js using NestJS and TypeScript.

- **Encapsulation**: Each bounded context maps to an isolated NestJS module.
- **Dependency Injection**: Enforces clean boundaries and testable services.
- **Data Access**: Managed via TypeORM (see ADR-0011). Connection pooling is handled via PgBouncer.
- **Dynamic Routing**: Connection manager intercepts incoming requests, resolves organization context from the validated cookie-based JWT, and routes database queries to the target tenant's PostgreSQL schema using an `AsyncLocalStorage` transaction context.

---

## Multi-Tenancy Architecture

Nudum uses a **Schema-Per-Tenant** multi-tenancy model:
- **Tenant Isolation**: Each organization's database tables reside in a dedicated PostgreSQL schema (`tenant_[organization_id]`). Cross-tenant database queries are physically impossible.
- **Shared Data**: Global reference tables, organization registrations, global audit logs, and billing metadata reside in a shared `public` schema.
- **Provisioning**: Platform Administrators (system users operating in the `public` schema context) provision new organizations by executing a dynamic script that runs DDL statements cloning the `tenant_template` schema structure.
- **Backups**: Standard DB backup tools (`pg_dump`) can target individual tenant schemas for isolated recovery without impacting other clients.

---

## Authentication and Security

- **Identity Services**: Centralized within the Core Platform module.
- **Tokens**: Asymmetric RS256 JWT access token (15-minute lifetime) and opaque refresh token (30-day lifetime).
- **Transport**: Both tokens are transported via browser-secured `HttpOnly`, `Secure`, `SameSite=Strict` cookies to block XSS extraction.
- **Revocation**: Active sessions are validated against a Redis blacklist. Upon logout, account suspension, or password change, the session context is immediately revoked.

---

## AI Gateway and Prompt Architecture

- **Centralized Gateway**: Core Platform service acting as a provider-agnostic wrapper (OpenAI, Anthropic, Google, local Ollama). It handles routing, token counting, cost metrics, and caching.
- **Prompt Isolation**: Prompt templates, variable compiler logic, and response parsers reside inside the specific codebase of the business modules (Jawdati, Mahattati, Archivi). This ensures prompts and code parsers are versioned together in Git, preventing database-prompt sync drift.

---

## Infrastructure and Caching

- **PostgreSQL**: Primary transactional database, using PgBouncer for database connection pooling in transaction mode.
- **Redis**: Handles session cache, dynamic rate-limiting state, query caching, and BullMQ background queues.
- **MinIO**: Default S3-compatible object storage for binary files (PDFs, images, raw scans). Abstracted to allow cloud migrations to AWS S3 or Azure Blob.

---

## Observability and Observability

- **Distributed Tracing**: Every incoming HTTP request is assigned a unique `X-Correlation-ID` header.
- **Propagation**: The correlation ID is propagated to all application logs, database queries, background BullMQ jobs, and audit logs.
- **Logging**: Centralized logs using winston/nestjs logger, exported to Loki/Grafana.

---

## System Architecture Statement

> **Nudum's system architecture combines a Modular Monolith backend (NestJS/TypeScript) and a React SPA frontend, backed by PostgreSQL schema-per-tenant isolation, Redis cache queues, and MinIO object storage. The system guarantees absolute multi-tenant data isolation, XSS protection via HttpOnly cookie JWTs, code-managed prompt safety, and cloud/on-premise deployment portability.**
