---
title: Nudum Copilot Architecture
status: Active
owner: Abdelhak Zitoun
last-updated: 2026-07-01
category: Architecture
references:
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/core-platform.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0010-ai-gateway.md
  - docs/11-adr/ADR-0013-nudum-copilot.md
---

# Nudum Copilot Architecture

## 1. System Topology

Nudum Copilot integrates with the modular monolith via the centralized **AI Gateway** (Core Platform). Business modules interact with Copilot asynchronously through the Event Bus or synchronously via standard REST APIs, maintaining complete decoupling.

```text
  [Business Modules]                   [AI Gateway]                 [Vector Storage]
  (Jawdati, Mahattati)                      │                              │
         │                                  ├─ Model Router                │
         ├─ Request Prompt ────────────────►├─ Token Auditor               │
         │                                  ├─ Embedding Client            │
         │                                  │                              │
         │                                  ▼                              ▼
  [Dynamic Context] ────────────────► [RAG Pipeline] ◄────────────── [pgvector]
  (User, Screen, Tenant)                                          (Schema Isolated)
```

---

## 2. Ingestion & Embedding Pipeline

When a document (PDF, DOCX, XLSX) is uploaded via the **File Service**:

```text
  [Upload File]
       │
       ▼
   [MinIO] ──► (Publish event: FileUploaded)
                   │
                   ▼
               [BullMQ]
                   │
                   ▼
             [Worker Node]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   [Text Extract]          [OCR] (Tesseract if scanned PDF)
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
           [Semantic Chunking] (Markdown/Header aware, 500-token overlap)
                   │
                   ▼
         [AI Gateway Embed] (Generate text-embedding vectors)
                   │
                   ▼
        [Database Persistence] (Save vectors to tenant_x.knowledge_embeddings)
```

1. **Upload**: Binary stored in MinIO; `FileUploaded` domain event is published.
2. **Queueing**: BullMQ registers a document processing job.
3. **Extraction & OCR**: Text is extracted. Scanned documents route through Tesseract OCR.
4. **Chunking**: Text is split into 500-token chunks with 10% overlap, preserving header hierarchy.
5. **Vector Generation**: Text chunks pass to the AI Gateway to generate 1536-dimensional embeddings.
6. **Schema Isolation**: Chunks and vector arrays are stored in the active tenant's schema (`tenant_x.knowledge_embeddings`) utilizing PostgreSQL `pgvector` indexes.

---

## 3. Dynamic RAG and Context Assembly

When a user triggers Copilot, the backend dynamically constructs the LLM context:

1. **System Context**: Resolves user information, tenant metadata, active module name, and active UI screen.
2. **Permission Check**: Filters out target knowledge search spaces based on the user's active RBAC permissions.
3. **Similarity Search**:
   * The user query is embedded into a vector.
   * A cosine-similarity query (`<=>` operator in `pgvector`) is run within the tenant schema `knowledge_embeddings` table.
4. **Hierarchical Merging**:
   - Query yields vectors from:
     - Tenant schema (`knowledge_embeddings`) -> Org level (SOPs).
     - Tenant schema (`personal_embeddings`) -> Personal level (User notes).
     - Shared schema (`public.global_embeddings`) -> Read-only expert manuals.
   - The context aggregator ranks and merges the results according to the priority: **Personal → Organization → Global**.
5. **Context Token Capping**: Top 5 chunks (max 3000 tokens) are packaged into the LLM system prompt envelope.

---

## 4. Permission-Aware Data Isolation

Data isolation is guaranteed at the database schema layer:
- **No Shared Vector Tables**: Tenant document embeddings are stored inside their respective schema tables (`tenant_x.knowledge_embeddings`). An SQL injection attempt or database leak cannot reach other tenant data because the connection is strictly locked to `tenant_x`'s search path.
- **Global Table Separation**: The read-only Global Knowledge Base resides in `public.global_embeddings`. Queries use a standard SQL `UNION ALL` statement between the tenant-scoped schema and the `public` schema.
- **RBAC Filtering**: Every vector chunk is tagged with its parent document's read permission group (e.g. `QualityAdmin`, `Operator`). The similarity query appends a WHERE filter matching the active user's permissions.

---

## 5. Citation Engine

To prevent hallucinations, Copilot is configured to answer *only* from retrieved chunks. The output includes verified citations:

- **Source Matching**: Each text chunk stores metadata: `document_id`, `document_name`, `page_number`, `paragraph_id`, `version`.
- **Instruction Prompt**: The LLM is instructed to append `[^document_name:page]` references to every factual statement it makes.
- **Markdown Mapping**: The client-side UI translates these tokens into clickable document viewer links, opening the exact file version at the target page coordinate.
- **Verification Rule**: If the retrieved chunks contain insufficient information to answer the query, the LLM is restricted to responding with: *"I cannot find the answer in the provided documents."*
