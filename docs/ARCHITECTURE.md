# Architecture Overview

This document describes the simplified architecture focused on a single Ionic/Angular application.

## Monorepo (Nx)

- Nx manages build, test, and lint for the `ui` application.
- Shared libraries can be added later under `libs/` as the app grows.

## Application (ui)

- Angular standalone components
- Global styles with SCSS and Tailwind CSS
- Router with lazy-loaded features
- RxJS services for state and data access
- Capacitor plugins for native capabilities (Haptics, Keyboard, StatusBar, etc.)

## Cross-Cutting Concerns

- Authentication (future): OAuth2/PKCE with Capacitor support
- Internationalization (i18n) (future)
- Analytics (future)
- Error handling and logging

## Build & Deploy

- Web: Angular build outputs to `dist/ui/browser` (hashing in production)
- Mobile: Capacitor sync to native projects
