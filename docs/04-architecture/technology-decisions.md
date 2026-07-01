---
title: Technology Stack and Strategic Decisions
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
references:
  - docs/04-architecture/system-architecture.md
  - docs/11-adr/
---

# ADR-000 — Technology Stack & Strategic Decisions

## Purpose

This document records the strategic technology decisions that define the technical foundation of the Nudum platform.

It explains why each technology has been selected, what alternatives were considered, and under which circumstances a decision may be revisited.

These decisions aim to maximize long-term maintainability, scalability, developer productivity, and operational reliability.

---

# Decision-Making Principles

Technology choices are evaluated according to the following criteria:

* Long-term sustainability
* Stability and maturity
* Strong ecosystem
* Community adoption
* Developer productivity
* Performance
* Security
* Scalability
* Ease of maintenance
* AI-assisted development compatibility

No technology is selected because it is fashionable.

Every technology must solve a real problem.

---

# Decision 001

## Programming Language

### Decision

**TypeScript**

### Rationale

Type safety improves maintainability.

Shared language between frontend and backend.

Excellent tooling.

Strong AI code generation support.

Large ecosystem.

### Alternatives

* JavaScript
* C#
* Java
* Go

---

# Decision 002

## Backend Framework

### Decision

**NestJS**

### Rationale

* Enterprise architecture
* Dependency Injection
* Modular structure
* Excellent TypeScript support
* Scalable
* Well suited for Domain-Driven Design
* Excellent testing capabilities

### Alternatives

* Express
* Fastify
* Laravel
* ASP.NET Core
* Spring Boot

---

# Decision 003

## Frontend Framework

### Decision

**React + Vite**

### Rationale

* Mature ecosystem
* Component architecture
* High performance
* Excellent TypeScript integration
* Strong community support
* Fast development experience

### Alternatives

* Angular
* Vue
* Svelte

---

# Decision 004

## UI Framework

### Decision

**Tailwind CSS**

### Rationale

* Utility-first
* Easy theming
* RTL support
* Small production bundles
* Excellent developer productivity

---

# Decision 005

## Primary Database

### Decision

**PostgreSQL**

### Rationale

* ACID compliant
* Advanced indexing
* JSON support
* Excellent reliability
* Strong enterprise adoption
* Suitable for SaaS

### Alternatives

* MySQL
* MariaDB
* SQL Server

---

# Decision 006

## Cache & Background Queue

### Decision

**Redis**

### Responsibilities

* Cache
* Session storage
* Background jobs
* Rate limiting
* Temporary data

---

# Decision 007

## Object Storage

### Decision

**MinIO**

### Rationale

S3-compatible.

Can be deployed locally.

Ideal for On-Premise installations.

Supports cloud migration.

---

# Decision 008

## API Style

### Decision

**REST API**

### Rationale

Simple.

Widely adopted.

Easy integration.

Excellent tooling.

GraphQL may be introduced later for specialized use cases.

---

# Decision 009

## Authentication

### Decision

JWT + Refresh Tokens

Future support:

* OAuth2
* OpenID Connect
* SAML

---

# Decision 010

## Authorization

### Decision

Role-Based Access Control (RBAC)

Future extensions:

* Attribute-Based Access Control (ABAC)
* Policy Engine

---

# Decision 011

## Deployment

### Decision

Docker-first deployment.

Every component should run in containers.

Advantages:

* Reproducibility
* Isolation
* Simplified deployment
* Easier maintenance

---

# Decision 012

## Orchestration

### Current

Docker Compose

### Future

Kubernetes

Kubernetes will only be adopted when deployment complexity justifies it.

---

# Decision 013

## Application Architecture

### Decision

Modular Monolith

### Rationale

* Faster development
* Easier debugging
* Lower operational cost
* Easier testing
* Preserves domain boundaries

Future migration to Microservices should occur only when operational requirements demand it.

---

# Decision 014

## Mobile Strategy

### Decision

Progressive Web App (PWA)

### Rationale

Single codebase.

Offline capability.

Push notifications.

Cross-platform support.

Native Android and iOS applications may be introduced later if specific device capabilities are required.

---

# Decision 015

## Internationalization

### Decision

Native multilingual architecture.

Official languages:

* Arabic (RTL)
* French
* English

Business logic must remain language-independent.

---

# Decision 016

## AI Integration

### Decision

AI is implemented as a shared platform service.

Supported providers may include:

* OpenAI
* Anthropic
* Google
* Local LLMs
* Future providers

The platform must remain provider-agnostic.

Changing AI providers must not require architectural changes.

---

# Decision 017

## Search

### Initial Decision

PostgreSQL Full-Text Search

### Future Evolution

OpenSearch or Elasticsearch for large-scale deployments.

Migration should occur only when search requirements exceed PostgreSQL capabilities.

---

# Decision 018

## OCR

### Initial Decision

Tesseract OCR

### Future Options

Cloud OCR services or specialized AI document understanding engines may be integrated while preserving a common abstraction layer.

---

# Decision 019

## Notifications

### Initial Channels

* In-App Notifications
* Email

### Future Channels

* WhatsApp
* Telegram
* SMS
* Push Notifications
* Microsoft Teams
* Slack

Notification providers must be pluggable.

---

# Decision 020

## Payment

### Initial Strategy

Support regional payment methods for local deployments while maintaining compatibility with international payment gateways.

Potential integrations include:

* Local payment providers
* Stripe
* Paddle
* Lemon Squeezy

Billing infrastructure must remain provider-independent.

---

# Decision 021

## Version Control

### Decision

Git + GitHub

GitHub serves as:

* Source Control
* Documentation Hub
* Issue Tracking
* Project Planning
* Release Management
* CI/CD Integration

Every change must be traceable.

---

# Decision 022

## AI-Assisted Development

Artificial Intelligence is an engineering accelerator.

Supported tools may include:

* Claude Code
* OpenAI Codex
* GitHub Copilot
* Gemini CLI
* Antigravity
* Future coding assistants

All AI-generated code must comply with the documented architecture, engineering standards, and coding conventions.

Documentation remains the authoritative source of truth.

---

# Reviewing Decisions

Technology decisions are not permanent.

A decision may be revised only when:

* It no longer satisfies project requirements.
* A clear technical advantage exists.
* Migration cost is justified.
* Documentation is updated before implementation.

Technology changes must be evolutionary, not disruptive.

---

# Technology Decision Statement

> **Technology is a strategic enabler, not the objective. Every tool, framework, and platform adopted by Nudum must simplify development, strengthen reliability, and preserve the project's ability to evolve for many years without unnecessary rewrites.**
