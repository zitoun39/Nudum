---
title: Nudum Module Boundaries
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
references:
  - docs/03-domain/domain-model.md
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/module-registry.md
---

# Nudum Module Boundaries

## Purpose

This document defines the ownership, responsibilities, interaction rules, and boundaries of every module within the Nudum platform.

Each module represents an autonomous business capability with clearly defined responsibilities.

A module must never implement or own functionality that belongs to another module.

Module boundaries preserve architectural integrity, reduce coupling, and enable long-term scalability.

---

# Architectural Principle

Every business capability belongs to exactly one module.

Each module:

* Owns its business logic.
* Owns its entities.
* Owns its APIs.
* Owns its workflows.
* Owns its domain events.
* Owns its validations.

Shared capabilities belong exclusively to the Core Platform.

---

# Platform Overview

```text
                        Nudum Platform

                         Core Platform
                               │
     ┌───────────────┬───────────────┬───────────────┐
     │               │               │               │
 Mahattati       Jawdati        Archivi       Future Modules
```

Modules communicate through public contracts rather than internal implementations.

---

# Core Platform

## Mission

Provide reusable infrastructure and shared services.

## Owns

* Organizations
* Users
* Authentication
* Authorization
* Roles
* Permissions
* Notifications
* Workflow Engine
* Search
* File Storage
* Localization
* Billing
* Audit Logs
* Settings
* AI Gateway

## Does Not Own

* Stations
* Equipment
* Samples
* Analyses
* Documents
* Reports
* Laboratory Calculations

---

# Mahattati

## Mission

Manage operational facilities, production, and infrastructure.

## Owns

* Sites
* Stations
* Production Units
* Equipment
* Sensors
* Measurements
* Maintenance Plans
* Maintenance Records
* Operational Logs
* Production Statistics

## Responsibilities

* Monitor station operations.
* Track production.
* Manage equipment lifecycle.
* Schedule maintenance.
* Record operational measurements.
* Generate operational indicators.

## Cannot Own

* Laboratory samples
* Laboratory analyses
* Laboratory calculations
* Documents
* User management
* Billing

## Public Services

Provides:

* Station Information
* Equipment Information
* Operational Status
* Maintenance Status

---

# Jawdati

## Mission

Manage laboratory activities and quality assurance.

## Owns

* Laboratories
* Samples
* Analyses
* Results
* Test Methods
* Laboratory Instruments
* Chemical Calculations
* Quality Indicators
* Compliance Evaluations

## Responsibilities

* Register samples.
* Execute analyses.
* Validate results.
* Calculate chemical dosages.
* Monitor compliance.
* Produce laboratory reports.

## Cannot Own

* Stations
* Equipment maintenance
* Users
* Documents
* Billing
* Notifications

## Public Services

Provides:

* Laboratory Results
* Water Quality Indicators
* Compliance Status
* Laboratory Reports

---

# Archivi

## Mission

Manage institutional documents and organizational knowledge.

## Owns

* Documents
* Correspondence
* Digital Archive
* Folders
* Tags
* Metadata
* Document Versions
* Retention Policies

## Responsibilities

* Archive documents.
* Organize information.
* Preserve document history.
* Enable enterprise search.
* Manage document lifecycle.

## Cannot Own

* Samples
* Equipment
* Laboratory Results
* Production Data
* Billing
* User Management

## Public Services

Provides:

* Document Search
* Document Retrieval
* Version History
* Metadata Access

---

# Reporting Module (Future)

## Mission

Generate dashboards and reports.

## Owns

* Report Definitions
* Dashboard Layouts
* KPI Definitions
* Data Aggregations

The Reporting module never owns operational data.

It consumes data from other modules.

---

# AI Module (Future)

## Mission

Provide intelligent platform-wide services.

## Owns

* AI Sessions
* Prompt Templates
* Knowledge Indexes
* Semantic Search
* AI Configuration

AI never becomes the owner of business entities.

---

# Billing Module (Future)

## Mission

Manage commercial operations.

## Owns

* Plans
* Subscriptions
* Licenses
* Invoices
* Payment Records
* Usage Metrics

Billing never accesses business entities directly.

---

# Module Communication Rules

Modules communicate through:

* Public APIs
* Domain Events
* Shared Core Services

Direct database access between modules is prohibited.

Internal services are never called directly across module boundaries.

---

# Ownership Matrix

| Business Entity | Owner Module  |
| --------------- | ------------- |
| Organization    | Core Platform |
| User            | Core Platform |
| Role            | Core Platform |
| Permission      | Core Platform |
| Site            | Mahattati     |
| Station         | Mahattati     |
| Equipment       | Mahattati     |
| Measurement     | Mahattati     |
| Maintenance     | Mahattati     |
| Laboratory      | Jawdati       |
| Sample          | Jawdati       |
| Analysis        | Jawdati       |
| Result          | Jawdati       |
| Test Method     | Jawdati       |
| Document        | Archivi       |
| Folder          | Archivi       |
| Tag             | Archivi       |
| Version         | Archivi       |
| Subscription    | Billing       |
| Invoice         | Billing       |

No entity may have multiple owners.

---

# Cross-Module Access

Modules may read information exposed by other modules through public contracts.

Example:

Mahattati → may request laboratory compliance status from Jawdati.

Jawdati → may request station information from Mahattati.

Archivi → may attach documents to any module through document references.

The requesting module never becomes the owner of external data.

---

# Shared Services

Shared services are provided exclusively by the Core Platform.

Examples include:

* Authentication
* Authorization
* Notifications
* Workflow Engine
* File Storage
* Search
* Localization
* Audit Logging
* AI Gateway

Business modules consume these services without reimplementing them.

---

# Domain Events

Modules exchange information using business events.

Examples:

Mahattati publishes:

* StationCreated
* EquipmentInstalled
* MaintenanceCompleted

Jawdati publishes:

* SampleCollected
* AnalysisCompleted
* ResultValidated

Archivi publishes:

* DocumentUploaded
* DocumentApproved

Consumers react to events without modifying the publisher's internal state.

---

# Dependency Rules

Allowed dependency direction:

```text
Business Module
        │
        ▼
 Core Platform

Business Module
        │
        ▼
 Public API / Domain Events
        │
        ▼
Another Business Module
```

Forbidden:

```text
Mahattati
        │
        ▼
Direct Database Access
        │
        ▼
Jawdati
```

Direct access to another module's database or internal services is prohibited.

---

# Future Modules

Every new module must:

* Own a distinct business domain.
* Define its public APIs.
* Publish domain events.
* Respect existing boundaries.
* Avoid duplicate business logic.

If a capability belongs to an existing module, it must not be implemented elsewhere.

---

# Boundary Governance

Any proposal to modify module ownership must:

1. Update the Domain Model.
2. Update this document.
3. Review architectural impact.
4. Preserve backward compatibility where possible.

Architectural boundaries are considered strategic assets.

---

# Module Boundary Statement

> **A module is the sole owner of its business domain. Clear ownership, explicit contracts, and disciplined boundaries ensure that Nudum remains modular, maintainable, and scalable as new capabilities are added over time.**
