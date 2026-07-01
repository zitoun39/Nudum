---
title: Nudum Module Registry
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
note: Core module statuses corrected from 'Stable' to 'Design' — no implementation exists yet
references:
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/domain-model.md
---

# Nudum Module Registry

## Purpose

The Module Registry is the authoritative catalog of every module that exists, is planned, or has been deprecated within the Nudum platform.

It provides a centralized inventory of module ownership, lifecycle status, dependencies, deployment availability, and commercial classification.

Every module must be registered before development begins.

Modules not listed in this registry are considered unofficial.

---

# Registry Principles

Each module:

* Has a unique identifier.
* Has one business owner.
* Has one architectural owner.
* Belongs to one category.
* Has a defined lifecycle.
* Has documented boundaries.
* Has documented dependencies.

No duplicate business capabilities are permitted.

---

# Module Categories

## Core Platform

Shared platform capabilities used by all modules.

Examples:

* Authentication
* Authorization
* Organizations
* Notifications
* Workflow Engine
* Search
* Billing
* AI Gateway

---

## Business Module

Implements a business domain.

Examples:

* Mahattati
* Jawdati
* Archivi

---

## Integration Module

Connects Nudum with external systems.

Examples:

* SCADA Connector
* ERP Connector
* GIS Connector
* Telegram Connector
* WhatsApp Connector
* Email Connector

---

## Extension Module

Optional capabilities that extend the platform.

Examples:

* Executive Dashboard
* AI Assistant
* Compliance
* Risk Management
* Asset Management

---

# Module Lifecycle

Each module has exactly one lifecycle state.

## Planned

Concept approved.

No implementation.

---

## Design

Requirements and architecture are being prepared.

---

## MVP

Minimal implementation.

Core functionality only.

---

## Beta

Feature complete.

Testing and refinement.

---

## Stable

Production-ready.

Supported.

---

## Maintenance

Receives fixes and updates.

No major feature development.

---

## Deprecated

Scheduled for removal.

Not recommended for new deployments.

---

## Retired

Removed from active development.

Maintained only for historical compatibility.

---

# Registry Fields

Every module record contains:

| Field           | Description                                 |
| --------------- | ------------------------------------------- |
| Module ID       | Unique identifier                           |
| Name            | Official module name                        |
| Category        | Core / Business / Integration / Extension   |
| Domain Owner    | Business ownership                          |
| Technical Owner | Engineering ownership                       |
| Status          | Lifecycle stage                             |
| Version         | Current version                             |
| Dependencies    | Required modules                            |
| Public APIs     | Exposed services                            |
| Domain Events   | Published events                            |
| Commercial Tier | Free / Standard / Professional / Enterprise |
| Deployment      | SaaS / On-Premise / Hybrid                  |
| Documentation   | Reference documents                         |

---

# Core Platform Modules

| Module          | Status  | Category |
| --------------- | ------- | -------- |
| Organizations   | Design  | Core     |
| Authentication  | Design  | Core     |
| Authorization   | Design  | Core     |
| Users           | Design  | Core     |
| Roles           | Design  | Core     |
| Permissions     | Design  | Core     |
| Workflow Engine | MVP     | Core     |
| Notifications   | MVP     | Core     |
| Search          | MVP     | Core     |
| File Storage    | MVP     | Core     |
| Audit Logs      | MVP     | Core     |
| Localization    | Design  | Core     |
| Billing         | Planned | Core     |
| AI Gateway      | Planned | Core     |

---

# Business Modules

## Mahattati

### Module ID

BUS-001

### Status

Design

### Category

Business Module

### Responsibilities

* Station Management
* Production Monitoring
* Equipment Management
* Maintenance
* Operational Measurements

### Depends On

* Organizations
* Users
* Notifications
* Workflow Engine

---

## Jawdati

### Module ID

BUS-002

### Status

Design

### Category

Business Module

### Responsibilities

* Laboratory Management
* Samples
* Analyses
* Results
* Chemical Calculations
* Quality Assurance

### Depends On

* Organizations
* Workflow Engine
* Notifications

---

## Archivi

### Module ID

BUS-003

### Status

Design

### Category

Business Module

### Responsibilities

* Digital Archive
* Correspondence
* Document Management
* Version Control
* Metadata

### Depends On

* Organizations
* Search
* Workflow Engine

---

# Planned Business Modules

| Module                | Status  |
| --------------------- | ------- |
| Maintenance+          | Planned |
| Asset Management      | Planned |
| Procurement           | Planned |
| Inventory             | Planned |
| Fleet Management      | Planned |
| GIS                   | Planned |
| Compliance            | Planned |
| Risk Management       | Planned |
| Executive Dashboard   | Planned |
| Business Intelligence | Planned |

---

# Integration Modules

Potential connectors include:

* SCADA
* OPC-UA
* ERP Systems
* GIS Systems
* Telegram
* WhatsApp
* Email
* SMS
* LDAP / Active Directory
* Microsoft 365

Integration modules remain optional and independently deployable.

---

# Commercial Classification

Modules may belong to different subscription tiers.

## Free

Essential capabilities.

---

## Standard

General operational modules.

---

## Professional

Advanced operational features.

---

## Enterprise

Large-scale organizational capabilities.

---

## AI Premium

Consumption-based intelligent services.

Commercial tiers may evolve independently of technical architecture.

---

# Dependency Rules

A module may depend only on:

* Core Platform modules.
* Published APIs of other modules.
* Published Domain Events.

Circular dependencies are prohibited.

---

# Module Identification

Identifiers follow this convention:

```text
CORE-001
BUS-001
BUS-002
INT-001
EXT-001
```

Prefixes:

* CORE → Core Platform
* BUS → Business
* INT → Integration
* EXT → Extension

Module identifiers never change after assignment.

---

# Governance

Before a new module is created:

1. Verify that no existing module owns the capability.
2. Update the Module Registry.
3. Define ownership.
4. Define dependencies.
5. Define lifecycle state.
6. Create architecture documentation.
7. Create the initial PRD.

Development begins only after registration.

---

# Registry Maintenance

The registry must be updated whenever:

* A module is added.
* A module changes status.
* A dependency changes.
* A module is deprecated.
* A commercial tier changes.

The registry reflects the current state of the platform at all times.

---

# Module Registry Statement

> **The Module Registry is the official inventory of the Nudum platform. It guarantees that every module has a clear purpose, a defined owner, documented dependencies, and a controlled lifecycle, ensuring that the platform grows through deliberate architecture rather than uncontrolled expansion.**
