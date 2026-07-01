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

It describes the core business entities, their relationships, ownership boundaries, and responsibilities independently of programming languages, database technologies, or implementation frameworks.

---

## Domain Philosophy

Business concepts define the software. The domain model is the single source of truth for:
* Business entities
* Relationships and Aggregate Roots
* Ownership boundaries
* Allowed database structures

---

## Bounded Context Boundaries

The platform is divided into autonomous bounded contexts. Each context owns its entities and business logic:

### 1. Core Platform
- **Owns**: `Organization`, `Department`, `User`, `Role`, `Permission`, `AuditLog`, `WorkflowInstance`, `Task`, `Notification`.

### 2. Mahattati Context
- **Owns**: `Site`, `Station`, `ProductionUnit`, `Equipment`, `Sensor`, `Measurement`, `MaintenancePlan`, `MaintenanceRecord`.

### 3. Jawdati Context
- **Owns**: `Laboratory`, `Sample`, `Analysis`, `Result`, `TestMethod`, `Instrument`.
- **Note**: `Laboratory` is a root-level aggregate in Jawdati. It is physically independent of Mahattati's `Site`.

### 4. Archivi Context
- **Owns**: `Document`, `Correspondence`, `Folder`, `Tag`, `Version`.

---

## Core Entities & Aggregates

### Organization
- Highest tenant boundary. Every entity belongs to exactly one Organization.
- Relational schema is isolated per tenant schema (except global metadata in `public`).

### Department
- Administrative division of an organization (Core context). Used for user grouping (e.g. "Lab Department").

### User
- Digital identity (Core context). Belongs to an Organization and optionally to multiple Departments.

---

## Operational Domain (Mahattati)

### Site
- Physical site location (e.g. "Béni Haroun Reservoir").

### Station
- Operational plant or treatment facility belonging to a Site.

### Equipment
- Physical asset (e.g. Pump, Chlorinator) installed at a Station.

### Maintenance Record
- Details maintenance performed on an Equipment.

---

## Laboratory Domain (Jawdati)

### Laboratory
- **Aggregate Root**: A physical laboratory facility where sample testing is managed.
- **Independence**: Associated directly with the `Organization`. It does not inherit from or require a `Site` to exist. It references a `Site` or `Station` strictly using a loose string/ID lookup.

### Sample
- Collected water specimen. Belongs to a Laboratory. References the source `Site` or `Station` using a reference ID.

### Analysis
- Laboratory test performed on a Sample. Uses a `TestMethod`.

### Result
- Measured parameter value (e.g., pH, Turbidity) produced by an Analysis.

---

## Document Domain (Archivi)

### Document
- Managed digital file.

### Correspondence
- Administrative or external letter. Distinct from general documents; owns its approval and tracking workflows.

---

## Aggregate Hierarchies

```text
Organization (Tenant Boundary)
│
├── Core Context
│    ├── Departments ── Users
│    └── Workflows ── Tasks
│
├── Mahattati Context (Operations)
│    └── Sites
│         └── Stations
│              ├── Equipment ── Maintenance Records
│              └── Sensors ── Measurements
│
├── Jawdati Context (Quality)
│    ├── Laboratories ── Instruments
│    │    └── Samples ── Analyses ── Results
│    └── Test Methods
│
└── Archivi Context (Records)
     └── Documents
          ├── Folders
          └── Versions
```

*Note: Laboratories are sibling aggregates to Sites at the Organization level, maintaining strict module boundaries.*
