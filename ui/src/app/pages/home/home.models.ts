export type UserProfile = {
  name: string;
  firstName: string;
  email: string;
  avatar?: string;
  initials: string;
};

export type ContinueLearningActivity = {
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
};

export type DailyChallenge = {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit?: number; // minutes
  completed: boolean;
  completedAt?: Date;
  score?: number; // 0-100
  attempts: number;
  maxAttempts: number; // typically 1 for daily challenges
};

export type QuickPractice = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  selectionStrategy: 'random' | 'weak-areas' | 'mixed';
  icon: string;
  color: string;
};

export type Category = {
  slug: string;
  name: string;
  icon?: string;
  iconSvg?: string;
  description: string;
  topics: number;
  color: string;
};

export type RecommendedTopic = {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  status: 'new' | 'in-progress' | 'recommended';
  progress?: number; // 0-100, only for in-progress
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  questionsCount: number;
  reason?: string; // Why this is recommended
};
