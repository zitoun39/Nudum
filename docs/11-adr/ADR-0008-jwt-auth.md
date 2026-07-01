---
title: "ADR-0008 — JWT + Refresh Tokens via HttpOnly Cookies"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
note: Updated to mandate HttpOnly cookie storage for both tokens to protect against XSS and define token revocation.
references:
  - docs/04-architecture/technology-decisions.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/06-security/security-guidelines.md
---

# ADR-0008 — JWT + Refresh Tokens via HttpOnly Cookies

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a multi-tenant enterprise portal consumed primarily by a browser-based React SPA and PWA. Authentication must be secure against token theft, support horizontal scaling, and enable instant session revocation (logout, account suspension, or key rotation) without inducing performance bottlenecks.

---

## Decision

> **We will use JWT (JSON Web Tokens) with a short-lived access token and a long-lived, rotation-based refresh token. Both tokens will be stored in secure, HttpOnly cookies. Session state and token revoking are managed via Redis.**

- **Access Token**: JWT, signed with RS256, valid for **15 minutes**. Transported via a secure, `HttpOnly`, `SameSite=Strict` cookie (`__Host-Access-Token`).
- **Refresh Token**: Opaque cryptographically secure random token, valid for **30 days** with rotation on each use. Transported via `HttpOnly`, `SameSite=Strict` cookie (`__Host-Refresh-Token`).
- **Token Storage & Revocation**: Active refresh tokens are tracked in Redis. When a user logs out, changes their password, or is suspended, their refresh token is deleted from Redis, and the access token is blacklisted in Redis for the remainder of its 15-minute validity window.
- **Payload**: `{ sub, organizationId, roles, permissions, iat, exp }`.

---

## Rationale

- **XSS Immunity**: Storing both access and refresh tokens in `HttpOnly` cookies means client-side JavaScript cannot read them. This eliminates XSS-based token theft (a major risk for LocalStorage-based tokens in React).
- **Tab Synchronization**: Because cookies are automatically attached by the browser, opening Nudum in a new tab does not require custom sync logic — it works natively.
- **Instant Revocation**: While access tokens are theoretically stateless, checking a Redis blacklist for revoked/suspended tokens during API authentication guarantees instant access cut-off (essential for utility security), while keeping latency sub-millisecond (Redis read).
- **OAuth2 Ready**: Asymmetric RS256 signing allows future external services to validate tokens using a public key endpoint without exposing signing secrets.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Bearer Header (LocalStorage) | Rejected due to XSS vulnerability. If React suffers an XSS injection, the access token is easily stolen. |
| Stateless JWT (no blacklist) | Rejected because suspended users or compromised accounts remain active for up to 15 minutes, which violates utility security protocols. |
| Classic sessions in Redis | Acceptable, but JWT payload reduces database queries for user profile/permission context on standard requests, keeping the system scalable. |

---

## Consequences

### Positive
- Immune to JavaScript XSS token extraction.
- Sub-millisecond instant session revocation via Redis blacklist.
- Native multi-tab browser support.
- Fully portable to native mobile shells (using credentialed webviews).

### Negative / Trade-offs
- Requires CORS and `credentials: 'include'` configuration on the React frontend.
- Checking Redis on each request makes the authentication verification technically stateful (but highly performant).

---

## Compliance

- Architecture Principle 13: *Security as Architecture*
- Engineering Principle 12: *Security Everywhere*

---

## Review Trigger

Reconsider if third-party public API keys are required (a separate static API Key service with raw header tokens will be introduced, not replacing this session-cookie design).
