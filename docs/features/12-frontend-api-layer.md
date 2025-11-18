# Frontend API & Error Handling Layer

Status: Implemented
Owner: Frontend
Last Updated: 2025-11-09

## Summary
Provides a thin HTTP wrapper (`ApiService`), global interceptors (Authorization and Error), and services for auth, users, and categories. Unifies error notifications via Ionic toasts and supports environment-based base URL.

## Files
- Core HTTP
  - `ui/src/app/core/api.service.ts` (base URL + get/post/patch/delete)
  - `ui/src/app/core/auth.interceptor.ts` (adds Authorization header from state)
  - `ui/src/app/core/error.interceptor.ts` (handles HttpErrorResponse → toast)
  - `ui/src/app/core/error.service.ts` (toast + message extraction)
- Auth & State
  - `ui/src/app/core/auth.store.ts` (signal-based store; token+user; updateUser)
  - `ui/src/app/core/auth.service.ts` (login/register/logout)
  - `ui/src/app/core/theme.service.ts` (dark mode)
- APIs
  - `ui/src/app/core/users.api.ts` (profile + preferences)
  - `ui/src/app/core/category.api.ts` (example list/bySlug)

## Configuration
- `environment.apiBaseUrl` is used by `ApiService`
  - Dev: `http://localhost:4000/v1`
  - Prod: `/v1` (behind the same origin)

## Behavior
- All errors surface as toasts; messages extracted from backend error envelope
- Authorization header is attached when token is present in store

## Acceptance Criteria
- Requests go through `ApiService`
- Errors produce meaningful toast messages
- Authorization header present when authenticated
