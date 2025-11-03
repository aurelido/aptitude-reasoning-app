# Home Screen - Complete Feature Documentation

## Overview
The Home Screen serves as the user's primary entry point, providing a personalized dashboard with quick access to learning activities, progress tracking, and content recommendations.

---

## 🏠 Home Screen Structure

### Layout Hierarchy
1. **Top Bar** - Profile, notifications, settings
2. **Continue Learning Card** - Resume last activity
3. **Daily Challenge Card** - Time-limited daily test
4. **Quick Practice Section** - Fast practice modes
5. **Explore Categories Section** - Horizontal scrolling categories
6. **Recommended Topics Section** - Personalized vertical list

---

# 1. Home Top Bar

## Purpose
Provides essential user identification, access to global settings, and immediate notifications. Remains consistent for quick access to key functions.

---

## 📱 Components

### Profile Section
**Elements**:
- Profile Picture/Avatar (48x48px circular)
- Time-based Greeting ("Good morning", "Good afternoon", "Good evening")
- User's First Name

**Implementation**:
```typescript
get greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
```

**Avatar Display**:
```html
@if (user().avatar) {
  <img [src]="user().avatar" class="profile-avatar" />
} @else {
  <div class="profile-avatar-fallback">
    <span>{{ user().initials }}</span>
  </div>
}
```

**Styling**:
```scss
.profile-avatar-fallback {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, primary, primary-shade);
  color: white;
  font-weight: 600;
}
```

---

### Notifications Icon
**Features**:
- Bell icon (`notifications-outline`)
- Red circular badge with unread count
- Only shows badge when count > 0
- Positioned at top-right of icon

**Badge Styling**:
```scss
.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
```

**Interaction**:
- Tap navigates to Notifications Screen
- Badge updates in real-time
- Can mark all as read

---

### Settings Icon
**Features**:
- Gear icon (`settings-outline`)
- 24px size
- Gray color (#6b7280)
- Tap navigates to Settings/Profile

---

## 🎨 Visual Design

### Layout
```scss
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}
```

### Responsive Behavior
**Mobile**:
- Compact padding (0.5rem 1rem)
- Name max-width: 200px

**Tablet**:
- More padding (0.75rem 1.5rem)
- Name max-width: 300px

---

# 2. Continue Learning / Dynamic Activity Tracker

## Purpose
Drives user retention by reminding users of incomplete tasks or recent activity, encouraging them to pick up where they left off.

---

## 🎯 Features

### Card Design
**Visual**:
- Gradient background (Primary → Primary-shade)
- Prominent positioning (first card)
- White text for contrast
- 16px border radius

**Structure**:
```
┌─────────────────────────────┐
│ 🎬 CONTINUE LEARNING        │
│                             │
│ Numerical Reasoning -       │
│ Ratios & Proportions        │
│                             │
│ ████████████░░░░░░ 68%      │
│ 17/25 questions • 68% Done  │
│                             │
│ ┌─────────────────────────┐ │
│ │   Continue        →     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### State Management
```typescript
interface ContinueLearningActivity {
  id: string;
  type: 'topic' | 'challenge' | 'test';
  categorySlug: string;
  topicSlug?: string;
  title: string;
  subtitle?: string;
  progress: number; // 0-100
  totalQuestions?: number;
  completedQuestions?: number;
  currentQuestionIndex?: number;
  timeElapsed?: number; // seconds
  lastAccessedAt: Date;
  resumeUrl: string;
}
```

---

### Progress Display
**Progress Bar**:
```scss
.progress-bar-bg {
  height: 10px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), white);
    border-radius: 5px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  }
}
```

**Progress Text**:
- "17/25 questions • 68% Complete"
- Dynamic based on progress type
- 0.813rem font size
- Semi-transparent white

---

### Empty State
**When no recent activity**:
- Icon: `school` (outline)
- Title: "Start Your First Lesson"
- Message: "Begin your learning journey..."
- Button: "Explore Topics" with compass icon
- Routes to `/tabs/categories`

---

### Resume Functionality
```typescript
continueLearning() {
  const activity = this.continueActivity();
  
  this.router.navigate([activity.resumeUrl], {
    state: {
      resumeFrom: activity.currentQuestionIndex,
      timeElapsed: activity.timeElapsed,
      activityId: activity.id
    }
  });
}
```

---

### Responsive Design
**Mobile** (< 768px):
```scss
padding: 1.25rem;
.activity-title { font-size: 1.25rem; }
```

**Tablet** (≥ 768px):
```scss
padding: 1.5rem;
.activity-title { font-size: 1.5rem; }
```

---

# 3. Daily Challenge

## Purpose
Offers time-limited daily engagement, encouraging users to return daily and maintain learning streaks.

---

## 🏆 Features

### Card Design
**Active State (Amber)**:
```scss
background: linear-gradient(135deg, #f59e0b, #d97706);
box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
```

**Completed State (Green)**:
```scss
background: linear-gradient(135deg, #10b981, #059669);
box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
```

---

### Structure
```
┌─────────────────────────────┐
│ 🏆 Daily Challenge #342   ✓ │
│   10 randomized questions   │
│                             │
│ ⏱ 10 questions • 15 min  → │
└─────────────────────────────┘
```

---

### Data Model
```typescript
interface DailyChallenge {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit?: number; // minutes
  completed: boolean;
  completedAt?: Date;
  score?: number; // 0-100
  attempts: number;
  maxAttempts: number; // typically 1
}
```

---

### Daily Refresh Logic
```typescript
// Check if new day
const today = new Date().toISOString().split('T')[0];
if (challenge.date !== today) {
  // Fetch new daily challenge
  await this.challengeService.refreshDailyChallenge();
}
```

---

### Status Display
```typescript
get dailyChallengeStatus(): string {
  const challenge = this.dailyChallenge();
  
  if (challenge.completed) {
    return `Completed! Score: ${challenge.score}%`;
  }
  if (challenge.attempts >= challenge.maxAttempts) {
    return 'Completed for today';
  }
  return `${challenge.totalQuestions} questions • ${challenge.timeLimit} min`;
}
```

---

### Visual States
**Available**:
- Amber gradient background
- Trophy icon
- "Start" chevron visible
- Tappable entire card

**Completed**:
- Green gradient background
- Checkmark circle icon
- Score displayed
- No chevron (not tappable)

---

# 4. Quick Practice

## Purpose
Provides low-commitment, immediate testing options for users wanting quick skill practice without navigating through categories.

---

## ⚡ Practice Modes

### Quick Practice
- **Questions**: 5 random questions
- **Strategy**: Random selection across all categories
- **Icon**: `flash` (lightning bolt)
- **Color**: Amber (#f59e0b)
- **Time**: ~5 minutes

### Focus Mode
- **Questions**: 10 targeted questions
- **Strategy**: Based on weak areas
- **Icon**: `target` (bullseye)
- **Color**: Red (#ef4444)
- **Time**: ~10 minutes

---

## 🎨 Card Design

### Layout
```scss
.practice-grid {
  display: grid;
  grid-template-columns: 1fr; // Mobile
  gap: 0.875rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr); // Tablet
  }
}
```

### Card Structure
```
┌──────────────────────┐
│ ⚡ Quick Practice    │
│ 5 questions •        │
│ Random selection     │
│                   ▶  │
└──────────────────────┘
```

---

### Card Styling
```scss
.practice-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid; // Colored indicator
  
  .practice-start-icon {
    font-size: 28px;
    color: var(--ion-color-primary);
    align-self: flex-end;
    margin-top: auto;
  }
}
```

---

### Data Model
```typescript
interface QuickPractice {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  selectionStrategy: 'random' | 'weak-areas' | 'mixed';
  icon: string;
  color: string;
}
```

---

### Navigation
```typescript
startQuickPractice(practice: QuickPractice) {
  this.router.navigate(['/test'], {
    state: {
      type: 'quick-practice',
      practiceId: practice.id,
      questionCount: practice.questionCount,
      selectionStrategy: practice.selectionStrategy
    }
  });
}
```

---

# 5. Explore Categories

## Purpose
Allows users to browse all aptitude domains in a visually engaging horizontal scroll, facilitating structured learning by category.

---

## 📚 Categories

### Eight Categories
1. **Abstract Reasoning** (Purple #9333ea)
2. **Verbal Reasoning** (Blue #3b82f6)
3. **Numerical Reasoning** (Green #10b981)
4. **Logical Reasoning** (Amber #f59e0b)
5. **Spatial Reasoning** (Cyan #06b6d4)
6. **Diagrammatic Reasoning** (Pink #ec4899)
7. **Data Interpretation** (Indigo #6366f1)
8. **Critical Thinking** (Red #ef4444)

---

## 🎨 Visual Design

### Section Header
```html
<div class="section-header">
  <h3 class="section-title">Explore Categories</h3>
  <ion-button fill="clear" size="small" (click)="viewAllCategories()">
    View All
    <ion-icon name="chevron-forward" slot="end"></ion-icon>
  </ion-button>
</div>
```

---

### Horizontal Scroll
```scss
.categories-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  // Hide scrollbar
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
```

---

### Category Cards
**Mobile** (< 768px):
```scss
.category-card {
  flex: 0 0 140px; // Fixed width
  padding: 1rem 0.75rem;
  
  .category-icon-container {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: [category color];
    
    img { // SVG icon
      width: 40px;
      height: 40px;
      filter: brightness(0) invert(1); // White
    }
  }
  
  .category-name {
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
  }
  
  .category-topics {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
  }
}
```

**Tablet** (≥ 768px):
```scss
.category-card {
  flex: 0 0 160px;
  padding: 1.25rem 1rem;
  
  .category-icon-container {
    width: 72px;
    height: 72px;
    
    img {
      width: 44px;
      height: 44px;
    }
  }
}
```

---

### Custom SVG Icons
Located in `/ui/src/assets/categories/`:
- abstract-reasoning.svg
- verbal-reasoning.svg
- numerical-reasoning.svg
- logical-reasoning.svg
- spatial-reasoning.svg
- diagrammatic-reasoning.svg
- data-interpretation.svg
- critical-thinking.svg

---

### Category Data Model
```typescript
interface Category {
  slug: string;
  name: string;
  iconSvg?: string;
  description: string;
  topics: number;
  color: string;
}
```

---

### Performance Optimization
- Fixed card widths prevent layout shifts
- Hardware-accelerated scrolling
- Hidden scrollbar reduces visual clutter
- Minimal repaints with transform-based interactions

---

# 6. Recommended Topics

## Purpose
Provides personalized content suggestions based on user performance, activity, and preferences. Encourages discovery and addresses weak areas.

---

## 💡 Recommendation Types

### Status Types
1. **New** - Recently added content (< 7 days)
2. **In Progress** - Started but not completed (10-90% progress)
3. **Recommended** - Based on weak areas or patterns

---

## 🎯 Card Design

### Structure
```
┌──────────────────────────────┐
│█ Syllogisms                →│
│  Logical Reasoning           │
│  💡 Recent performance       │
│  ⏱ 15 min  ❓ 20  [Inter.] │
└──────────────────────────────┘
```

---

### Components

**Left Indicator**:
```scss
.topic-indicator {
  width: 4px;
  background-color: [category color];
  transition: width 0.2s ease;
  
  &:active {
    width: 6px; // Widens on tap
  }
}
```

**Status Badge**:
```html
<div class="topic-status">
  <ion-icon [name]="getStatusIcon(topic.status)"></ion-icon>
  <span>{{ getStatusLabel(topic) }}</span>
</div>
```

**Status Icons**:
- New: `sparkles`
- In Progress: `time`
- Recommended: `bulb`

---

### Progress Bar (In Progress Only)
```scss
.topic-progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, primary, primary-shade);
    transition: width 0.4s ease;
  }
}
```

---

### Metadata Display
```html
<div class="topic-meta">
  <span class="meta-item">
    <ion-icon name="time-outline"></ion-icon>
    {{ topic.estimatedTime }} min
  </span>
  <span class="meta-item">
    <ion-icon name="help-circle-outline"></ion-icon>
    {{ topic.questionsCount }} questions
  </span>
  <span class="meta-item difficulty">
    {{ getDifficultyLabel(topic.difficulty) }}
  </span>
</div>
```

**Difficulty Badge**:
```scss
.difficulty {
  padding: 0.125rem 0.5rem;
  background: #fef3c7; // Amber light
  color: #92400e; // Amber dark
  border-radius: 4px;
  font-weight: 500;
}
```

---

### Data Model
```typescript
interface RecommendedTopic {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  status: 'new' | 'in-progress' | 'recommended';
  progress?: number; // 0-100
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  questionsCount: number;
  reason?: string; // Why recommended
}
```

---

### Recommendation Algorithm

**Weak Area Detection**:
```typescript
if (categoryScore < 60 && attempts >= 3) {
  recommendedTopics.push({
    status: 'recommended',
    reason: 'Strengthen your weak area'
  });
}
```

**Incomplete Topics**:
```typescript
if (progress > 10 && progress < 90) {
  recommendedTopics.push({
    status: 'in-progress',
    progress: userProgress
  });
}
```

**New Content**:
```typescript
if (isNew && createdAt > Date.now() - 7 * DAY) {
  recommendedTopics.push({
    status: 'new',
    reason: 'New content available'
  });
}
```

---

### Navigation
```typescript
navigateToTopic(topic: RecommendedTopic) {
  this.router.navigate([
    '/tabs/categories',
    topic.categorySlug,
    'topics',
    topic.slug
  ]);
}
```

---

### Responsive Layout
**Mobile**:
```scss
.topic-card {
  .topic-content {
    padding: 1rem;
  }
  .topic-title {
    font-size: 1rem;
  }
}
```

**Tablet**:
```scss
.topic-card {
  .topic-content {
    padding: 1.25rem;
  }
  .topic-title {
    font-size: 1.063rem;
  }
}
```

---

## 📊 Home Screen Data Loading

### Single API Call
```typescript
GET /home

Response: {
  user: UserProfile,
  unreadNotifications: number,
  continueActivity: ContinueLearningActivity | null,
  dailyChallenge: DailyChallengeData,
  quickPractice: QuickPractice[],
  categories: CategoryWithProgress[],
  recommendedTopics: RecommendedTopic[]
}
```

---

## 🎯 Performance Optimizations

### Lazy Loading
- Images loaded on demand
- Horizontal scroll uses IntersectionObserver
- Recommended topics paginated if > 10

### Caching Strategy
- User profile: 5 minutes
- Categories: 1 hour
- Daily challenge: Until midnight
- Recommendations: 15 minutes

### Bundle Optimization
- Code splitting for each section
- Tree shaking unused components
- Minified production builds

---

## ♿ Accessibility

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for all interactive elements
- Announce progress updates
- Skip links for navigation

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate
- Escape to close modals
- Arrow keys for horizontal scroll

### Visual Accessibility
- WCAG AA contrast ratios
- Focus indicators visible
- Text scalable
- No color-only information

---

## 🧪 Testing

### Unit Tests
- Component rendering
- State management
- User interactions
- Navigation flows

### Integration Tests
- API data loading
- Progress tracking
- Recommendation engine
- Navigation between sections

### E2E Tests
- Complete user flows
- Cross-browser testing
- Mobile device testing
- Performance benchmarks

---

## 🔮 Future Enhancements

### Planned Features
- Pull-to-refresh
- Personalized greetings based on time/activity
- Achievement notifications
- Streak tracker widget
- Learning insights dashboard
- Social features (friends' activity)
- Customizable home layout
- Widgets for quick stats

### Advanced Personalization
- ML-based recommendations
- Adaptive difficulty
- Learning path suggestions
- Time-of-day optimizations
- Content variety balancing
