# Edit Profile Screen (Avatar Picker)

Status: Implemented
Owner: Frontend
Last Updated: 2025-11-09

## Summary
A dedicated screen to edit personal information and choose a profile avatar. Includes gating of avatars based on subscription status (6 free, 10 locked for subscribers).

Route: `/tabs/profile/edit`
Entry points: from Profile screen via avatar camera button or "Edit Profile" card.

## UX
- Personal info form: first name, last name, display name
- Avatar grid: 16 avatars (4x4)
  - Avatars 1–6: free tier
  - Avatars 7–16: show lock icon for non‑subscribers; tapping shows toast
- Save button in header

## Files
- `ui/src/app/pages/edit-profile/edit-profile.page.ts`
- Store update helper: `ui/src/app/core/auth.store.ts` → `updateUser()`

## Assets
- Expected avatar files: `assets/avatars/avatar-01.png` … `avatar-16.png`
- Default image on Profile page: `assets/avatars/default.png`

## API Integration
- Save calls: `PATCH /v1/users/me` with `{ firstName, lastName, displayName, avatar }`
- On success, synchronizes `AuthStore.user` with the response (name, initials, avatar)

## Acceptance Criteria
- Form prefilled with current user
- Avatar selection respects subscription gating
- Save persists to server and updates local store
- Navigation returns to Profile screen

## Testing
- Select a locked avatar as non‑subscriber → toast shown, no change
- Select a free avatar → highlight selection
- Save → PATCH executed; Profile screen shows updated info
