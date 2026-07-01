---
title: Canonical Domain Model
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
references:
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/ubiquitous-language.md
  - docs/03-domain/module-boundaries.md
---

# Canonical Domain Model

## Purpose

This document defines the canonical business domain model of the Nudum platform.

It describes the core business entities, their relationships, ownership boundaries, and responsibilities independently of any programming language, database technology, or implementation framework.

The domain model represents the business itself—not the software implementation.

Every module, API, database schema, workflow, and user interface must remain consistent with this model.

---

# Domain Philosophy

Business concepts define software.

Technology follows the domain.

The domain model is the single source of truth for:

* Business entities
* Relationships
* Ownership
* Workflows
* Permissions
* Reporting
* APIs
* Database design

---

# Core Domain

The platform revolves around Organizations.

Everything belongs to an Organization.

```text
Organization
│
├── Departments
├── Users
├── Sites
├── Stations
├── Laboratories
├── Documents
├── Assets
├── Workflows
├── Reports
└── Modules
```

The Organization is the highest business boundary.

---

# Business Contexts

The platform is divided into bounded contexts.

## Core Platform

Responsible for:

* Organizations
* Users
* Roles
* Permissions
* Authentication
* Notifications
* Billing
* Settings
* Localization

---

## Mahattati Context

Responsible for:

* Stations
* Production
* Treatment Processes
* Equipment
* Sensors
* Maintenance
* Operational Logs

---

## Jawdati Context

Responsible for:

* Laboratories
* Samples
* Analyses
* Test Methods
* Chemical Calculations
* Quality Control
* Laboratory Reports

---

## Archivi Context

Responsible for:

* Documents
* Correspondence
* Digital Archive
* Folders
* Tags
* Retention Policies
* Search

---

# Core Entities

## Organization

Represents an institution or company using Nudum.

Owns:

* Users
* Departments
* Modules
* Data
* Billing

---

## Department

Represents an administrative or operational division.

Examples:

* Laboratory
* Operations
* Maintenance
* Administration
* Quality

---

## User

Represents a person interacting with the platform.

Users may belong to multiple departments.

Permissions are assigned through roles.

---

## Role

Defines a reusable permission set.

Roles never contain business data.

---

## Permission

Represents an individual capability.

Permissions are combined into roles.

---

# Operational Domain

## Site

Represents a physical location.

Examples:

* Water Treatment Plant
* Laboratory Building
* Regional Office

---

## Station

Operational facility managed by Mahattati.

Contains:

* Equipment
* Production Units
* Measurements
* Maintenance Records

---

## Equipment

Represents physical assets.

Examples:

* Pumps
* Filters
* Tanks
* Chlorinators
* Generators

Equipment belongs to one Station.

---

## Maintenance Record

Represents maintenance activities performed on equipment.

---

# Laboratory Domain

## Laboratory

Represents a laboratory facility.

Contains:

* Samples
* Analyses
* Instruments
* Analysts

---

## Sample

Represents a collected sample.

Attributes include:

* Collection Date
* Collection Point
* Sample Type
* Status

A sample may generate multiple analyses.

---

## Analysis

Represents a laboratory test.

Belongs to one sample.

Produces one or more measured results.

---

## Test Method

Defines the standard procedure used during an analysis.

Methods are reusable across analyses.

---

## Result

Represents a measured laboratory value.

Contains:

* Parameter
* Value
* Unit
* Standard Limit
* Compliance Status

---

# Document Domain

## Document

Represents any managed document.

Examples:

* Reports
* Letters
* Procedures
* Certificates

---

## Folder

Logical organization of documents.

---

## Tag

Metadata for classification.

Documents may contain multiple tags.

---

## Version

Represents document history.

Documents are version-controlled.

---

# Workflow Domain

## Workflow

Defines a business process.

Examples:

* Approval
* Review
* Validation
* Distribution

---

## Task

Represents work assigned within a workflow.

---

## Approval

Represents a formal business decision.

---

# Notification Domain

## Notification

Represents a user notification.

Delivery channels may include:

* In-App
* Email
* Telegram
* WhatsApp
* Push

Notifications remain independent of delivery providers.

---

# Reporting Domain

## Dashboard

Aggregated business indicators.

---

## Report

Generated operational or analytical information.

Reports are generated from business data.

---

# AI Domain

## AI Assistant

Provides intelligent assistance.

Never owns business data.

Consumes authorized information.

Produces recommendations.

---

## AI Conversation

Stores AI interaction history.

Subject to organizational permissions.

---

# Relationships

```
Organization
│
├── Departments
│      └── Users
│
├── Sites
│      ├── Stations
│      │      ├── Equipment
│      │      └── Maintenance Records
│      │
│      └── Laboratories
│             ├── Samples
│             │      └── Analyses
│             │              └── Results
│             │
│             └── Test Methods
│
├── Documents
│      ├── Folders
│      └── Versions
│
├── Workflows
│      └── Tasks
│
├── Notifications
│
└── Reports
```

---

# Domain Events

Typical business events include:

* OrganizationCreated
* UserInvited
* StationCreated
* EquipmentInstalled
* MaintenanceScheduled
* SampleCollected
* AnalysisStarted
* AnalysisCompleted
* ResultValidated
* DocumentUploaded
* DocumentApproved
* WorkflowCompleted
* NotificationSent

Events describe business facts.

---

# Ownership Rules

Every business entity has exactly one owner.

Examples:

* Equipment belongs to one Station.
* Station belongs to one Site.
* Site belongs to one Organization.
* Sample belongs to one Laboratory.
* Laboratory belongs to one Organization.
* Document belongs to one Organization.

Ownership determines security and tenant isolation.

---

# Design Principles

The domain model must remain:

* Independent of databases.
* Independent of frameworks.
* Independent of APIs.
* Stable over time.
* Business-oriented.
* Human-readable.

Implementation follows the model—not the reverse.

---

# Domain Model Statement

> **The Canonical Domain Model is the authoritative representation of the business. Every database schema, API, workflow, permission, and software component within Nudum must faithfully reflect this model while preserving its clarity, consistency, and long-term stability.**
