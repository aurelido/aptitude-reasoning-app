# API Overview

This document describes the backend API endpoints (NestJS).

> Note: Replace placeholders with actual endpoints as the API evolves.

## Base URL

```
http://localhost:3333
```

## Authentication

TBD (e.g., JWT/OAuth2/PKCE)

## Endpoints

- `GET /health` – Service health check
- `GET /questions` – List aptitude questions (query params: `category`, `difficulty`, `page`)
- `POST /answers` – Submit answers
- `GET /results/:id` – Fetch results

## Error Handling

- Standardized error responses with HTTP status codes
- Use problem+json format (future)

## Versioning

- Prefix endpoints with `/api/v1` when versioning is introduced
