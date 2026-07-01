---
title: "ADR-0008 — JWT + Refresh Tokens for Authentication"
status: Accepted
date: 2026-07-01
deciders: Abdelhak Zitoun
category: ADR
references:
  - docs/04-architecture/technology-decisions.md
  - docs/11-adr/ADR-0009-multi-tenancy.md
  - docs/06-security/security-guidelines.md
---

# ADR-0008 — JWT + Refresh Tokens for Authentication

> **Status**: Accepted — 2026-07-01

---

## Context

Nudum is a multi-tenant SaaS platform serving organizations through a REST API consumed by:
- A React SPA (web browser)
- A PWA (mobile browser)
- Future native mobile applications
- Future AI agents and integrations

The authentication mechanism must:
- Be stateless (support horizontal scaling without session affinity).
- Include the authenticated user's identity and tenant context in every API request.
- Support token revocation (logout, compromised token scenarios).
- Support future OAuth2 / OpenID Connect / SAML federation (LDAP, Azure AD, Google Workspace).
- Not require a third-party identity provider in the initial implementation.

---

## Decision

> **We will use JWT (JSON Web Tokens) with a short-lived access token and a long-lived, rotation-based refresh token.**

- **Access token**: JWT, signed with RS256 (asymmetric), valid for **15 minutes**.
- **Refresh token**: Opaque random token, stored hashed in PostgreSQL, valid for **30 days** with rotation on each use.
- **Refresh token rotation**: Each refresh issues a new refresh token and invalidates the previous one. Theft detection: if an already-used refresh token is presented, all tokens for that user are immediately revoked.
- **Token payload**: `{ sub, organizationId, roles, permissions, iat, exp }`.
- **Transport**: Access tokens via `Authorization: Bearer` header. Refresh tokens via `HttpOnly` secure cookie (SameSite=Strict).

---

## Rationale

- **Stateless access tokens**: No database lookup per API request for the access token. Tenant context (`organizationId`) is embedded in the JWT payload, enabling tenant isolation enforcement without a DB query.
- **Short-lived access tokens (15 min)**: Minimizes the attack window if a token is intercepted.
- **Refresh token rotation**: Provides silent token refresh UX while detecting token theft.
- **HttpOnly cookie for refresh token**: Prevents JavaScript access to the long-lived token (XSS mitigation).
- **RS256 signing**: Asymmetric keys allow future microservices to validate tokens using only the public key, without requiring access to the signing secret.
- **No third-party IdP required initially**: Organizations can authenticate with email/password immediately. OAuth2/OIDC/SAML can be added as the platform grows without changing this core token strategy.

---

## Alternatives Considered

| Option | Reason Not Chosen |
|---|---|
| Session-based (server-side sessions) | Requires session store shared across instances. Adds Redis as a session dependency. Doesn't embed tenant context. |
| JWT only (no refresh tokens) | Long-lived JWTs cannot be revoked. Compromised tokens remain valid until expiry. |
| Auth0 / Clerk / Supabase Auth | Third-party dependency. Not available on-premise. Data sovereignty concerns for Algerian public institutions. |
| API Keys only | Insufficient for interactive user sessions. No MFA, no session expiry, no user-level revocation. |

---

## Consequences

### Positive
- Stateless API — horizontally scalable without session affinity.
- Tenant context available in every request without DB lookup.
- Token theft detection through refresh token rotation.
- Foundation for future OAuth2/OIDC/SAML federation.

### Negative / Trade-offs
- Access tokens cannot be immediately revoked between the 15-minute expiry window.
- Refresh token rotation logic must be implemented carefully to avoid race conditions (concurrent requests with the same refresh token).

---

## Compliance

- Architecture Principle 13: *Security as Architecture* — authentication is a platform concern, not a module concern.
- Engineering Principle 12: *Security Everywhere* — every API endpoint validates the JWT.
- Engineering Principle 13: *Multi-Tenant Safety* — `organizationId` in JWT enforces tenant boundary.

---

## Review Trigger

Reconsider access token lifetime if regulatory requirements specify shorter windows. Introduce OAuth2/OIDC when enterprise customers require SSO with Azure AD or Google Workspace.
