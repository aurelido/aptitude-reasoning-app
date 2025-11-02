# Deployment Guide

This guide documents how to build and deploy the mobile app.

## Web Build (PWA or Web Host)

```bash
npx nx build ui --configuration=production
# Deploy contents of dist/ui/browser to your hosting provider (e.g., Netlify, Vercel, S3 + CloudFront)
```

## Mobile (Capacitor)

```bash
npx nx build ui
npx cap sync
npx cap run ios --configuration Release
npx cap run android --variant release
```

## CI/CD (Example)

- Lint, test, build on PRs
- Release on main merges with semantic versioning
- Upload artifacts for web build
