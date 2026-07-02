---
title: "PRD-002 — Mahattati Plant Operations Management"
status: Draft
owner: Abdelhak Zitoun
last-updated: 2026-07-02
category: Product
references:
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/domain-model.md
---

# PRD-002 — Mahattati Plant Operations Management (MVP)

## 1. Bounded Context & Scope

The **Mahattati Context** (`BUS-001`) manages water utility facilities, plants, assets, sensors, and operational telemetry (measurements) for utility organisations.

### Key Boundaries

- Owns all geographical/physical facility structural assets (`Site` and `Station`).
- Owns operational hardware tracking (`Equipment`) installed at stations.
- Records manual operator logs and automated telemetry (`Measurement`) associated with stations and equipment.
- All entities run isolated per tenant schema (`tenant_[org_id]`).

---

## 2. Aggregates & Entity Design

### 📍 Site (Aggregate Root)

Represents a geographical location/administrative boundary (e.g. "Béni Haroun Reservoir").

- `id` (UUID, Primary Key)
- `name` (String, max 150 chars, unique per tenant)
- `location` (String, max 255 chars, nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 🏭 Station (Entity)

Represents a specific plant or processing unit within a Site (e.g. "Pumping Station 1", "Filtration Plant").

- `id` (UUID, Primary Key)
- `name` (String, max 150 chars)
- `site_id` (UUID, Foreign Key referencing Site)
- `capacity_m3_day` (Decimal, capacity flow rate, nullable)
- `status` (Enum: `active` | `maintenance` | `inactive`)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### ⚙️ Equipment (Aggregate Root)

Represents a physical machine or component (e.g. "Centrifugal Pump A", "Gas Chlorinator 2") installed at a Station.

- `id` (UUID, Primary Key)
- `name` (String, max 150 chars)
- `serial_number` (String, max 100 chars, nullable)
- `station_id` (UUID, Foreign Key referencing Station)
- `type` (String, category of asset, e.g., `pump`, `chlorinator`, `filter`)
- `installed_at` (Date, nullable)
- `status` (Enum: `operational` | `faulty` | `under_maintenance` | `decommissioned`)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 📊 Measurement (Aggregate Root)

Logs operational stats/telemetry (e.g. "Daily Flow rate", "Inlet Turbidity").

- `id` (UUID, Primary Key)
- `station_id` (UUID, Foreign Key referencing Station)
- `equipment_id` (UUID, nullable, Foreign Key referencing Equipment)
- `parameter_name` (String, max 100 chars, e.g., `flow_rate`, `turbidity`, `chlorine_level`)
- `value` (Decimal, measured quantity)
- `unit` (String, max 20 chars, e.g., `m3/h`, `NTU`, `mg/L`)
- `logged_by` (UUID, referencing global User)
- `logged_at` (Timestamp, time of measurement)
- `created_at` (Timestamp)

---

## 3. User Stories

| ID         | As a...         | I want to...                                                      | So that I can...                                                      |
| ---------- | --------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| **US-201** | Admin / Manager | Register new Sites and Pumping/Treatment Stations                 | Maintain an accurate physical footprint map.                          |
| **US-202** | Operator        | Track equipment assets installed at stations and update status    | Know where pumps and critical machinery are located and their states. |
| **US-203** | Operator        | Log daily operational measurements (flow rates, levels, pressure) | Track plant performance and telemetry history.                        |
| **US-204** | Analyst         | Retrieve measurement log history for a specific station           | Generate performance charts and export data.                          |

---

## 4. REST APIs & Endpoints

### Sites & Stations

- `GET /api/sites` - List all physical sites.
- `POST /api/sites` - Register a site.
- `GET /api/sites/:id` - View site with nested Stations.
- `POST /api/sites/:id/stations` - Register a station under a site.
- `PUT /api/stations/:id` - Edit station metadata or update status.
- `DELETE /api/stations/:id` - Delete station.

### Equipment

- `GET /api/equipment` - List equipment, filterable by station.
- `POST /api/equipment` - Register equipment at a station.
- `PUT /api/equipment/:id` - Update equipment metadata/status.
- `DELETE /api/equipment/:id` - Decommission/delete equipment.

### Measurements

- `GET /api/measurements` - Paginated filterable telemetry logs list.
- `POST /api/measurements` - Log operational measurement.
- `GET /api/stations/:id/measurements` - Retrieve measurements history for a station.

---

## 5. Security & Permissions

- `mahattati:site:read` - View physical sites/stations.
- `mahattati:site:write` - Create/edit/delete sites and stations.
- `mahattati:equipment:read` - View assets inventory.
- `mahattati:equipment:write` - Register/update assets status.
- `mahattati:measurement:read` - View logged telemetry stats.
- `mahattati:measurement:write` - Log operator measurements.

---

## 6. Implementation Milestones

1. **Milestone 4.6 (Mahattati 1)**: Database schema & TypeORM entity models creation (tenant isolated).
2. **Milestone 4.7 (Mahattati 2)**: Core services implementation (Sites, Stations, and Equipment catalog).
3. **Milestone 4.8 (Mahattati 3)**: Telemetry Logs and Measurements service layer.
4. **Milestone 4.9 (Mahattati 4)**: REST Controllers endpoints, Integration unit testing.
