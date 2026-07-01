---
title: Nudum Ubiquitous Language
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Domain
references:
  - docs/03-domain/domain-model.md
  - docs/03-domain/bounded-contexts.md
---

# Nudum Ubiquitous Language

## Purpose

This document defines the official business vocabulary of the Nudum platform.

It establishes a shared language used consistently across:

* Documentation
* Product Requirements
* Source Code
* APIs
* Database Schema
* User Interface
* AI Prompts
* Architecture Documents
* Technical Discussions

Every business concept has exactly one official name and one official definition.

Consistency in language reduces ambiguity, improves communication, and strengthens long-term maintainability.

---

# Language Principles

The ubiquitous language follows these principles:

* One concept → One name.
* One name → One meaning.
* Business terminology takes precedence over technical terminology.
* Avoid synonyms for business entities.
* Use singular nouns for entities.
* Use verbs for actions.
* Use PascalCase for entity names.
* Use camelCase for field names.
* Use English as the canonical development language.

Arabic, French, and English translations are provided for the user interface only.

---

# Core Platform Vocabulary

## Organization

The highest business boundary within Nudum.

Represents a company, institution, municipality, or public agency.

Every business entity belongs to exactly one Organization.

---

## Department

A functional unit inside an Organization.

Examples:

* Laboratory
* Operations
* Maintenance
* Administration
* Quality

---

## User

A person who accesses the platform.

A User performs actions but does not own business entities.

---

## Role

A reusable collection of permissions.

Roles describe responsibilities.

They never contain business data.

---

## Permission

A single authorized capability.

Examples:

* Create Sample
* Approve Document
* Manage Equipment

Permissions are always assigned through Roles.

---

# Mahattati Vocabulary

## Site

A physical location managed by an Organization.

Examples:

* Water Treatment Plant
* Regional Office
* Production Facility

---

## Station

An operational facility where production or treatment activities occur.

A Station belongs to one Site.

---

## Equipment

A physical asset used during operations.

Examples:

* Pump
* Tank
* Generator
* Chlorinator
* Filter

Equipment belongs to one Station.

---

## Sensor

A device that measures operational values.

Sensors produce Measurements.

---

## Measurement

A recorded operational value.

Examples:

* Flow Rate
* Pressure
* Water Level
* Temperature

Measurements are observations, not laboratory results.

---

## Maintenance

A scheduled or corrective activity performed on Equipment.

Maintenance produces Maintenance Records.

---

# Jawdati Vocabulary

## Laboratory

A facility responsible for performing analyses.

---

## Sample

A collected specimen intended for laboratory analysis.

A Sample is never a Result.

A Sample may generate multiple Analyses.

---

## Analysis

A laboratory examination performed on a Sample.

An Analysis produces Results.

---

## Parameter

A measurable characteristic evaluated during an Analysis.

Examples:

* pH
* Turbidity
* Conductivity
* Chloride
* Iron

---

## Result

A measured value produced by an Analysis.

A Result always belongs to one Analysis.

---

## Test Method

The standardized procedure used to perform an Analysis.

Test Methods are reusable.

---

## Compliance

The evaluation of whether a Result satisfies applicable standards.

Compliance is an assessment—not a measurement.

---

# Archivi Vocabulary

## Document

A managed digital record.

Examples:

* Report
* Letter
* Procedure
* Certificate
* Policy

---

## Folder

A logical container used to organize Documents.

Folders do not define permissions.

---

## Tag

A reusable classification label.

Tags improve searchability.

---

## Version

A historical revision of a Document.

Documents may contain multiple Versions.

---

## Archive

The long-term preservation of Documents according to organizational policies.

---

# Workflow Vocabulary

## Workflow

A predefined business process.

Examples:

* Approval
* Review
* Validation
* Publication

---

## Task

A unit of work assigned within a Workflow.

Tasks have an owner and a status.

---

## Approval

A formal business decision confirming that an activity satisfies organizational requirements.

---

## Assignment

The act of allocating responsibility for a Task.

---

# Notification Vocabulary

## Notification

A message informing users about business events.

Delivery channel is independent from notification content.

---

## Channel

A delivery mechanism.

Examples:

* In-App
* Email
* Telegram
* WhatsApp
* SMS

---

# Reporting Vocabulary

## Dashboard

A visual representation of operational indicators.

Dashboards summarize information.

They do not own data.

---

## Report

A generated document containing structured business information.

Reports may be exported or archived.

---

## KPI

A measurable performance indicator.

KPIs are derived from business data.

---

# AI Vocabulary

## AI Assistant

An intelligent service that assists users.

AI never owns business entities.

---

## Knowledge Base

The collection of indexed organizational information available for semantic retrieval.

---

## AI Session

A conversation between a User and an AI Assistant.

---

# Billing Vocabulary

## Plan

A commercial offering defining available capabilities.

---

## Subscription

An Organization's active commercial agreement.

---

## License

The authorization to use the platform under defined conditions.

---

# General Vocabulary

## Module

A functional area responsible for one business domain.

Examples:

* Mahattati
* Jawdati
* Archivi

---

## Context

A bounded business domain with independent rules and ownership.

---

## Entity

A business object with a persistent identity.

---

## Value Object

A business object defined only by its attributes and having no independent identity.

Examples:

* Address
* Coordinate
* Measurement Unit
* Date Range

---

## Domain Event

A business event describing something that has already happened.

Examples:

* SampleCollected
* AnalysisCompleted
* DocumentApproved

---

## Aggregate

A consistency boundary that groups related entities under a single root.

Aggregates enforce business rules and transactional integrity.

---

# Naming Conventions

Entities use singular nouns.

Examples:

* Organization
* User
* Station
* Sample
* Analysis
* Document

Collections use plural nouns.

Examples:

* Organizations
* Users
* Samples
* Documents

Events use the past tense.

Examples:

* SampleCollected
* DocumentApproved
* ResultValidated

Commands use imperative verbs.

Examples:

* CreateSample
* ApproveDocument
* AssignTask

API endpoints use plural resource names.

Examples:

* /organizations
* /stations
* /samples
* /documents

Database tables use snake_case plural names.

Examples:

* organizations
* laboratory_samples
* analysis_results
* workflow_tasks

---

# Forbidden Synonyms

To preserve consistency, the following alternatives should not be used:

| Preferred    | Avoid                                                       |
| ------------ | ----------------------------------------------------------- |
| Organization | Company, Client, Institution (unless legally required)      |
| User         | Operator, Employee, Person                                  |
| Sample       | Specimen, Test Sample                                       |
| Analysis     | Test, Examination                                           |
| Result       | Reading, Output                                             |
| Document     | File, Record (when referring to managed documents)          |
| Workflow     | Process, Procedure (unless describing a business procedure) |
| Task         | Job, Action                                                 |
| Equipment    | Machine, Device (unless technically required)               |

---

# Governance

New business terms may only be introduced when:

* They represent a genuinely new concept.
* They are documented in this file.
* They do not duplicate existing terminology.
* Their ownership and definition are clearly established.

The Ubiquitous Language is governed alongside the Domain Model and serves as the official vocabulary for the entire Nudum platform.

---

# Ubiquitous Language Statement

> **A shared language creates a shared understanding. In Nudum, every business concept has one authoritative name, one precise definition, and one place in the domain model. This common vocabulary ensures consistency across documentation, architecture, code, APIs, databases, and artificial intelligence.**
