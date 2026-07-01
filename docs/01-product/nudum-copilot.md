---
title: Nudum Copilot Product Strategy
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Product
references:
  - docs/01-product/product-principles.md
  - docs/01-product/product-strategy.md
  - docs/02-business/business-model.md
---

# Nudum Copilot Product Strategy

## 1. Product Vision

**Nudum Copilot** is the intelligent operational layer of the Nudum platform. Rather than acting as a generic sidebar chatbot, Copilot is an integrated, context-aware agent present on every screen. It connects Nudum’s structured information (laboratory samples, equipment specs, telemetry measurements) with unstructured regulatory and operational knowledge.

Its core mission is to **transform data into actionable compliance and operational decisions** at the point of work, assisting operators, analysts, and directors in Arabic, French, and English.

---

## 2. Multi-Layer Knowledge Architecture

To guarantee that Nudum Copilot answers using trusted sources and never hallucinates, it relies on a partitioned, hierarchical Retrieval-Augmented Generation (RAG) pipeline.

```text
                       Search Priority
                       
                       ┌──────────────┐
                       │   Personal   │  (Notes, personal drafts)
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Organization │  (Procedures, SOPs, historical logs)
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │    Global    │  (ISO standards, WHO guides, chemistry)
                       └──────────────┘
```

### Layer 1: Personal Knowledge
- **Scope**: User-uploaded drafts, field notes, and private calculations.
- **Privacy**: Encrypted and visible only to the authenticated user.

### Layer 2: Organization Knowledge
- **Scope**: Internal standard operating procedures (SOPs), manuals, PDFs, spreadsheets, and historical maintenance logs.
- **Privacy**: Isolated within the tenant's schema. Shared across the organization based on RBAC roles.

### Layer 3: Global Knowledge Base
- **Scope**: Standards (ISO 17025, ISO 9001), WHO drinking water guidelines, chemistry manuals, microbiology manuals, and safety regulations.
- **Privacy**: Managed centrally by Nudum administrators. Read-only for all tenants.

---

## 3. Subscription Tiers

Nudum Copilot operates on a resource-capped pricing model, enabling clear monetization pathways:

| Capability | Free | Professional | Business | Enterprise |
|---|---|---|---|---|
| **Monthly Queries** | 50 queries | 500 queries | 2,500 queries | Custom / Unlimited |
| **Storage Limit** | 50 MB | 1 GB | 10 GB | 100+ GB |
| **Max Document Size**| 5 MB | 20 MB | 50 MB | 100+ MB |
| **BYO API Key** | ❌ No | ❌ No | ✅ Yes | ✅ Yes (Custom model routing) |
| **RAG Scope** | Global only | Global + Tenant | Global + Tenant + Personal | Full isolation + Local LLM config |
| **Knowledge Packs** | ❌ No | ✅ Up to 2 | ✅ Up to 5 | ✅ Unlimited / Custom |
| **Team Collaboration**| ❌ No | ❌ No | ✅ Shared vector spaces | ✅ Dedicated workspace instances |

---

## 4. Knowledge Packs Marketplace

Knowledge Packs are pre-compiled semantic libraries curated by Nudum and domain specialists. Customers purchase these packs to instantly upgrade their Copilot's expertise:

* **Water Treatment Pack**: Treatment plant mechanics, filtration manuals, chlorination tables, and standard emergency runbooks.
* **Laboratory Pack (Jawdati-LIMS)**: ISO 17025 calibration guidelines, physicochemical analysis methodologies, and standard limits.
* **ISO QMS Standard Pack**: ISO 9001, ISO 14001, and ISO 45001 compliance criteria and internal audit checklists.
* **Microbiology Pack**: Waterborne pathogen detection guides, standard agar preparation, and incubation times.
* **Wastewater Operations Pack**: Sludge management procedures, biochemical oxygen demand (BOD) calculation models.
* **Industrial Maintenance Pack**: Pump calibration manuals, generator runbooks, electrical safety regulations.

---

## 5. Flagship Capabilities

Nudum Copilot supports specialized operational utilities out of the box:

* **Explain Laboratory Analysis**: Automatically checks standard limits and flags compliance deviations for a sample, explaining *why* a parameter is out of spec and its potential environmental impact.
* **Root Cause Analysis (RCA)**: Correlates operational measurements (telemetry) from Mahattati with maintenance history to suggest why a pump is underperforming or why turbidity has spiked.
* **Suggest Chemical Dosage**: Recommends coagulation and chlorination dosages based on raw water turbidity and flow parameters, cross-referencing WHO guidelines.
* **Explain Alarms**: Analyzes a SCADA alarm, linking it to the corresponding equipment manual and suggesting three immediate troubleshooting steps.
* **AI Document Q&A with Citations**: Allows directors to query organizational files, returning answers where every sentence is tied to a verified PDF page or SOP paragraph link.

---

## 6. Business Value and Competitive Edge

Nudum Copilot elevates the platform above traditional software categories:

| Feature | Traditional ERP/LIMS | Nudum + Copilot |
|---|---|---|
| **Data Handling** | Passive storage. Users must know *what* to query. | Active intelligence. Contextual assistance is pushed to the active screen. |
| **Regulatory Compliance** | Manual lookups in external binders. | Automated cross-referencing of WHO and ISO standards in real-time. |
| **Onboarding Speed** | Months of training on software navigation. | Interactive AI helps new operators execute workflows step-by-step. |
| **Knowledge Retention**| Retires when the senior analyst leaves. | Captures operator logs and SOPs, keeping institutional memory queryable. |

By serving as an expert system that translates raw data into regulatory decisions, Nudum Copilot ensures water safety, minimizes plant downtime, and shortens laboratory validation cycles from days to minutes.
