# Preferences Sync (UI ↔ Backend)

Status: Implemented
Owner: Frontend + Backend
Last Updated: 2025-11-09

## Summary
Preferences on the Profile screen are hydrated from the backend and persisted when changed. Includes mapping between UI difficulty and server difficulty, and immediate theme application.

## Scope
- Hydrate via `GET /v1/users/me/preferences`
- Persist on each change via `PATCH /v1/users/me/preferences`
- UI controls: Theme toggle, Notifications toggle, Language select, Default Difficulty select

## Files
- UI Page: `ui/src/app/pages/profile/profile.page.ts` (handlers and ngOnInit hydration)
- API: `ui/src/app/core/users.api.ts`
- Theme: `ui/src/app/core/theme.service.ts`

## Mappings
- Theme: UI darkMode → server `theme: 'dark' | 'light'` (server may support `'auto'`)
- Notifications: UI toggle → server `dailyChallengeReminder: boolean`
- Language: UI value → server `language: 'en' | 'es' | 'fr' | 'de' | 'hi'`
- Difficulty:
  - UI: `easy | medium | hard`
  - Server: `beginner | intermediate | advanced`

## UX
- On load, preferences are fetched and applied
- Theme toggle takes effect immediately; also persisted
- Errors use the global ErrorInterceptor → toast

## Acceptance Criteria
- All controls reflect server state on load
- Changes are PATCHed; future reloads show updated values
- Theme change updates document class and persists

## Testing
- Start with known server prefs; load Profile → UI matches
- Toggle each control; verify PATCH payloads and server changes
- Reload; verify persistence
