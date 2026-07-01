---
title: "ADR-0010 — AI Gateway Pattern"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
note: Amends prompt management strategy to keep prompt templates inside code rather than the database, preventing parser-template version drift.
references:
  - docs/04-architecture/architecture-principles.md
  - docs/04-architecture/core-platform.md
  - docs/04-architecture/system-architecture.md
---

# ADR-0010 — AI Gateway Pattern

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is an AI-native platform. AI capabilities are used by several business modules (Archivi OCR, Jawdati anomalies, Mahattati maintenance). To protect against LLM provider lock-in and enable compliance with data residency laws (requiring local Ollama/vLLM models for Algerian public utilities), a provider-agnostic abstraction is required. 

However, LLM prompt engineering is highly coupled to:
- The specific model being used (e.g., prompt formatting for Claude vs GPT-4).
- The application code that dynamically formats prompt variables.
- The response parsers (Zod schemas) that parse the LLM's output.

Storing prompt templates in a database separately from the code introduces a high risk of version mismatch, leading to runtime JSON parsing failures.

---

## Decision

> **We will utilize a centralized AI Gateway within the Core Platform for model abstraction, request routing, token accounting, and cost auditing. However, prompt templates, context assembly, and response parsing will reside in the application code of the respective business modules.**

Responsibilities:
- **AI Gateway (Core Platform Service)**:
  - Abstracts LLM endpoints (OpenAI, Anthropic, Google, local Ollama).
  - Handles API authentication, rate limiting, and response caching.
  - Logs token usage per tenant for billing and audit reporting.
- **Business Modules (Mahattati, Jawdati, Archivi)**:
  - Define prompt templates in code files versioned via Git.
  - Compile prompt variables and assemble local context.
  - Define Zod schemas and parse LLM outputs.

---

## Rationale

- **No Prompt-Parser Drift**: Storing prompts in code alongside their schema parsers ensures they are deployed together. If a prompt's JSON output structure changes, the code parser is updated in the same commit.
- **Model Independence**: The AI Gateway allows switching the underlying provider (e.g. from OpenAI to local Ollama) by changing a configuration environment variable without modifying the business module.
- **Data Sovereignty Compliance**: The Gateway can dynamically route calls to local private LLM servers for on-premise government installations.
- **Auditing and Cost Metrics**: Token accounting is centralized, preventing runaway costs.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Prompts stored in DB | Rejected due to synchronization risks. Database updates to prompts could silently break code parsers, causing runtime exceptions. |
| Direct module calls to LLM | Rejected due to provider lock-in, duplicate configuration, and lack of centralized token/cost auditing. |

---

## Consequences

### Positive
- Type-safe, version-controlled prompt templates.
- Centralized security, rate-limiting, and cost control at the Gateway.
- Graceful degradation fallback routines are easy to implement in code.

### Negative / Trade-offs
- Business modules cannot modify prompts in real-time without a code deployment.
- The AI Gateway is a runtime dependency for AI features.

---

## Compliance

- Architecture Principle 12: *AI as a Platform Service*
- Architecture Principle 18: *Technology Independence*

---

## Review Trigger

Reconsider if a third-party open-source AI gateway (e.g., LiteLLM, Portkey) satisfies Nudum's security and multi-tenant requirements (which could replace our custom gateway wrapper).
