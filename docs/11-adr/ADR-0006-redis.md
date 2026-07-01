---
title: "ADR-0006 — Redis for Cache, Session, and Background Queue"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/system-architecture.md
  - docs/04-architecture/technology-decisions.md
---

# ADR-0006 — Redis for Cache, Session, and Background Queue

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum requires three distinct runtime capabilities beyond the primary database:

1. **Caching** — Frequently read reference data (organizations, roles, permissions) should not hit PostgreSQL on every request.
2. **Session management** — JWT refresh tokens and rate limiting state must persist across API instances.
3. **Background job queue** — OCR processing, report generation, notification delivery, and AI requests must execute asynchronously without blocking HTTP responses.

A single technology should cover all three to minimize operational complexity.

---

## Decision

> **We will use Redis for caching, session/token storage, rate limiting, and background job queues.**

- Cache: `@nestjs/cache-manager` with `cache-manager-redis-store`
- Background queues: `@nestjs/bullmq` (BullMQ uses Redis internally)
- Rate limiting: `@nestjs/throttler` with Redis store
- Distributed locks: `redlock` for coordinating scheduled jobs across instances

---

## Rationale

- **Single technology**: One Redis instance covers all three concerns, reducing infrastructure complexity.
- **In-memory speed**: Cache reads are 10–100× faster than PostgreSQL queries.
- **BullMQ maturity**: The most battle-tested Node.js queue library, built on Redis. Supports retries, dead-letter queues, priority queues, rate limiting, and job scheduling.
- **TTL support**: Redis native key expiration is ideal for session tokens and temporary data.
- **On-premise ready**: Redis runs on any Linux server or Docker container. No cloud dependency.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| In-memory cache (Node.js) | Not shared across multiple application instances. Fails when scaling horizontally. |
| RabbitMQ (queues) | Additional infrastructure component. BullMQ on Redis is simpler and covers Nudum's queue requirements without adding RabbitMQ. |
| PostgreSQL LISTEN/NOTIFY (queues) | Not designed as a job queue. No retry logic, priority, or dead-letter support built in. |
| Memcached | No persistence, no pub/sub, no queue support. Redis is strictly more capable. |

---

## Consequences

### Positive
- Three capabilities from one infrastructure component.
- Sub-millisecond cache read latency.
- Reliable background job processing with automatic retry.
- Distributed rate limiting works across multiple app instances.

### Negative / Trade-offs
- Redis is in-memory — data loss on crash without persistence (AOF/RDB). Configure persistence for production.
- Redis is never the primary data source — all critical data is in PostgreSQL.
- A Redis outage would disable background jobs, caching, and rate limiting simultaneously (but not the core business data).

---

## Compliance

- Architecture Principle 14: *Asynchronous Processing* — background jobs prevent blocking user requests.
- Architecture Principle 15: *Stateless Application Layer* — application state lives in Redis, not in application memory.

---

## Review Trigger

Reconsider if background job volume requires dedicated infrastructure (e.g., a dedicated BullMQ cluster). Reconsider if message ordering guarantees or event sourcing become requirements (would warrant evaluating Kafka).
