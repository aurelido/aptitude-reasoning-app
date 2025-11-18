# Backend Setup & API Implementation

## Overview

The backend API is implemented as a TypeScript Express server that follows the data models and API specification defined in `serve/src/backend-models.ts` and `docs/api-endpoints.md`.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT with bcryptjs
- **Data**: In-memory stores (Maps) for development
- **Documentation**: Swagger UI (dev mode only)
- **Development**: ts-node-dev for hot reload

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run api:dev
```

The API will be available at: `http://localhost:4000/v1`

### 3. View API Documentation (Dev Only)
Navigate to: `http://localhost:4000/v1/docs`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run api:dev` | Start development server with hot reload |
| `npm run api:build` | Build TypeScript to JavaScript |
| `npm run api:start` | Start production server (requires build) |

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Express app setup & middleware
│   ├── auth.ts           # JWT utilities & auth middleware
│   ├── data.ts           # In-memory data stores & seed data
│   └── routes/           # API route handlers
│       ├── auth.ts       # POST /auth/register, /auth/login
│       ├── users.ts      # GET,PATCH /users/me, /users/me/preferences
│       ├── categories.ts # GET /categories, /categories/:slug
│       ├── topics.ts     # GET /topics/:slug, /topics/:slug/tests
│       ├── tests.ts      # Test management & attempts
│       └── home.ts       # GET /home (HomeScreenData)
└── tsconfig.json         # TypeScript config for server
```

## API Endpoints

### Authentication
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login and get JWT token

### User Management
- `GET /v1/users/me` - Get user profile
- `PATCH /v1/users/me` - Update user profile
- `GET /v1/users/me/preferences` - Get user preferences
- `PATCH /v1/users/me/preferences` - Update preferences

### Content
- `GET /v1/home` - Complete home screen data (authenticated)
- `GET /v1/categories` - List categories (with optional progress)
- `GET /v1/categories/:slug` - Get specific category
- `GET /v1/categories/:slug/topics` - List topics in category
- `GET /v1/topics/:slug` - Get topic details
- `GET /v1/topics/:slug/tests` - List tests in topic

### Test Taking
- `GET /v1/tests/:testId` - Get test with questions
- `POST /v1/tests/:testId/start` - Start test attempt
- `POST /v1/tests/:testId/attempts/:attemptId/answer` - Submit answer
- `POST /v1/tests/:testId/attempts/:attemptId/complete` - Complete test
- `GET /v1/tests/:testId/attempts/:attemptId/resume` - Resume test

## Authentication Flow

1. **Register**: `POST /v1/auth/register` with email, password, firstName, lastName
2. **Login**: `POST /v1/auth/login` with email, password
3. **Use Token**: Include `Authorization: Bearer <jwt_token>` in subsequent requests

## Data Storage (Development)

Currently using in-memory Maps for development:
- Users and profiles
- Categories, topics, tests, questions
- Test attempts and progress tracking
- Daily challenges

**Seed Data**: Includes sample user "Sarah Johnson" and "Numerical Reasoning" category with basic content.

## Configuration

Environment variables:
```bash
NODE_ENV=development
PORT=4000
JWT_SECRET=dev_secret_change_me
JWT_EXPIRES_IN=7d
```

## Swagger Documentation

## Rate Limiting

- Window: 1 hour
- Free tier: 100 requests/hour (default)
- Headers exposed:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset` (epoch seconds)

Applied to authenticated routes like `GET /v1/home`.

In development mode, Swagger UI is automatically enabled at `/v1/docs`.

Key routes are annotated with OpenAPI 3.1 specifications:
- Request/response schemas
- Authentication requirements
- Error responses

## Error Handling

All endpoints return consistent error format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing fields", 
    "details": { "field": "email" }
  }
}
```

Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`

## Production Considerations

### Database Migration
For production, replace in-memory stores with:
- **PostgreSQL** with Prisma ORM
- **Redis** for caching and sessions
- **MongoDB** alternative for document storage

### Security Enhancements
- Use strong JWT secrets
- Add rate limiting
- Implement refresh token rotation
- Add request validation middleware
- Enable HTTPS only

### Infrastructure
- Docker containerization
- Environment-specific configs
- Logging with structured format
- Health checks and monitoring
- Horizontal scaling support

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:4000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Home Data:**
```bash
curl -X GET http://localhost:4000/v1/home \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Frontend
Update `ui/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:4000/v1'
};
```

## Troubleshooting

### TypeScript Errors
- Ensure server/tsconfig.json has correct module settings
- Run `npm run api:build` to check compilation

### Port Already in Use
- Change PORT in environment or kill existing process
- Default: http://localhost:4000/v1

### JWT Issues
- Check JWT_SECRET is set
- Verify token format: `Bearer <token>`
- Token expires in 7 days by default

## Next Steps

1. **Database Integration**: Replace in-memory storage with persistent database
2. **Advanced Features**: Progress tracking, recommendations, daily challenges
3. **Performance**: Add caching, query optimization
4. **Security**: Rate limiting, input validation, HTTPS
5. **Testing**: Unit tests, integration tests, API tests
6. **Deployment**: Docker, CI/CD, monitoring

---

For detailed API specification, see `docs/api-endpoints.md`.
For data models, see `docs/backend-models.ts`.