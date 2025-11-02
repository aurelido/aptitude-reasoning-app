# Getting Started

This guide explains how to set up your local environment and run the mobile app.

## Prerequisites

- Node.js 20+
- npm
- iOS/Android SDKs for mobile (optional)

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create `.env` files as needed (do not commit secrets):

- `ui/.env` – app config (e.g., API_BASE_URL)

## Start Development

```bash
npx nx serve ui
```

## Testing

```bash
npx nx test ui
```

## Building for Production

```bash
npx nx build ui --configuration=production
```

## Mobile (Capacitor)

```bash
# Build, then sync to native
npx nx build ui && npx cap sync
npx cap open ios
npx cap open android
```
