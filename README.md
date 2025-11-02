# Aptitude Reasoning App

A cross-platform mobile application built with Ionic + Angular and Capacitor, managed with Nx.

## 🏗️ Architecture

This workspace is simplified to a single application:
- **UI App** (`ui/`) – Ionic/Angular app targeting iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS)
- npm
- iOS/Android SDKs (optional, for native builds)

### Installation
```bash
npm install
```

### Development
```bash
npx nx serve ui           # Start dev server (http://localhost:4200)
```

### Testing
```bash
npx nx test ui
```

### Build
```bash
npx nx build ui --configuration=production
```

### Mobile (Capacitor)
```bash
npx nx build ui && npx cap sync
npx cap run ios
npx cap run android
```

## 🏃‍♂️ Workspace Structure
```
aptitude-reasoning-app/
├── ui/                 # Ionic/Angular application
│   ├── src/
│   ├── project.json
│   ├── ionic.config.json
│   └── capacitor.config.ts
├── docs/
├── nx.json
├── package.json
└── tsconfig.base.json
```

## 🔧 Stack
- Angular 20
- Ionic 8
- Capacitor 7
- Tailwind CSS
- Nx 22

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security
See [SECURITY.md](./SECURITY.md).
