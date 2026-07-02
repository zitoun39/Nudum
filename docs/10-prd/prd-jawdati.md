---
title: "PRD-003 — Jawdati Laboratory & Quality Management"
status: Draft
owner: Abdelhak Zitoun
last-updated: 2026-07-02
category: Product
references:
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/domain-model.md
---

# PRD-003 — Jawdati Laboratory & Quality Management (MVP)

## 1. Bounded Context & Scope

The **Jawdati Context** (`BUS-002`) manages laboratories, water quality specimens (samples), test executions (analyses), and recorded parameters (results).

### Key Boundaries

- Owns laboratory facilities (`Laboratory`) directly associated with the Organization.
- Owns laboratory instruments registry (`Instrument`).
- Owns specimen records (`Sample`) and execution records (`Analysis` and `Result`).
- All entities run isolated per tenant schema (`tenant_[org_id]`).

---

## 2. Aggregates & Entity Design

### 🔬 Laboratory (Aggregate Root)

Represents a physical laboratory facility. Sibling to Site at the Organization level.

- `id` (UUID, Primary Key)
- `name` (String, max 150 chars, unique per tenant)
- `location` (String, max 255 chars, nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 🧪 Sample (Aggregate Root)

Represents a collected water specimen.

- `id` (UUID, Primary Key)
- `sample_code` (String, max 50 chars, unique per tenant)
- `laboratory_id` (UUID, Foreign Key referencing Laboratory)
- `collected_at` (Timestamp)
- `collected_by` (String, max 100 chars)
- `source_site_id` (UUID, nullable, loose reference lookup to Site)
- `source_station_id` (UUID, nullable, loose reference lookup to Station)
- `status` (Enum: `collected` | `received` | `analyzing` | `completed` | `rejected`)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 📋 Analysis (Entity)

Represents a specific test parameter evaluation request/run (e.g., pH Test, Turbidity Test) performed on a Sample.

- `id` (UUID, Primary Key)
- `sample_id` (UUID, Foreign Key referencing Sample)
- `test_method` (String, max 100 chars, e.g. "ISO 10523", "Standard Methods 2130B")
- `status` (Enum: `pending` | `in_progress` | `completed` | `cancelled`)
- `analyst_id` (UUID, referencing global User)
- `started_at` (Timestamp, nullable)
- `completed_at` (Timestamp, nullable)
- `created_at` (Timestamp)

### 📊 Result (Entity)

Logs the parameter value obtained from an Analysis.

- `id` (UUID, Primary Key)
- `analysis_id` (UUID, Foreign Key referencing Analysis)
- `parameter_name` (String, max 100 chars, e.g., `pH`, `turbidity`, `residual_chlorine`)
- `value` (Decimal, measured value)
- `unit` (String, max 20 chars, e.g., `pH units`, `NTU`, `mg/L`)
- `is_conforming` (Boolean, whether it satisfies quality boundaries)
- `created_at` (Timestamp)

---

## 3. User Stories

| ID         | As a...             | I want to...                                         | So that I can...                                        |
| ---------- | ------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **US-301** | Lab Manager         | Register laboratory facilities and instruments       | Configure testing capabilities and locations.           |
| **US-302** | Operator / Lab Tech | Record water samples collected from sites/stations   | Queue them for laboratory analysis.                     |
| **US-303** | Lab Analyst         | Record test analysis runs and save parameter results | Track water quality compliance and identify deviations. |
| **US-304** | Lab Manager         | Review and complete the sample lifecycle             | Finalize quality reports for compliance tracking.       |

---

## 4. REST APIs & Endpoints

### Laboratories

- `GET /api/laboratories` - List laboratories.
- `POST /api/laboratories` - Register laboratory.
- `GET /api/laboratories/:id` - Get laboratory details.

### Samples & Analysis

- `GET /api/samples` - List and filter samples.
- `POST /api/samples` - Record sample collection.
- `GET /api/samples/:id` - Get sample details including analyses and results.
- `POST /api/samples/:id/analyses` - Request a test analysis on a sample.
- `POST /api/analyses/:id/results` - Submit parameter results for a test run.
- `PUT /api/samples/:id/status` - Progress sample status.

---

## 5. Security & Permissions

- `jawdati:laboratory:read` - View labs and equipment.
- `jawdati:laboratory:write` - Manage labs registry.
- `jawdati:sample:read` - View specimen logs.
- `jawdati:sample:write` - Log collection or update status.
- `jawdati:analysis:write` - Execute test runs and log parameter results.

---

## 6. Implementation Milestones

1. **Milestone 4.10 (Jawdati 1)**: Database schema & TypeORM entity models creation (tenant isolated).
2. **Milestone 4.11 (Jawdati 2)**: Core services implementation (Laboratories and Samples registry).
3. **Milestone 4.12 (Jawdati 3)**: Analysis test runs and Results entry service layer.
4. **Milestone 4.13 (Jawdati 4)**: REST Controllers endpoints, Integration unit testing.
