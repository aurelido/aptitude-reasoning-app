# OAuth 2.1 Authorization Code Flow with PKCE (Keycloak)

Status: Implemented (BFF pattern for web)
Owner: Backend + Frontend
Last Updated: 2025-11-09

## Summary
Implements Authorization Code Flow with PKCE using Keycloak as the IdP. The backend exposes `/oauth` endpoints to initiate login, handle callback, rotate refresh tokens, and logout. Access tokens are short‑lived; refresh tokens are stored as httpOnly cookies for web.

## Architecture
- Web: Backend-for-frontend (BFF)
  - /oauth/login → redirect to Keycloak with PKCE challenge
  - /oauth/callback → exchange code + verifier, set refresh token cookie
  - /oauth/refresh → rotate refresh token, return short‑lived access token (and ID token)
  - /oauth/logout → revoke and clear refresh token
- Mobile: May store tokens in secure storage and hit token endpoint directly (optional)

## Security
- Public client (no client secret)
- PKCE S256 required
- Refresh token rotation enabled
- Access Token: ~15m
- Refresh Token: long‑lived; stored httpOnly, SameSite=Lax; never logged
- JWT validation using JWKS (iss, aud, exp), with roles and custom attributes

## Routes
- GET `/oauth/login`
- GET `/oauth/callback`
- POST `/oauth/refresh`
- POST `/oauth/logout`

## Middleware
- `authJwt` validates bearer tokens via Keycloak JWKS
- `requireRole` and `requireAttributes` enforce RBAC/ABAC

## Files
- `server/src/oauth/keycloakRouter.ts`
- `server/src/middleware/jwt.ts`
- `server/src/index.ts` (CORS + cookies + /oauth mount)

## Env Vars
- `KEYCLOAK_ISSUER` (e.g., `http://localhost:8080/realms/aptimind`)
- `KEYCLOAK_CLIENT_ID=aptimind-ui`
- `KEYCLOAK_REDIRECT_URI=http://localhost:4000/oauth/callback`
- `KEYCLOAK_POST_LOGOUT_REDIRECT_URI=http://localhost:4000/`
- `TOKEN_COOKIE_NAME=rt`
- `COOKIE_DOMAIN` (optional)
- `SECURE_COOKIES=true` (for HTTPS)

## RBAC & ABAC
- RBAC roles: ROLE_USER, ROLE_PREMIUM, ROLE_ADMIN (realm roles)
- ABAC attributes: subscription, country, progressLevel (token claims)
- Examples:
  - `requireRole('ROLE_PREMIUM')`
  - `requireAttributes(a => (a.progressLevel ?? 0) > 5)`

## CORS & Rate Limiting
- CORS restricts origins to app hosts; credentials enabled for cookie
- Rate limit applied to /oauth endpoints

## Acceptance Criteria
- /oauth/login redirects to Keycloak; callback sets refresh cookie
- /oauth/refresh returns a valid access token and rotates refresh token
- Protected API routes accept bearer access tokens validated via JWKS
- Logout clears cookie and triggers IdP logout

## Testing
- Start Keycloak and server; follow login flow in browser
- Inspect network: refresh calls return new AT; cookie rotates as RT is issued
- Hit protected endpoint with AT → 200; expired AT → 401 then retry after refresh
