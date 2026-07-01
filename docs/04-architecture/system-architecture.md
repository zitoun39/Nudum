---
title: Nudum System Architecture
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
note: Frontend framework corrected to React + Vite per ADR-0003 (was incorrectly listed as Next.js)
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/technology-decisions.md
  - docs/04-architecture/core-platform.md
  - docs/11-adr/ADR-0003-frontend-framework.md
---

# Nudum System Architecture

## Purpose

This document defines the official system architecture of the Nudum platform.

It describes the logical architecture, physical architecture, deployment topology, infrastructure components, communication patterns, security boundaries, scalability model, and technology interactions.

It is the primary architectural reference for software engineers, DevOps engineers, AI coding assistants, and future contributors.

---

# Architectural Vision

Nudum is designed as a modular enterprise platform that supports:

* Cloud SaaS deployment
* On-Premise deployment
* Hybrid deployment
* Multi-tenancy
* High availability
* AI-native capabilities
* Modular business domains
* Long-term scalability

Architecture must remain stable while business modules evolve independently.

---

# Architecture Principles

The architecture follows these principles:

* API-First
* Modular Monolith (MVP)
* Evolution toward Distributed Services
* Domain-Driven Design
* Clean Architecture
* Event-Driven Communication
* Security by Design
* Cloud Native
* Infrastructure as Code
* Provider Independence

---

# System Overview

```text
                           Internet
                               │
                     Reverse Proxy / CDN
                               │
                      API Gateway (Future)
                               │
                ┌──────────────┴──────────────┐
                │                             │
         Frontend (React + Vite)          Mobile (PWA)
                │                             │
                └──────────────┬──────────────┘
                               │
                     Backend Application
                               │
      ┌──────────────┬──────────────┬──────────────┐
      │              │              │              │
 Core Platform   Business Modules  AI Gateway   Integration Layer
      │              │              │              │
      └──────────────┴──────┬───────┴──────────────┘
                             │
                    PostgreSQL Database
                             │
          Redis ─ Object Storage ─ Message Queue
                             │
                     Monitoring Stack
```

---

# Client Layer

The client layer provides user interaction.

Supported clients:

* Web Application
* Progressive Web App (PWA)
* Future Android Application
* Future iOS Application

All clients consume the same backend APIs.

Business logic never resides inside the client.

---

# Frontend

Recommended stack:

* React + Vite
* React
* TypeScript
* TailwindCSS
* TanStack Query
* Zustand
* i18next

Responsibilities:

* User Interface
* Forms
* Visualization
* Offline Cache
* PWA Features

The frontend contains presentation logic only.

---

# Progressive Web Application

PWA is the primary mobile strategy.

Capabilities:

* Offline Mode
* Local Cache
* Push Notifications
* Installable
* Background Sync
* Camera Access
* QR Code Scanning
* File Upload

Native Android applications remain optional.

---

# Backend

The backend implements business logic.

Responsibilities:

* APIs
* Authentication
* Authorization
* Domain Services
* Workflow Execution
* Validation
* Event Publishing
* Integrations

Backend remains independent from frontend technologies.

---

# Core Platform

Provides shared services:

* Identity
* Organizations
* Permissions
* Workflow
* Notifications
* Search
* Storage
* Billing
* AI Gateway
* Audit
* Localization

Business modules consume Core Platform services.

---

# Business Modules

Initial modules:

* Mahattati
* Jawdati
* Archivi

Future modules plug into the same architecture.

Business modules never communicate through database access.

---

# Database

Primary database:

PostgreSQL

Responsibilities:

* Transactional Data
* Relationships
* ACID Consistency
* Multi-Tenant Storage

Every business entity belongs to one tenant.

---

# Cache Layer

Redis

Responsibilities:

* Session Cache
* Query Cache
* Rate Limiting
* Temporary Data
* Background Jobs
* Distributed Locks

Redis is never the primary data source.

---

# Object Storage

Stores:

* Documents
* Images
* Reports
* Attachments
* Backups

Possible providers:

* MinIO
* S3-Compatible Storage
* Azure Blob
* Google Cloud Storage

Storage provider remains abstracted.

---

# Search Engine

Future search architecture:

* PostgreSQL Full Text Search (MVP)
* Meilisearch / OpenSearch (Future)

Search indexes are managed centrally.

---

# Background Processing

Asynchronous tasks include:

* Email
* Notifications
* Report Generation
* AI Processing
* Import Jobs
* Export Jobs
* Scheduled Tasks

Background processing must never block user requests.

---

# Event Bus

Internal communication uses domain events.

Examples:

SampleCollected

↓

AnalysisCompleted

↓

NotificationSent

↓

DashboardUpdated

Events reduce coupling.

---

# AI Gateway

Central AI abstraction layer.

Supports:

* OpenAI
* Anthropic
* Google
* Local Models

Responsibilities:

* Prompt Management
* Context Assembly
* Model Routing
* Token Accounting
* Rate Limiting
* Semantic Search

Business modules never call LLM providers directly.

---

# Notification Layer

Supported channels:

* In-App
* Email
* Telegram
* WhatsApp
* Push
* SMS

Delivery providers remain interchangeable.

---

# Integration Layer

External integrations:

* SCADA
* OPC-UA
* GIS
* ERP
* LDAP
* Email
* SMS
* REST APIs
* Webhooks

Every integration passes through standardized adapters.

---

# Security Architecture

Security includes:

* HTTPS Everywhere
* JWT Authentication
* Refresh Tokens
* MFA
* RBAC
* Audit Logs
* Encryption at Rest
* Encryption in Transit
* Secrets Management
* Rate Limiting
* API Validation

Security is enforced centrally.

---

# Multi-Tenancy

Architecture supports:

Organization

↓

Departments

↓

Business Modules

↓

Users

↓

Data Isolation

Every tenant has complete logical isolation.

Cross-tenant access is impossible.

---

# Deployment Models

Supported deployments:

## SaaS

Cloud-hosted by Nudum.

---

## On-Premise

Customer infrastructure.

---

## Hybrid

Mixed deployment.

---

# Containerization

Deployment uses:

* Docker
* Docker Compose (Development)
* Kubernetes (Future)

Infrastructure remains portable.

---

# CI/CD

Recommended pipeline:

Developer

↓

GitHub

↓

Pull Request

↓

Tests

↓

Static Analysis

↓

Docker Build

↓

Deployment

↓

Monitoring

Deployment should be fully automated.

---

# Monitoring

Recommended stack:

* Prometheus
* Grafana
* Loki
* OpenTelemetry
* Health Checks

Every service exposes metrics.

---

# Backup Strategy

Regular backups include:

* Database
* Object Storage
* Configuration
* Secrets
* Audit Logs

Recovery procedures must be documented and tested.

---

# Scalability Strategy

Growth path:

Modular Monolith

↓

Modular Services

↓

Distributed Services

↓

Cloud Scale

No business module should require redesign during this evolution.

---

# High Availability

Future architecture supports:

* Multiple Instances
* Load Balancing
* Rolling Updates
* Zero-Downtime Deployments
* Automated Recovery

---

# Disaster Recovery

Recovery objectives should include:

* Automated Backups
* Recovery Procedures
* Infrastructure Recreation
* Data Integrity Verification

---

# Technology Independence

Business logic remains independent of:

* Database vendor
* Cloud provider
* AI provider
* Notification provider
* Authentication provider

External technologies are replaceable.

---

# Architectural Decision Records

Major architectural changes require an ADR (Architecture Decision Record).

Architecture evolves through documented decisions rather than informal discussions.

---

# Future Evolution

Future improvements may include:

* Microservices
* CQRS
* Event Sourcing
* Edge Computing
* Federated AI
* Multi-Region Deployment

These evolutions should not invalidate existing business modules.

---

# Success Criteria

The architecture is successful when:

* New modules are easy to add.
* Existing modules remain independent.
* Deployments are repeatable.
* AI providers are interchangeable.
* Infrastructure scales horizontally.
* Security remains centralized.
* Business logic remains isolated.

---

# System Architecture Statement

> **Nudum is architected as a modular, AI-native, enterprise platform that combines domain-driven design, clean architecture, and cloud-native principles. Its architecture prioritizes long-term maintainability, independent module evolution, provider independence, and secure multi-tenant operation while enabling seamless deployment across SaaS, on-premise, and hybrid environments.**
