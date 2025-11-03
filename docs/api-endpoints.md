# API Endpoints Documentation

This document outlines the REST API endpoints needed to support the Aptitude Reasoning App, particularly the Home Screen functionality.

## Base URL
```
https://api.aptitude-app.com/v1
```

## Authentication
All endpoints (except auth) require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

---

## 📱 Home Screen Endpoints

### GET /home
**Description**: Fetch all data needed for the Home Screen in a single request.

**Response**: `HomeScreenData`
```json
{
  "user": { /* UserProfile */ },
  "unreadNotifications": 3,
  "continueActivity": {
    "type": "topic",
    "id": "topic-123",
    "title": "Numerical Reasoning",
    "subtitle": "Ratios & Proportions",
    "progress": 68,
    "resumeUrl": "/categories/numerical-reasoning/topics/ratios-proportions/practice"
  },
  "dailyChallenge": {
    "challenge": { /* DailyChallenge */ },
    "userAttempt": { /* DailyChallengeAttempt | null */ },
    "isAvailable": true,
    "isCompleted": false
  },
  "quickPractice": [ /* QuickPractice options */ ],
  "categories": [ /* CategoryWithProgress[] */ ],
  "recommendedTopics": [ /* Topic + Progress + Recommendation */ ]
}
```

---

## 👤 User Endpoints

### POST /auth/register
**Description**: Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "Sarah",
  "lastName": "Johnson"
}
```

**Response**: `{ user: User, token: string }`

---

### POST /auth/login
**Description**: Authenticate user and get JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**: `{ user: UserProfile, token: string }`

---

### GET /users/me
**Description**: Get current user's profile.

**Response**: `UserProfile`

---

### PATCH /users/me
**Description**: Update user profile.

**Request Body** (partial):
```json
{
  "firstName": "Sarah",
  "displayName": "Sarah J",
  "avatar": "https://cdn.example.com/avatars/user123.jpg"
}
```

**Response**: `UserProfile`

---

### GET /users/me/preferences
**Description**: Get user preferences.

**Response**: `UserPreferences`

---

### PATCH /users/me/preferences
**Description**: Update user preferences.

**Request Body** (partial):
```json
{
  "emailNotifications": true,
  "defaultDifficulty": "intermediate",
  "theme": "dark"
}
```

**Response**: `UserPreferences`

---

## 📚 Category Endpoints

### GET /categories
**Description**: Get all categories with optional progress.

**Query Parameters**:
- `includeProgress=true` - Include user progress
- `featured=true` - Only featured categories
- `active=true` - Only active categories

**Response**: `Category[]` or `CategoryWithProgress[]`

---

### GET /categories/:slug
**Description**: Get specific category details.

**Query Parameters**:
- `includeProgress=true`

**Response**: `Category` or `CategoryWithProgress`

---

### GET /categories/:slug/topics
**Description**: Get all topics within a category.

**Query Parameters**:
- `includeProgress=true`
- `difficulty=beginner|intermediate|advanced`
- `featured=true`
- `new=true`

**Response**: `Topic[]` or `TopicWithProgress[]`

---

## 📖 Topic Endpoints

### GET /topics/:slug
**Description**: Get specific topic details.

**Query Parameters**:
- `includeProgress=true`

**Response**: `Topic` or `TopicWithProgress`

---

### GET /topics/:slug/tests
**Description**: Get all tests within a topic.

**Query Parameters**:
- `type=practice|assessment|diagnostic`
- `difficulty=beginner|intermediate|advanced`

**Response**: `Test[]`

---

### POST /topics/:slug/start
**Description**: Mark a topic as started and create initial progress entry.

**Response**: `TopicProgress`

---

## 📝 Test Endpoints

### GET /tests/:testId
**Description**: Get test configuration and questions.

**Response**: `Test` (with embedded `Question[]`)

---

### POST /tests/:testId/start
**Description**: Start a test attempt and get initial state.

**Response**: `TestAttempt`

---

### POST /tests/:testId/attempts/:attemptId/answer
**Description**: Submit answer for a question.

**Request Body**:
```json
{
  "questionId": "q123",
  "selectedOption": "option-b",
  "timeSpent": 45
}
```

**Response**: `{ correct: boolean, explanation?: string }`

---

### POST /tests/:testId/attempts/:attemptId/complete
**Description**: Complete a test attempt and get results.

**Response**: `TestAttempt` (with scoring)

---

### GET /tests/:testId/attempts/:attemptId/resume
**Description**: Resume an incomplete test attempt.

**Response**: `TestAttempt` (with current state)

---

## 📊 Progress Endpoints

### GET /progress
**Description**: Get overall user progress summary.

**Response**: `UserProgress`

---

### GET /progress/categories/:categoryId
**Description**: Get progress for a specific category.

**Response**: `CategoryProgress`

---

### GET /progress/topics/:topicId
**Description**: Get progress for a specific topic.

**Response**: `TopicProgress`

---

### GET /progress/history
**Description**: Get detailed progress history with filters.

**Query Parameters**:
- `dateFrom=2025-01-01`
- `dateTo=2025-12-31`
- `categoryId=cat123`
- `topicId=topic456`
- `limit=50`
- `offset=0`

**Response**: `TestAttempt[]` (paginated)

---

### GET /progress/stats
**Description**: Get detailed statistics for analytics.

**Query Parameters**:
- `period=week|month|year|all`
- `categoryId=cat123` (optional)

**Response**:
```json
{
  "totalTime": 1200,
  "averageScore": 78,
  "completionRate": 65,
  "scoreByCategory": { /* Map<categoryId, score> */ },
  "activityByDay": [ /* Daily activity counts */ ],
  "improvementTrend": [ /* Score trend over time */ ]
}
```

---

## 🏆 Daily Challenge Endpoints

### GET /challenges/daily
**Description**: Get today's daily challenge.

**Response**:
```json
{
  "challenge": { /* DailyChallenge */ },
  "userAttempt": { /* DailyChallengeAttempt | null */ },
  "isAvailable": true,
  "isCompleted": false
}
```

---

### POST /challenges/daily/:challengeId/start
**Description**: Start today's daily challenge.

**Response**: `DailyChallengeAttempt`

---

### POST /challenges/daily/:challengeId/complete
**Description**: Complete daily challenge and get results.

**Request Body**:
```json
{
  "answers": [
    { "questionId": "q1", "selectedOption": "a" },
    { "questionId": "q2", "selectedOption": "c" }
  ],
  "timeSpent": 840
}
```

**Response**: `DailyChallengeAttempt` (with scoring and rewards)

---

### GET /challenges/history
**Description**: Get user's daily challenge history.

**Query Parameters**:
- `limit=30`
- `offset=0`

**Response**: `DailyChallengeAttempt[]` (paginated)

---

## 💡 Recommendation Endpoints

### GET /recommendations
**Description**: Get personalized topic recommendations.

**Query Parameters**:
- `limit=10`
- `strategy=weak-area|incomplete|new-content|mixed`

**Response**:
```json
[
  {
    "topic": { /* Topic */ },
    "progress": { /* TopicProgress | null */ },
    "recommendation": { /* Recommendation */ }
  }
]
```

---

### POST /recommendations/:topicId/dismiss
**Description**: Dismiss a recommendation (won't show again for X days).

**Response**: `{ success: boolean }`

---

## 🔔 Notification Endpoints

### GET /notifications
**Description**: Get user's notifications.

**Query Parameters**:
- `unreadOnly=true`
- `type=achievement|reminder|new-content`
- `limit=20`
- `offset=0`

**Response**: `Notification[]` (paginated)

---

### GET /notifications/unread-count
**Description**: Get count of unread notifications.

**Response**: `{ count: number }`

---

### PATCH /notifications/:id/read
**Description**: Mark notification as read.

**Response**: `Notification`

---

### POST /notifications/mark-all-read
**Description**: Mark all notifications as read.

**Response**: `{ success: boolean, count: number }`

---

### DELETE /notifications/:id
**Description**: Delete a notification.

**Response**: `{ success: boolean }`

---

## 🎯 Quick Practice Endpoints

### POST /practice/quick
**Description**: Generate a quick practice session.

**Request Body**:
```json
{
  "strategy": "random",
  "questionCount": 5,
  "categoryIds": ["cat1", "cat2"],
  "difficulty": "intermediate"
}
```

**Response**:
```json
{
  "sessionId": "session-123",
  "questions": [ /* Question[] */ ],
  "timeLimit": 600
}
```

---

### POST /practice/focus
**Description**: Generate a focused practice session based on weak areas.

**Request Body**:
```json
{
  "questionCount": 10,
  "targetAccuracy": 0.7
}
```

**Response**: (Same as quick practice)

---

## 🔍 Search & Filter Endpoints

### GET /search/topics
**Description**: Search topics by keyword.

**Query Parameters**:
- `q=syllogisms` (search query)
- `categoryId=cat123`
- `difficulty=intermediate`
- `limit=20`

**Response**: `Topic[]`

---

### GET /search/questions
**Description**: Search questions by keyword or tags.

**Query Parameters**:
- `q=probability`
- `tags=mathematics,statistics`
- `categoryId=cat123`
- `difficulty=beginner`
- `limit=50`

**Response**: `Question[]`

---

## 📈 Analytics Endpoints

### GET /analytics/performance
**Description**: Get detailed performance analytics.

**Query Parameters**:
- `period=week|month|quarter|year`
- `categoryId=cat123` (optional)

**Response**:
```json
{
  "overallScore": 75,
  "accuracyTrend": [ /* Time series data */ ],
  "categoryBreakdown": { /* Score by category */ },
  "timeDistribution": { /* Time spent by category */ },
  "strengthsAndWeaknesses": {
    "strengths": ["Logical Reasoning", "Verbal"],
    "weaknesses": ["Numerical", "Data Interpretation"]
  }
}
```

---

### GET /analytics/activity
**Description**: Get activity analytics (sessions, streaks, etc.).

**Response**:
```json
{
  "currentStreak": 7,
  "longestStreak": 21,
  "totalSessions": 143,
  "averageSessionDuration": 18,
  "activityHeatmap": [ /* Daily activity for past 365 days */ ],
  "mostActiveDay": "Tuesday",
  "mostActiveHour": 19
}
```

---

## ⚙️ Admin Endpoints (Future)

### POST /admin/categories
Create new category

### POST /admin/topics
Create new topic

### POST /admin/tests
Create new test

### POST /admin/questions
Create new question

### POST /admin/challenges/generate-daily
Generate daily challenge for specific date

---

## Error Responses

All endpoints follow consistent error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  }
}
```

### Error Codes:
- `VALIDATION_ERROR` - Invalid input (400)
- `UNAUTHORIZED` - Missing or invalid token (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `CONFLICT` - Resource conflict (409)
- `RATE_LIMIT_EXCEEDED` - Too many requests (429)
- `INTERNAL_ERROR` - Server error (500)

---

## Rate Limiting

API requests are rate limited per user:
- **Free tier**: 100 requests/hour
- **Premium tier**: 1000 requests/hour

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1704067200
```

---

## Pagination

List endpoints support pagination:

**Request**:
```
GET /topics?limit=20&offset=40
```

**Response**:
```json
{
  "data": [ /* Items */ ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 40,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Webhooks (Future)

For real-time updates (achievements, challenge reminders):

```
POST /webhooks/register
{
  "url": "https://your-app.com/webhook",
  "events": ["achievement.earned", "challenge.available"]
}
```
