---
title: Nudum Bounded Contexts
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
references:
  - docs/03-domain/domain-model.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/module-registry.md
---

# Nudum Bounded Contexts

## Purpose

This document defines the bounded contexts of the Nudum platform.

Each bounded context represents an independent business domain with its own language, business rules, data ownership, and lifecycle.

A bounded context is the highest level of functional isolation within the platform.

Modules may collaborate, but they must not violate the boundaries defined in this document.

---

# Architectural Philosophy

Nudum follows a Domain-Driven Design (DDD) approach.

The platform is divided into business domains rather than technical layers.

Each bounded context:

* Owns its business rules.
* Owns its data.
* Owns its APIs.
* Owns its workflows.
* Owns its domain events.

No bounded context should directly manipulate another context's internal data.

Communication occurs through APIs, domain events, or shared platform services.

---

# Platform Structure

```text
                           Nudum Platform
                                 │
 ┌───────────────────────────────────────────────────────────────┐
 │                       Core Platform                           │
 └───────────────────────────────────────────────────────────────┘
      │            │             │              │
      ▼            ▼             ▼              ▼
 Mahattati      Jawdati      Archivi      Future Modules
```

The Core Platform provides common services.

Business logic belongs to the business contexts.

---

# Core Platform Context

## Responsibility

The Core Platform contains shared capabilities used by every module.

### Owns

* Organizations
* Users
* Authentication
* Authorization
* Roles
* Permissions
* Settings
* Localization
* Billing
* Notifications
* Audit Logs
* Workflow Engine
* Search
* File Storage
* AI Gateway

### Does NOT Own

* Laboratory analyses
* Stations
* Documents
* Equipment
* Samples

Those belong to their respective business contexts.

---

# Mahattati Context

## Responsibility

Manage operational facilities and production activities.

### Owns

* Sites
* Stations
* Production Units
* Equipment
* Sensors
* Measurements
* Operational Logs
* Maintenance Records
* Production Indicators

### Consumes

* Users
* Notifications
* Workflows
* Documents

### Publishes Events

* StationCreated
* EquipmentInstalled
* ProductionRecorded
* MaintenanceScheduled
* MaintenanceCompleted

---

# Jawdati Context

## Responsibility

Manage laboratory operations and quality assurance.

### Owns

* Laboratories
* Samples
* Analyses
* Test Methods
* Laboratory Results
* Quality Indicators
* Chemical Calculations
* Validation Rules

### Consumes

* Users
* Documents
* Workflows
* Notifications

### Publishes Events

* SampleCollected
* AnalysisStarted
* AnalysisCompleted
* ResultValidated
* LaboratoryReportIssued

---

# Archivi Context

## Responsibility

Manage institutional documents and digital records.

### Owns

* Documents
* Correspondence
* Digital Archive
* Folders
* Tags
* Metadata
* Document Versions
* Retention Policies

### Consumes

* Users
* Organizations
* Workflow Engine

### Publishes Events

* DocumentUploaded
* DocumentApproved
* DocumentArchived
* DocumentExpired

---

# Reporting Context

## Responsibility

Generate operational insights.

### Owns

* Dashboards
* Reports
* KPIs
* Analytics
* Data Aggregations

This context consumes data from other contexts without owning their business entities.

---

# AI Context

## Responsibility

Provide intelligent platform services.

### Owns

* AI Sessions
* Prompt Templates
* AI Models Configuration
* Semantic Indexes
* Knowledge Retrieval

AI never owns operational business entities.

It consumes authorized data only.

---

# Integration Context

## Responsibility

Manage communication with external systems.

Examples include:

* SCADA
* ERP
* GIS
* Payment Providers
* WhatsApp
* Telegram
* Email
* SMS

This context translates external protocols into internal business events.

---

# Billing Context

## Responsibility

Manage subscriptions and commercial operations.

### Owns

* Plans
* Subscriptions
* Licenses
* Invoices
* Usage Metrics
* Payments

Billing remains completely independent of business modules.

---

# Shared Language

Each bounded context defines its own terminology.

Example:

Within Jawdati:

"Sample" has a precise laboratory meaning.

Within Archivi:

"Document" has a precise archival meaning.

Contexts must not redefine each other's concepts.

---

# Context Relationships

```text
                      Core Platform
                            │
      ┌──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
 Mahattati      Jawdati       Archivi      Billing
      │              │              │
      └──────┬───────┴───────┬──────┘
             ▼               ▼
         Reporting       AI Services
             │
             ▼
        Integrations
```

Dependencies always point toward the Core Platform.

Business contexts communicate through contracts—not direct database access.

---

# Data Ownership Rules

Each business entity has one authoritative owner.

Examples:

* Sample → Jawdati
* Equipment → Mahattati
* Document → Archivi
* User → Core Platform
* Subscription → Billing

No duplicate ownership is permitted.

---

# Communication Rules

Contexts communicate using:

* REST APIs
* Domain Events
* Shared Core Services

Direct database access across contexts is prohibited.

---

# Evolution Strategy

Future modules should be introduced as new bounded contexts rather than expanding existing ones.

Examples:

* Asset Management
* Procurement
* Fleet Management
* GIS
* Compliance
* Risk Management
* Incident Management

The architecture must scale through new contexts without modifying existing boundaries.

---

# Boundary Integrity

A bounded context may evolve internally without affecting other contexts, provided its public contracts remain stable.

Stable boundaries are more valuable than shared implementations.

---

# Bounded Context Statement

> **A bounded context is the highest level of business ownership within Nudum. Clear boundaries preserve modularity, protect business integrity, and enable the platform to evolve without unnecessary coupling.**
