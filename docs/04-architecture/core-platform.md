---
title: Nudum Core Platform
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
references:
  - docs/04-architecture/system-architecture.md
  - docs/03-domain/bounded-contexts.md
  - docs/04-architecture/architecture-principles.md
---

# Nudum Core Platform

## Purpose

The Core Platform is the foundational layer of the Nudum ecosystem.

It provides the shared infrastructure, services, and business capabilities required by every module while remaining independent of any specific business domain.

The Core Platform enables modularity, consistency, scalability, and long-term maintainability.

Business modules extend the Core Platform but never replace or duplicate its responsibilities.

---

# Platform Vision

The Core Platform acts as the operating system of Nudum.

Its mission is to provide a stable foundation upon which independent business modules can be developed, deployed, and evolved without affecting one another.

Every business module depends on the Core Platform.

The Core Platform depends on none.

---

# Design Principles

The Core Platform follows these principles:

* Domain-independent
* Framework-independent
* Multi-tenant by design
* API-first
* Event-driven
* Security-first
* AI-ready
* Cloud-native
* On-Premise compatible
* Extensible without modification

---

# Platform Layers

```text
                   Nudum Platform

               ┌────────────────────┐
               │   Business Modules │
               └────────────────────┘
                         ▲
               ┌────────────────────┐
               │    Core Services   │
               └────────────────────┘
                         ▲
               ┌────────────────────┐
               │ Platform Foundation│
               └────────────────────┘
                         ▲
               Infrastructure Layer
```

Each layer builds upon the previous one.

Responsibilities never overlap.

---

# Platform Foundation

The Platform Foundation provides technical capabilities shared by the entire ecosystem.

Includes:

* Configuration
* Dependency Injection
* Logging
* Monitoring
* Metrics
* Caching
* Background Jobs
* Scheduling
* Health Checks
* Secrets Management
* Environment Management
* Feature Flags

Business modules never implement these capabilities independently.

---

# Identity Services

Responsible for digital identity across the platform.

Owns:

* Organizations
* Tenants
* Users
* Authentication
* Authorization
* Roles
* Permissions
* Sessions
* API Keys
* Personal Access Tokens

Every request passes through Identity Services.

---

# Organization Service

Represents institutional ownership.

Responsibilities include:

* Organization lifecycle
* Departments
* Organizational hierarchy
* Subscription ownership
* Data isolation
* Tenant configuration

Every business entity belongs to exactly one Organization.

---

# User Management

Responsibilities:

* User profiles
* Invitations
* Activation
* Password management
* MFA
* Session management
* Account recovery
* User preferences

User management is centralized.

Business modules only reference users.

---

# Authorization Engine

Provides policy-based access control.

Supports:

* RBAC (Role-Based Access Control)
* Resource permissions
* Context-aware authorization
* Future ABAC compatibility

Authorization logic must never be duplicated inside modules.

---

# Workflow Engine

The Workflow Engine executes business processes shared across modules.

Examples:

* Approval chains
* Review cycles
* Validation processes
* Escalations
* Automatic routing

Business modules define workflows.

The Core Platform executes them.

---

# Notification Service

Responsible for event delivery.

Supported channels:

* In-App
* Email
* Telegram
* WhatsApp
* Push Notifications
* SMS

Business modules publish notifications.

The Core Platform manages delivery.

---

# Search Service

Provides platform-wide search capabilities.

Supports:

* Full-text search
* Metadata search
* Semantic search
* AI-assisted search
* Cross-module search

Search indexes are maintained centrally.

---

# File Service

Responsible for document storage.

Capabilities include:

* Upload
* Download
* Versioning
* Metadata
* Virus scanning
* File preview
* Storage abstraction

Modules never interact directly with storage providers.

---

# Audit Service

Every important business action is recorded.

Examples:

* Login
* Logout
* Permission changes
* Record creation
* Record modification
* Approval actions

Audit data is immutable.

---

# Localization Service

Supports multilingual operation.

Initial languages:

* Arabic
* French
* English

Future languages can be added without modifying business modules.

Localization includes:

* UI
* Messages
* Validation
* Dates
* Numbers
* Units

---

# Reporting Foundation

Provides reusable reporting infrastructure.

Capabilities:

* Report templates
* Export engine
* PDF generation
* Excel generation
* Scheduled reports

Business modules provide data.

The Core Platform provides reporting infrastructure.

---

# AI Gateway

The AI Gateway centralizes all artificial intelligence capabilities.

Responsibilities:

* Model routing
* Prompt management
* Context assembly
* Rate limiting
* Token accounting
* Semantic retrieval
* AI provider abstraction

Supported providers may include:

* OpenAI
* Anthropic
* Google
* Local LLMs

Business modules never communicate directly with AI providers.

---

# Billing Foundation

Provides commercial infrastructure.

Owns:

* Plans
* Licenses
* Subscriptions
* Usage tracking
* Payment abstraction
* Invoice generation

Business modules remain independent of payment providers.

---

# Integration Framework

Provides standardized connectivity.

Supports:

* REST APIs
* GraphQL
* Webhooks
* Message Queues
* OPC-UA
* SCADA
* GIS
* ERP
* LDAP
* Email

Every external integration passes through this framework.

---

# Event Bus

The Event Bus enables asynchronous communication.

Business modules publish domain events.

Subscribers react independently.

Benefits:

* Loose coupling
* Better scalability
* Easier extensibility
* Fault isolation

---

# Security Services

Centralized platform security includes:

* Encryption
* Secret management
* Session security
* CSRF protection
* Rate limiting
* API security
* Password policies
* MFA
* Device management

Security policies remain centralized.

---

# Observability

Platform observability includes:

* Metrics
* Logs
* Distributed tracing
* Performance monitoring
* Error reporting
* Health dashboards

Operational visibility is built into the platform.

---

# Public Platform APIs

The Core Platform exposes reusable APIs.

Examples:

* Identity API
* Organization API
* Notification API
* Search API
* Workflow API
* Storage API
* Billing API
* AI API

Business modules consume these APIs without accessing internal implementations.

---

# Platform Rules

Business modules:

✅ Consume Core services.

✅ Publish business events.

✅ Own business logic.

Business modules must never:

❌ Implement authentication.

❌ Implement notification delivery.

❌ Implement billing.

❌ Implement search engines.

❌ Implement workflow execution.

❌ Implement AI provider integrations.

---

# Platform Evolution

The Core Platform evolves through:

* New shared services.
* Improved infrastructure.
* Enhanced security.
* Better developer experience.
* Greater scalability.

Business modules should benefit from Core improvements without requiring modification.

---

# Success Criteria

The Core Platform is successful when:

* Business modules remain independent.
* Shared services eliminate duplication.
* New modules can be added rapidly.
* Platform upgrades do not break business functionality.
* Infrastructure scales independently of business domains.
* AI and integrations remain provider-agnostic.

---

# Core Platform Statement

> **The Core Platform is the digital operating system of Nudum. It provides the shared capabilities that enable every business module to focus exclusively on delivering business value, while the platform guarantees security, scalability, interoperability, and operational consistency across the entire ecosystem.**
