# Keycloak Infrastructure (Docker) and Realm Export

Status: Implemented
Owner: DevOps
Last Updated: 2025-11-09

## Summary
A self-contained Keycloak + Postgres stack with realm import. Includes an export that defines the `aptimind` realm, public PKCE client, roles, and protocol mappers.

## Files
- Compose: `infra/keycloak/docker-compose.yml`
- Realm export: `infra/keycloak/aptimind-realm.json`

## How to Run
1. `cd infra/keycloak`
2. `docker compose up -d`
3. Open http://localhost:8080 → login: `admin` / `admin`
4. Realm `aptimind` is imported automatically on first start

## Realm Contents
- Roles: `ROLE_USER`, `ROLE_PREMIUM`, `ROLE_ADMIN`
- Client: `aptimind-ui` (public, PKCE S256 required)
  - Redirect URIs: `http://localhost:4200/*`, `http://localhost:8100/*`
  - Scopes: `profile`, `email`, `roles`, `web-origins`
  - Optional: `offline_access`
- Protocol Mappers:
  - Realm roles → `realm_access.roles`
  - User attributes: `subscription`, `country`, `progressLevel`

## Tokens and Lifetimes
- Access Token: 900s (15 min)
- Refresh Token: rotation enabled (Revoke on use)

## Notes
- For HTTPS or non-local domains set env vars: `COOKIE_DOMAIN`, `SECURE_COOKIES=true`
- Update redirect URIs and web origins when deploying
