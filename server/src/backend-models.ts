/**
 * Backend Data Models for Aptitude Reasoning App
 * 
 * This file defines the core data structures needed to support the Home Screen
 * and overall application functionality. These models serve as:
 * - API contracts between frontend and backend
 * - Database schema references
 * - Type definitions for TypeScript
 */

// ============================================================================
// USER MODEL
// ============================================================================

export interface User {
  id: string;
  email: string;
  passwordHash: string; // Never exposed to frontend
  
  // Profile Information
  firstName: string;
  lastName: string;
  displayName?: string; // Optional custom display name
  avatar?: string; // URL to profile picture
  
  // Account Status
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  
  // Settings & Preferences
  preferences: UserPreferences;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
}

export interface UserPreferences {
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyChallengeReminder: boolean;
  
  // Learning preferences
  defaultDifficulty: 'beginner' | 'intermediate' | 'advanced';
  practiceMode: 'timed' | 'untimed' | 'adaptive';
  
  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  language: string; // ISO language code
}

export interface UserProfile {
  // Derived/computed fields for frontend display
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Full name
  initials: string; // e.g., "SJ" for Sarah Johnson
  avatar?: string;
  
  // Statistics
  totalTopicsStarted: number;
  totalTopicsCompleted: number;
  totalTestsCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number; // 0-100
  currentStreak: number; // Days of consecutive activity
  longestStreak: number;
  
  // Activity
  memberSince: Date;
  lastActive: Date;
}

// ============================================================================
// CATEGORY MODEL
// ============================================================================

export interface Category {
  id: string;
  slug: string; // URL-friendly identifier (e.g., "numerical-reasoning")
  name: string;
  description: string;
  
  // Visual
  icon?: string; // Ionicon name (fallback)
  iconSvg?: string; // Path to SVG icon (preferred)
  color: string; // Hex color code
  
  // Content
  topics: string[]; // Array of topic IDs
  topicCount: number; // Cached count for performance
  
  // Ordering & Display
  displayOrder: number;
  isActive: boolean; // Can be hidden/disabled
  isFeatured: boolean; // Highlighted categories
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithProgress {
  // Extended category with user progress
  category: Category;
  
  // User-specific progress
  completedTopics: number;
  totalTopics: number;
  progressPercentage: number; // 0-100
  averageScore: number; // 0-100
  lastAccessedAt?: Date;
  
  // Performance indicators
  isWeakArea: boolean; // Score < 60% in recent attempts
  isStrength: boolean; // Score > 80% in recent attempts
}

// ============================================================================
// TOPIC/LESSON MODEL
// ============================================================================

export interface Topic {
  id: string;
  slug: string; // URL-friendly identifier
  categoryId: string;
  
  // Basic Information
  title: string;
  description: string;
  learningObjectives: string[]; // What users will learn
  
  // Content Structure
  tests: string[]; // Array of test IDs
  testCount: number; // Cached count
  
  // Difficulty & Time
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // Minutes to complete
  totalQuestions: number; // Across all tests
  
  // Prerequisites & Recommendations
  prerequisites: string[]; // Topic IDs that should be completed first
  recommendedFor: string[]; // User types or skill levels
  
  // Display & Organization
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean; // Recently added content
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface TopicWithProgress {
  // Extended topic with user progress
  topic: Topic;
  
  // User-specific progress
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  completedTests: number;
  totalTests: number;
  
  // Performance
  averageScore: number; // 0-100
  bestScore: number; // 0-100
  attemptsCount: number;
  
  // Activity
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  timeSpent: number; // Total minutes spent
  
  // Recommendations
  isRecommended: boolean;
  recommendationReason?: string;
}

// ============================================================================
// TEST MODEL
// ============================================================================

export interface Test {
  id: string;
  topicId: string;
  categoryId: string; // Denormalized for faster queries
  
  // Basic Information
  title: string;
  description?: string;
  instructions?: string; // Test-taking instructions
  
  // Test Configuration
  type: 'practice' | 'assessment' | 'diagnostic' | 'challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Questions
  questions: string[]; // Array of question IDs (ordered)
  questionCount: number; // Cached count
  
  // Timing
  timeLimit?: number; // Minutes (null for untimed)
  estimatedTime: number; // Estimated minutes
  
  // Scoring
  passingScore: number; // Percentage required to pass (0-100)
  pointsPerQuestion: number; // For gamification
  
  // Behavior
  allowReview: boolean; // Can review answers after completion
  showCorrectAnswers: boolean; // Show correct answers in review
  shuffleQuestions: boolean; // Randomize question order
  shuffleOptions: boolean; // Randomize answer options
  
  // Access Control
  isPublished: boolean;
  requiresPremium: boolean;
  
  // Display
  displayOrder: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface TestAttempt {
  // Represents a single test-taking session
  id: string;
  testId: string;
  userId: string;
  
  // Status
  status: 'in-progress' | 'completed' | 'abandoned';
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // Seconds
  
  // Progress
  currentQuestionIndex: number; // 0-based
  totalQuestions: number;
  
  // Responses
  answers: UserAnswer[]; // Array of user's answers
  
  // Scoring
  score?: number; // Percentage (0-100)
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedAnswers?: number;
  isPassed?: boolean; // Based on passing score
  
  // Context
  resumeToken?: string; // For resuming interrupted tests
  metadata?: Record<string, any>; // Device info, etc.
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string | string[]; // Single or multiple choice
  isCorrect: boolean;
  timeSpent: number; // Seconds spent on this question
  answeredAt: Date;
}

// ============================================================================
// QUESTION MODEL
// ============================================================================

export interface Question {
  id: string;
  testId: string;
  topicId: string; // Denormalized for filtering
  categoryId: string; // Denormalized for filtering
  
  // Question Content
  questionText: string;
  questionType: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-blank';
  
  // Media
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  
  // Options (for multiple choice/select)
  options: QuestionOption[];
  correctOptionIds: string[]; // Can be multiple for multiple-select
  
  // Difficulty & Categorization
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[]; // For categorization and search
  
  // Explanation
  explanation?: string; // Why the answer is correct
  detailedSolution?: string; // Step-by-step solution
  hints?: string[]; // Progressive hints
  
  // Performance Tracking
  difficultyRating?: number; // Calculated from user performance
  averageTimeSpent?: number; // Seconds
  correctAnswerRate?: number; // Percentage (0-100)
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string; // For visual options
  displayOrder: number;
}

// ============================================================================
// USER PROGRESS MODEL
// ============================================================================

export interface UserProgress {
  // Aggregate progress tracking across all content
  id: string;
  userId: string;
  
  // Overall Statistics
  totalTests: number;
  completedTests: number;
  inProgressTests: number;
  
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  
  totalCategories: number;
  completedCategories: number;
  
  // Performance Metrics
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  overallAccuracy: number; // Percentage (0-100)
  averageScore: number; // Average test score (0-100)
  
  // Time Tracking
  totalTimeSpent: number; // Minutes
  averageSessionDuration: number; // Minutes
  
  // Engagement
  totalSessions: number;
  currentStreak: number; // Consecutive days active
  longestStreak: number;
  lastActivityDate: Date;
  
  // Gamification
  totalPoints: number;
  level: number;
  experiencePoints: number;
  
  // Weak & Strong Areas
  weakCategories: string[]; // Category IDs with score < 60%
  strongCategories: string[]; // Category IDs with score > 80%
  
  // Metadata
  updatedAt: Date;
}

export interface CategoryProgress {
  // Progress for a specific category
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
  totalTimeSpent: number; // Minutes
  
  // Activity
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  
  // Analysis
  isWeakArea: boolean;
  isStrength: boolean;
  needsImprovement: boolean;
}

export interface TopicProgress {
  // Progress for a specific topic
  userId: string;
  topicId: string;
  categoryId: string;
  
  // Status
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  
  // Test Progress
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
  timeSpent: number; // Minutes
  
  // Resume State
  currentTestId?: string;
  currentQuestionIndex?: number;
}

// ============================================================================
// DAILY CHALLENGE MODEL
// ============================================================================

export interface DailyChallenge {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  
  // Challenge Details
  title: string;
  description: string;
  
  // Configuration
  questions: string[]; // Question IDs (randomly selected)
  questionCount: number;
  timeLimit: number; // Minutes
  
  // Scoring
  pointsReward: number;
  bonusPoints: number; // For perfect score
  
  // Metadata
  createdAt: Date;
  expiresAt: Date; // End of day
}

export interface DailyChallengeAttempt {
  // User's attempt at daily challenge
  id: string;
  challengeId: string;
  userId: string;
  
  // Status
  status: 'in-progress' | 'completed';
  
  // Results
  score?: number; // Percentage (0-100)
  correctAnswers?: number;
  totalQuestions: number;
  timeSpent?: number; // Seconds
  
  // Rewards
  pointsEarned?: number;
  bonusPointsEarned?: number;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
}

// ============================================================================
// NOTIFICATION MODEL
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  
  // Content
  type: 'achievement' | 'reminder' | 'new-content' | 'challenge' | 'system' | 'social';
  title: string;
  message: string;
  
  // Action
  actionUrl?: string; // Deep link or navigation path
  actionLabel?: string; // e.g., "Start Now", "View"
  
  // Visual
  icon?: string; // Ionicon name
  imageUrl?: string;
  priority: 'low' | 'normal' | 'high';
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Metadata
  metadata?: Record<string, any>; // Additional context
  createdAt: Date;
  expiresAt?: Date; // For time-sensitive notifications
}

// ============================================================================
// RECOMMENDATION MODEL
// ============================================================================

export interface Recommendation {
  // Personalized content recommendations
  userId: string;
  topicId: string;
  
  // Recommendation Details
  reason: 'weak-area' | 'incomplete' | 'new-content' | 'popular' | 'prerequisite' | 'adaptive';
  reasonText: string; // Human-readable explanation
  
  // Scoring
  relevanceScore: number; // 0-100, how relevant to user
  confidenceScore: number; // 0-100, confidence in recommendation
  
  // Context
  basedOn: string[]; // IDs of items that influenced recommendation
  
  // Metadata
  generatedAt: Date;
  expiresAt?: Date; // Recommendations can expire
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface HomeScreenData {
  // Complete data structure for Home Screen
  user: UserProfile;
  unreadNotifications: number;
  
  // Continue Learning
  continueActivity?: {
    type: 'topic' | 'test' | 'challenge';
    id: string;
    title: string;
    subtitle?: string;
    progress: number;
    resumeUrl: string;
  };
  
  // Daily Challenge
  dailyChallenge: {
    challenge: DailyChallenge;
    userAttempt?: DailyChallengeAttempt;
    isAvailable: boolean;
    isCompleted: boolean;
  };
  
  // Quick Practice Options
  quickPractice: Array<{
    id: string;
    title: string;
    description: string;
    questionCount: number;
    icon: string;
    color: string;
  }>;
  
  // Categories
  categories: CategoryWithProgress[];
  
  // Recommendations
  recommendedTopics: Array<{
    topic: Topic;
    progress?: TopicProgress;
    recommendation: Recommendation;
  }>;
}

// ============================================================================
// QUERY/FILTER TYPES
// ============================================================================

export interface TopicFilters {
  categoryId?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'not-started' | 'in-progress' | 'completed';
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export interface TestFilters {
  topicId?: string;
  categoryId?: string;
  type?: 'practice' | 'assessment' | 'diagnostic' | 'challenge';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  minQuestions?: number;
  maxQuestions?: number;
  hasTimeLimit?: boolean;
}

export interface ProgressFilters {
  dateFrom?: Date;
  dateTo?: Date;
  categoryId?: string;
  topicId?: string;
  minScore?: number;
  maxScore?: number;
}
