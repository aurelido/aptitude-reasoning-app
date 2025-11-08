# Settings / Profile Screen

Status: Implemented
Owner: Frontend
Last Updated: 2025-11-07

## Summary
A comprehensive Settings/Profile screen accessible from the bottom tab bar (Profile tab). It consolidates user identity, quick stats, app preferences, account actions, and app information with clear visual hierarchy, icons, and separators.

Route: `/tabs/profile`
Entry points:
- Bottom navigation → Profile
- Programmatic navigation via router: `this.router.navigate(['/tabs/profile'])`

## Objectives
- Provide a single destination for profile and settings actions
- Surface primary stats at a glance
- Offer quick access to theme, notifications, language, and difficulty preferences
- Make account management actions prominent
- Include about/version and a clear logout action

## UX Structure

A. ProfileSummary
- Editable avatar with camera button overlay (placeholder behavior; ready to wire to camera/gallery)
- Name & email pulled from `AuthStore.user` (falls back to demo values)
- Level badge: “Intermediate Thinker 🧠” with gradient background
- Quick stats grid (4 metrics):
  - Tests Completed: 12
  - Accuracy: 78%
  - Achievements: 8
  - Study Time: 24h

B. PreferencesSection
- Theme Mode: toggle for light/dark (applies immediately and persists locally)
- Notifications: toggle for daily practice reminders (local signal; ready to wire to backend/push settings)
- Language: select (English, Spanish, French, German, Hindi)
- Default Difficulty: select (Easy, Medium, Hard)

C. AccountSection
- Edit Profile: gradient card with chevron (placeholder navigation)
- Change Password: gradient card with chevron (placeholder navigation)

D. AppInformationSection
- About APTIMIND: navigation placeholder
- Version: `1.0.0 (Build 100)`
- Log Out: red-themed item; clears auth and navigates to `/login`

## Visual/Interaction Notes
- Uses Ion components (`ion-list`, `ion-item`, `ion-select`, `ion-toggle`, `ion-card`)
- Consistent spacing and rounded card surfaces
- Clear separators via Ionic list lines
- Gradients for level badge and account action cards to create hierarchy
- Accessible iconography and text labels

## Files
- Page (standalone):
  - `ui/src/app/pages/profile/profile.page.ts`
  - `ui/src/app/pages/profile/profile.page.html`
  - `ui/src/app/pages/profile/profile.page.scss`
- Supporting services/state used:
  - `ui/src/app/core/auth.store.ts` (user + token, signals)
  - `ui/src/app/core/auth.service.ts` (login/logout)
  - `ui/src/app/core/theme.service.ts` (persist/apply dark mode)
  - Interceptors already configured in `AppModule` (auth/error)
- Navigation:
  - Tab route: `ui/src/app/tabs/tabs-routing.module.ts` → `path: 'profile'`

## Data & State
- User identity: `AuthStore.user` signal (fallback demo values if absent)
- Stats: currently hard-coded demo values (replace with API data in the future)
- Preferences:
  - Theme: `ThemeService.apply(dark: boolean)` persists locally and toggles classes
  - Notifications / Language / Difficulty: local signals; ready to be persisted via API

## API Integration
- Current: Logout only (client-side clear). Login handled in the Login screen.
- Planned endpoints:
  - `GET /v1/users/me` → hydrate profile & preferences
  - `PATCH /v1/users/me` → update name/avatar
  - `PATCH /v1/users/me/preferences` → update notification/language/difficulty/theme

## Navigation & Guards
- Tabs are protected with `authGuard`; unauthenticated users are redirected to `/login`
- Logout navigates to `/login` and clears state

## Theming
- Dark mode toggle changes document classes (`ion-palette-dark` and `body.dark`)
- Persists preference to `localStorage`

## Accessibility
- Icons include text labels; items use proper roles via Ionic components
- High-contrast gradients and readable font sizes
- Ensure focus states on interactive elements (Ion handles focus management)

## Testing Checklist
- Rendering
  - Profile screen loads under `/tabs/profile` when authenticated
  - All sections visible with proper spacing and separators
- Interactions
  - Theme toggle applies/removes dark mode and persists across refresh
  - Language and Difficulty selections update the signal values
  - Notifications toggle updates state
  - Action cards (“Edit Profile”, “Change Password”) are tappable (placeholders for now)
  - Logout clears auth and redirects to `/login`; protected routes then require login
- Responsiveness
  - Works on small/large phones and tablets
  - No clipped content or overflow
- Accessibility
  - Tab order is logical; elements are reachable

## Future Enhancements
- Wire avatar edit to camera/gallery (Capacitor Camera or file picker)
- Connect stats to real API (tests completed, accuracy, achievements, study time)
- Add “Edit Profile” and “Change Password” pages with proper forms + API
- Persist preferences to backend and hydrate on load
- Add About page with license/credits and links
- Add analytics events for preference changes and logout

## Example Usage
- Navigate programmatically to Settings/Profile:
  ```ts
  this.router.navigate(['/tabs/profile']);
  ```

## Screenshots
- Refer to Figma source for design reference.
