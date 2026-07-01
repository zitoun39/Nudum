---
title: Product Requirements Document (PRD) — Nudum Copilot MVP
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Product
references:
  - docs/01-product/nudum-copilot.md
  - docs/04-architecture/copilot-architecture.md
---

# PRD — Nudum Copilot MVP

## 1. Introduction & Background

Water treatment plant operations and laboratory analyses are subject to strict compliance, chemical calculations, and sudden operational issues. Standard ERPs require operators to open paper manuals or search external websites during alarms or out-of-spec test results. 

**Nudum Copilot MVP** introduces an interactive, context-aware side drawer that instantly links operational data on the active screen with the organization's SOPs and global standards.

---

## 2. Target Audience

1. **Plant Operators (Mahattati)**: Need troubleshooting guides when SCADA alarms trigger.
2. **Laboratory Analysts (Jawdati)**: Need quick calculation validations and standard limit lookups for chemical dosing.
3. **Quality Directors**: Need to search internal procedures and WHO guidelines to approve compliance reports.

---

## 3. Scope & MVP Features

### Feature 1: Contextual Sidebar UI
* **Description**: A slide-out panel accessible from any page in the web app.
* **Functional Requirements**:
  * Automatically detects active context parameters: `user_id`, `organization_id`, `active_module`, `active_screen`, `active_record_id`.
  * Displays dynamic "quick prompts" tailored to the screen (e.g., on Jawdati Sample page: "Verify standard limits for this sample", "Draft compliance summary").
  * Retains chat session history per user screen.

### Feature 2: Document Ingestion (RAG Core)
* **Description**: Allows tenant admins to upload PDF/DOCX standard procedures.
* **Functional Requirements**:
  * Admin dashboard in Settings for document uploads.
  * Displays upload history, status (Processing, Embedded, Failed), and file size.
  * Workers automatically chunk, embed, and index files into the tenant's isolated Postgres schema.

### Feature 3: Verified Answer Q&A with Citations
* **Description**: Core chat interface returning answers verified by RAG sources.
* **Functional Requirements**:
  * Responses must cite sources using markdown anchors pointing to the file ID and page number.
  * Strictly forbids answering query if no source context is found.
  * Translates responses dynamically between English, French, and Arabic.

### Feature 4: Interactive Explanations
* **Description**: One-click triggers next to data tables.
* **Functional Requirements**:
  * Button on Jawdati Results table: `[Ask Copilot to Explain]`. Tapping it sends the row values to Copilot to analyze compliance.

---

## 4. User Flows

### Document Ingestion Flow
```text
  [Tenant Admin] ──► Uploads SOP.pdf ──► [File Service] ──► [MinIO]
                                                                │
                                                                ▼
  [Client UI] ◄── Updates Status (Complete) ◄── [BullMQ Worker Chunk & Embed]
```

### Contextual Q&A Flow
```text
  [Analyst] clicks "Ask Copilot" on Jawdati test page
       │
       ▼
  [Backend] compiles context: { user: Analyst, screen: sample_view, data: sample_102 }
       │
       ▼
  [AI Gateway] runs similarity query in tenant schema + public global schema
       │
       ▼
  [LLM] evaluates top 5 chunks + context and outputs answer + citations
       │
       ▼
  [Analyst] sees answer in sidebar with clickable links directly opening SOP.pdf
```

---

## 5. Non-Functional Requirements (NFRs)

* **Data Isolation**: A vector similarity search must never scan records outside the authenticated user's schema (`tenant_x`). Violation = critical failure.
* **Response Latency**: Core retrieval + LLM streaming must start rendering within **1.5 seconds** (P95).
* **Graceful Degradation**: If the local AI GPU or cloud provider is offline, the Copilot UI must display a message indicating *"AI assistant is temporarily offline. Operational calculations can still be triggered manually."*
* **Compliance Audit**: All LLM requests, prompts, token counts, and returned citations must be logged to the tenant's schema `audit_logs` table.
