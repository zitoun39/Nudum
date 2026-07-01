---
title: "ADR-0011 — Nudum Copilot Architecture & Security Decisions"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/core-platform.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/11-adr/ADR-0010-ai-gateway.md
---

# ADR-0011 — Nudum Copilot Architecture & Security Decisions

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum requires a scalable, secure, and context-aware enterprise AI assistant (Nudum Copilot) to assist utility operators and laboratory analysts. The architecture must:
- Guarantee absolute tenant data isolation (preventing cross-tenant data leakage in vector searches).
- Support sovereign on-premise deployments (running Ollama and local embedding models) alongside cloud SaaS deployments (OpenAI/Anthropic/Gemini).
- Mitigate LLM hallucinations by enforcing RAG-only responses with clickable page-level citations.
- Prevent version-control mismatches between code-level parsers and database prompt configurations.

---

## Decision

> **We will implement Nudum Copilot using an isolated, schema-per-tenant RAG model. Vector embeddings are stored inside each tenant's PostgreSQL schema using `pgvector` indexes. Prompt templates, variables, and output parsers are versioned directly in code, while the Core AI Gateway abstracts model routing, audits tokens, and limits access boundaries.**

Key technical specifications:
- **Vector Indexing**: PostgreSQL `pgvector` extension (`HNSW` or `IVFFlat` index on `vector` columns).
- **Data Isolation**: Tenant vector records are saved in `tenant_x.knowledge_embeddings`. Public expert standards reside in `public.global_embeddings`. Queries execute a `UNION ALL` across both schemas, completely isolated from other tenants.
- **Access Control**: Row-level access tags (e.g. `roles: ['Operator']`) are appended as a metadata query filter, ensuring users can only search documents they are authorized to view.
- **Code-Managed Prompts**: Prompts are stored in the codebase of the consuming modules (Mahattati, Jawdati, Archivi). The AI Gateway API takes raw text prompts and manages routing, rate-limiting, and cost metrics.
- **Citation Engine**: Every answer must map to source chunks containing metadata (`file_id`, `page_number`, `version`). The UI renders these as clickable deep links into the document viewer.

---

## Rationale

- **Robust Multi-Tenancy**: Schema-per-tenant isolation (ADR-0009) is extended to vectors. A database connection error cannot leak data to another tenant because the target search path isolates tables.
- **Version Control Safety**: Storing prompts in code prevents database-prompt version drift, keeping prompts aligned with the JSON parsing structures.
- **On-Premise Ready**: Using `pgvector` on the same PostgreSQL instance avoids introducing complex external vector databases (like Milvus or Qdrant) that would increase host memory footprint on local utility servers.
- **Sovereign AI Routing**: The centralized AI Gateway can route API requests to local Ollama servers (Algeria on-premise) or Azure OpenAI (SaaS portal) without modifying business modules.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Dedicated Vector DB (Pinecone / Qdrant) | Pinecone is cloud-only (no on-premise). Qdrant adds significant CPU/RAM footprint to local on-premise utility installations. `pgvector` is highly performant and runs directly in Postgres. |
| DB-stored Prompt Management | Rejected per ADR-0010 due to synchronization risks. Database prompt updates would silently crash code-level parsers. |
| Global shared vector table with row filtering | Rejected due to high risk of cross-tenant data leakage under shared table structures. |

---

## Consequences

### Positive
- Strict, schema-isolated vector search security.
- Unified PostgreSQL backup/restore covering both business tables and embeddings.
- Flexible model routing (OpenAI vs Ollama) managed at the environment level.
- Clickable citations ensure compliance auditing.

### Negative / Trade-offs
- Running vector distance search within Postgres increases CPU/Memory load on the database engine.
- Schema migrations must include indexing triggers for `pgvector` across all schemas.

---

## Compliance

- ADR-0009: *Schema-Per-Tenant Multi-Tenancy Strategy*
- ADR-0010: *AI Gateway Pattern*

---

## Review Trigger

Reconsider using a standalone vector database (e.g. Qdrant) if the volume of embedded documents per tenant exceeds 1,000,000 chunks, which could overload PostgreSQL query planning indexes.
