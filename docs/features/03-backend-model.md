# Backend Data Model

## Overview
Complete backend data models and API structure for the Aptitude Reasoning App, designed to support all frontend features including progress tracking, personalization, and content delivery.

---

## 📋 Core Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  
  // Profile
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  
  // Preferences
  preferences: UserPreferences;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

**Key Features**:
- Secure authentication with hashed passwords
- Customizable profile information
- User status management
- Preference storage
- Activity tracking

---

### Category Model
```typescript
interface Category {
  id: string;
  slug: string; // e.g., "numerical-reasoning"
  name: string;
  description: string;
  
  // Visual
  icon?: string;
  iconSvg?: string;
  color: string; // Hex code
  
  // Content
  topics: string[]; // Topic IDs
  topicCount: number;
  
  // Display
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Categories**:
- Abstract Reasoning
- Verbal Reasoning
- Numerical Reasoning
- Logical Reasoning
- Spatial Reasoning
- Diagrammatic Reasoning
- Data Interpretation
- Critical Thinking

---

### Topic Model
```typescript
interface Topic {
  id: string;
  slug: string;
  categoryId: string;
  
  // Content
  title: string;
  description: string;
  learningObjectives: string[];
  
  // Structure
  tests: string[]; // Test IDs
  testCount: number;
  
  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  totalQuestions: number;
  
  // Organization
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Test Model
```typescript
interface Test {
  id: string;
  topicId: string;
  categoryId: string;
  
  // Configuration
  title: string;
  description?: string;
  type: 'practice' | 'assessment' | 'diagnostic' | 'challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Questions
  questions: string[]; // Ordered question IDs
  questionCount: number;
  
  // Timing
  timeLimit?: number; // minutes (null = untimed)
  estimatedTime: number;
  
  // Scoring
  passingScore: number; // 0-100
  pointsPerQuestion: number;
  
  // Behavior
  allowReview: boolean;
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  
  // Access
  isPublished: boolean;
  requiresPremium: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Question Model
```typescript
interface Question {
  id: string;
  testId: string;
  topicId: string;
  categoryId: string;
  
  // Content
  questionText: string;
  questionType: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-blank';
  
  // Media
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  
  // Options
  options: QuestionOption[];
  correctOptionIds: string[];
  
  // Difficulty
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  
  // Help
  explanation?: string;
  detailedSolution?: string;
  hints?: string[];
  
  // Analytics
  difficultyRating?: number;
  averageTimeSpent?: number;
  correctAnswerRate?: number;
  
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

---

## 📊 Progress Models

### UserProgress (Aggregate)
```typescript
interface UserProgress {
  id: string;
  userId: string;
  
  // Overall Stats
  totalTests: number;
  completedTests: number;
  inProgressTests: number;
  
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  
  // Performance
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number; // 0-100
  averageScore: number; // 0-100
  
  // Time
  totalTimeSpent: number; // minutes
  averageSessionDuration: number;
  
  // Engagement
  totalSessions: number;
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastActivityDate: Date;
  
  // Gamification
  totalPoints: number;
  level: number;
  experiencePoints: number;
  
  // Analysis
  weakCategories: string[]; // Score < 60%
  strongCategories: string[]; // Score > 80%
  
  updatedAt: Date;
}
```

---

### CategoryProgress
```typescript
interface CategoryProgress {
  userId: string;
  categoryId: string;
  
  // Progress
  completedTopics: number;
  totalTopics: number;
  progressPercentage: number; // 0-100
  
  // Performance
  averageScore: number; // 0-100
  bestScore: number;
  totalAttempts: number;
  totalTimeSpent: number; // minutes
  
  // Activity
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  
  // Analysis
  isWeakArea: boolean; // Score < 60%
  isStrength: boolean; // Score > 80%
}
```

---

### TopicProgress
```typescript
interface TopicProgress {
  userId: string;
  topicId: string;
  categoryId: string;
  
  // Status
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  
  // Tests
  completedTests: number;
  totalTests: number;
  
  // Performance
  averageScore: number; // 0-100
  bestScore: number;
  attempts: number;
  
  // Activity
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  
  // Resume State
  currentTestId?: string;
  currentQuestionIndex?: number;
}
```

---

### TestAttempt
```typescript
interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  
  // Status
  status: 'in-progress' | 'completed' | 'abandoned';
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // seconds
  
  // Progress
  currentQuestionIndex: number;
  totalQuestions: number;
  
  // Answers
  answers: UserAnswer[];
  
  // Results
  score?: number; // 0-100
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedAnswers?: number;
  isPassed?: boolean;
  
  // Resume
  resumeToken?: string;
  metadata?: Record<string, any>;
}
```

---

## 🏆 Special Features

### DailyChallenge
```typescript
interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  
  // Configuration
  title: string;
  description: string;
  questions: string[]; // Question IDs
  questionCount: number;
  timeLimit: number; // minutes
  
  // Rewards
  pointsReward: number;
  bonusPoints: number; // for perfect score
  
  // Lifecycle
  createdAt: Date;
  expiresAt: Date;
}

interface DailyChallengeAttempt {
  id: string;
  challengeId: string;
  userId: string;
  
  status: 'in-progress' | 'completed';
  
  // Results
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  timeSpent?: number;
  
  // Rewards
  pointsEarned?: number;
  bonusPointsEarned?: number;
  
  startedAt: Date;
  completedAt?: Date;
}
```

---

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  
  // Content
  type: 'achievement' | 'reminder' | 'new-content' | 'challenge' | 'system';
  title: string;
  message: string;
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Visual
  icon?: string;
  imageUrl?: string;
  priority: 'low' | 'normal' | 'high';
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  createdAt: Date;
  expiresAt?: Date;
}
```

---

### Recommendation
```typescript
interface Recommendation {
  userId: string;
  topicId: string;
  
  // Reason
  reason: 'weak-area' | 'incomplete' | 'new-content' | 'popular' | 'adaptive';
  reasonText: string;
  
  // Scoring
  relevanceScore: number; // 0-100
  confidenceScore: number; // 0-100
  
  // Context
  basedOn: string[]; // IDs that influenced recommendation
  
  generatedAt: Date;
  expiresAt?: Date;
}
```

---

## 🔌 API Endpoints

### Home Screen
```
GET /home
```
Returns complete home screen data in single request:
- User profile
- Continue learning activity
- Daily challenge
- Quick practice options
- Categories with progress
- Recommended topics

---

### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
```

---

### User Management
```
GET    /users/me
PATCH  /users/me
GET    /users/me/preferences
PATCH  /users/me/preferences
```

---

### Categories & Topics
```
GET  /categories
GET  /categories/:slug
GET  /categories/:slug/topics
GET  /topics/:slug
GET  /topics/:slug/tests
POST /topics/:slug/start
```

---

### Tests & Questions
```
GET  /tests/:testId
POST /tests/:testId/start
POST /tests/:testId/attempts/:attemptId/answer
POST /tests/:testId/attempts/:attemptId/complete
GET  /tests/:testId/attempts/:attemptId/resume
```

---

### Progress Tracking
```
GET /progress
GET /progress/categories/:categoryId
GET /progress/topics/:topicId
GET /progress/history
GET /progress/stats
```

---

### Daily Challenges
```
GET  /challenges/daily
POST /challenges/daily/:challengeId/start
POST /challenges/daily/:challengeId/complete
GET  /challenges/history
```

---

### Recommendations
```
GET  /recommendations
POST /recommendations/:topicId/dismiss
```

---

### Notifications
```
GET    /notifications
GET    /notifications/unread-count
PATCH  /notifications/:id/read
POST   /notifications/mark-all-read
DELETE /notifications/:id
```

---

### Quick Practice
```
POST /practice/quick
POST /practice/focus
```

---

## 💾 Database Schema Considerations

### Indexes
```sql
-- Performance optimization
CREATE INDEX idx_topics_category ON topics(category_id);
CREATE INDEX idx_questions_test ON questions(test_id);
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id, status);
CREATE INDEX idx_progress_user_topic ON topic_progress(user_id, topic_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

### Denormalization
For performance, some fields are denormalized:
- `categoryId` in Topic and Question models
- `topicCount` in Category model
- `questionCount` in Test model

---

## 🎯 Recommendation Algorithm

### Strategies

**Weak Area Detection**:
```typescript
if (categoryScore < 60 && attempts >= 3) {
  recommend({
    reason: 'weak-area',
    reasonText: 'Strengthen your weak area'
  });
}
```

**Incomplete Topics**:
```typescript
if (progress > 10 && progress < 90) {
  recommend({
    reason: 'incomplete',
    reasonText: '45% Done'
  });
}
```

**New Content**:
```typescript
if (isNew && createdAt > Date.now() - 7 * DAY) {
  recommend({
    reason: 'new-content',
    reasonText: 'New content available'
  });
}
```

---

## 📈 Analytics & Insights

### Performance Metrics
- Overall accuracy percentage
- Score by category
- Improvement trends over time
- Time spent by category

### Engagement Metrics
- Daily active users
- Session duration
- Completion rates
- Streak maintenance

### Content Metrics
- Question difficulty ratings
- Average time per question
- Correct answer rates
- Popular topics

---

## 🔐 Security Considerations

### Authentication
- JWT tokens with expiration
- Refresh token rotation
- Password hashing (bcrypt/Argon2)
- Email verification

### Authorization
- Role-based access control
- Resource ownership validation
- Premium content gating
- Rate limiting

### Data Protection
- Never expose `passwordHash`
- Sanitize user input
- Validate all data
- Encrypt sensitive data at rest

---

## 🚀 Scalability Patterns

### Caching Strategy
```
Categories: 1 hour cache
User Progress: 5 minutes cache
Daily Challenge: Cache until midnight
Recommendations: 15 minutes cache
```

### Database Optimization
- Read replicas for queries
- Write to primary database
- Connection pooling
- Query optimization

### API Performance
- Pagination for large lists
- Batch requests where possible
- Efficient JOIN queries
- Lazy loading of relations

---

## 📝 Data Migration

### Initial Seed Data
- 8 Categories with metadata
- 100+ Topics across categories
- 1000+ Questions
- Test configurations
- Default user preferences

### Version Control
- Database migrations
- Schema versioning
- Rollback procedures
- Data backup strategies

---

## 🔄 Real-time Features

### WebSocket Events
```typescript
// Server → Client
'achievement.earned'
'challenge.available'
'notification.new'
'progress.updated'

// Client → Server
'test.answer'
'progress.sync'
```

---

## 🧪 Testing Data

### Mock Users
```typescript
{
  email: 'sarah.johnson@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  // ... complete profile
}
```

### Sample Progress
- 68% on Numerical Reasoning topic
- 3 unread notifications
- Daily challenge available
- 4 recommended topics

---

## 📚 API Response Examples

### Home Screen Response
```json
{
  "user": {
    "id": "user-123",
    "name": "Sarah Johnson",
    "initials": "SJ",
    "averageScore": 75
  },
  "unreadNotifications": 3,
  "continueActivity": {
    "type": "topic",
    "title": "Numerical Reasoning",
    "subtitle": "Ratios & Proportions",
    "progress": 68
  },
  "dailyChallenge": {
    "isAvailable": true,
    "isCompleted": false,
    "challenge": { /* ... */ }
  },
  "categories": [ /* ... */ ],
  "recommendedTopics": [ /* ... */ ]
}
```

---

## 🎯 Future Enhancements

### Planned Features
- Social features (leaderboards, friends)
- Adaptive learning algorithm
- Spaced repetition system
- Performance analytics dashboard
- Achievement system
- Study plans
- Collaborative challenges

### Advanced Analytics
- ML-based difficulty adjustment
- Personalized learning paths
- Predictive performance modeling
- Content recommendation engine
