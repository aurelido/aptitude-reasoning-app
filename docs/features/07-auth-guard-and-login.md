# Auth Guard and Login Screen

Status: Implemented (guard + login screen); IdP flow added (Keycloak PKCE via /oauth)
Owner: Frontend
Last Updated: 2025-11-09

## Summary
Protects application routes using an auth guard and provides a login screen. Guard redirects unauthenticated users to `/login` with a `redirect` query param. The login screen (current) authenticates via backend API; for IdP (Keycloak) the screen triggers the `/oauth/login` flow.

## User Story
As a user, I want to be required to sign in before using the app so that my data is secure and personalized.

## Flow
- Unauthenticated access to `/tabs/*` → `authGuard` redirects to `/login?redirect=/tabs/...`
- Login options:
  - Local API login (current): `POST /v1/auth/login` returns `{ token, user }` → set auth state and redirect
  - IdP (Keycloak PKCE): navigate to `/oauth/login` which redirects to Keycloak; upon callback the refresh cookie is stored; frontend requests access token via `/oauth/refresh`

## Routes
- `/login` (standalone component)
- Guarded: `/tabs/**` (see `app-routing.module.ts`, `tabs-routing.module.ts`)

## Files
- `ui/src/app/core/auth.guard.ts`
- `ui/src/app/pages/login/login.page.ts`
- `ui/src/app/app-routing.module.ts` (guard applied to `tabs`)

## Acceptance Criteria
- Guard prevents access to any `/tabs/**` route when not authenticated
- After login, user is redirected to the originally requested URL
- Error feedback shown for failed logins

## Security Notes
- Do not store tokens in localStorage when using IdP; prefer httpOnly refresh cookie via BFF and in‑memory access token
- Never log token contents

## Testing
- Attempt visiting `/tabs/home` when not logged in → redirected to `/login`
- Submit invalid credentials → error toast
- Valid login → redirected to `/tabs/home` (or `redirect` target)
