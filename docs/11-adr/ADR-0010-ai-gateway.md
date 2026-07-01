---
title: "ADR-0010 — AI Gateway Pattern (Provider-Agnostic AI Integration)"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/core-platform.md
  - docs/04-architecture/system-architecture.md
  - docs/03-domain/bounded-contexts.md
---

# ADR-0010 — AI Gateway Pattern (Provider-Agnostic AI Integration)

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is AI-native. AI capabilities are required across multiple modules:

- **Archivi**: Semantic document search, OCR post-processing, document summarization.
- **Jawdati**: Laboratory result anomaly detection, report drafting, parameter recommendations.
- **Mahattati**: Predictive maintenance recommendations, operational anomaly detection.
- **Core**: Intelligent notifications, cross-module knowledge retrieval.

The AI landscape is evolving rapidly. Provider lock-in (OpenAI, Anthropic, Google, etc.) would require significant refactoring when switching providers. Local LLMs (Ollama, LM Studio, vLLM) are increasingly viable for on-premise deployments with data sovereignty requirements.

---

## Decision

> **All AI capabilities will be exposed through a centralized AI Gateway service within the Core Platform. Business modules never call LLM providers directly.**

The AI Gateway provides:

1. **Provider abstraction**: A unified interface that routes requests to OpenAI, Anthropic, Google Gemini, or local models based on configuration. Changing the provider requires only an environment variable change, not code changes.
2. **Prompt management**: Versioned prompt templates stored in the database. Prompts are owned by the platform, not embedded in business logic.
3. **Context assembly**: The Gateway assembles the user's organizational context, relevant domain data, and knowledge base snippets before calling the LLM.
4. **Token accounting**: All AI usage is tracked per tenant, per model, per feature. Enables billing and rate limiting.
5. **Rate limiting**: Per-tenant and per-user AI request rate limits.
6. **Semantic search**: The Gateway manages vector embeddings and similarity search (initially via `pgvector` PostgreSQL extension).
7. **Response caching**: Identical prompts with identical context return cached responses to reduce cost.

---

## Rationale

- **Provider independence**: OpenAI, Anthropic, Google, and local models all have different APIs, pricing, capability sets, and data residency policies. A gateway abstracts these differences.
- **On-premise AI**: Algerian public institutions may require local LLM deployment. The Gateway routes to Ollama or vLLM without any business module changes.
- **Cost control**: Centralized token accounting prevents runaway AI costs across modules.
- **Security**: The Gateway enforces that AI only receives data the tenant has authorized it to see. Business modules cannot accidentally send cross-tenant data to an LLM.
- **Prompt governance**: Prompt templates are versioned and auditable. Changes to AI behavior go through the same documentation-first process as code changes.
- **Future-proofing**: When a better model becomes available, updating the Gateway config is sufficient. No business module refactoring required.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Each module calls LLM providers directly | Provider lock-in. No centralized cost control. Cross-tenant data leakage risk. No prompt versioning. No caching. |
| Third-party AI middleware (LangChain, LlamaIndex) | Heavy dependencies, rapidly evolving APIs, insufficient control over prompt management and security boundaries. Can be used internally by the Gateway, not as the external boundary. |
| No AI initially | Contradicts the AI-native platform vision. The Gateway architecture must be established before any module implements AI features. |

---

## Consequences

### Positive
- Zero business module changes when switching AI providers.
- Centralized security, auditing, and cost visibility.
- On-premise AI deployment possible without code changes.
- Consistent AI behavior across all modules.
- Prompt changes are governed and versioned.

### Negative / Trade-offs
- The Gateway is a Core Platform component that must be designed before modules can use AI.
- An additional latency hop (Gateway → Provider) compared to direct API calls. Acceptable given the benefits.
- The Gateway becomes a single point of failure for AI features. Implement circuit breakers and graceful degradation.

---

## Supported Providers (Initial)

| Provider | Model(s) | Use Case |
|---|---|---|
| OpenAI | GPT-4o, GPT-4o-mini | Cloud SaaS deployments |
| Anthropic | Claude Sonnet, Claude Haiku | Cloud SaaS deployments |
| Google | Gemini 1.5 Pro, Gemini Flash | Cloud SaaS deployments |
| Ollama (local) | Llama 3, Mistral, Phi-3 | On-premise deployments |

---

## Compliance

- Architecture Principle 12: *AI as a Platform Service*
- Architecture Principle 18: *Technology Independence* — AI provider is replaceable.
- Architecture Principle 13: *Security as Architecture* — tenant-scoped AI access.
- Core Platform: Business modules consume AI through the Gateway API only.

---

## Review Trigger

Reconsider the vector database strategy when semantic search volume exceeds `pgvector` capacity (would introduce a dedicated vector DB such as Qdrant or Weaviate, managed by the Gateway — no business module changes).
