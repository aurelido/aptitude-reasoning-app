import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

type UserProfile = {
  name: string;
  firstName: string;
  email: string;
  avatar?: string;
  initials: string;
};

type ContinueLearningActivity = {
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

type DailyChallenge = {
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

type QuickPractice = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  selectionStrategy: 'random' | 'weak-areas' | 'mixed';
  icon: string;
  color: string;
};

type Category = {
  slug: string;
  name: string;
  icon?: string;
  iconSvg?: string;
  description: string;
  topics: number;
  color: string;
};

type RecommendedTopic = {
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  // Mock user data - in real app, this would come from a service/store
  user = signal<UserProfile>({
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    email: 'sarah.johnson@example.com',
    avatar: '', // Empty string means no avatar, will show initials
    initials: 'SJ',
  });

  // Mock notification count - in real app, this would come from a service
  // Real-time updates via WebSocket, Server-Sent Events, or polling
  unreadNotifications = signal<number>(3);

  // Mock continue learning data - in real app, fetched from user progress service
  continueActivity = signal<ContinueLearningActivity | null>({
    id: 'activity-123',
    type: 'topic',
    categorySlug: 'numerical-reasoning',
    topicSlug: 'ratios-proportions',
    title: 'Numerical Reasoning',
    subtitle: 'Ratios & Proportions',
    progress: 68,
    totalQuestions: 25,
    completedQuestions: 17,
    currentQuestionIndex: 17,
    timeElapsed: 420, // 7 minutes
    lastAccessedAt: new Date(),
    resumeUrl: '/tabs/categories/numerical-reasoning/topics/ratios-proportions/practice',
  });

  // Helper to format activity title
  get activityTitle(): string {
    const activity = this.continueActivity();
    if (!activity) return 'Start Your First Lesson';
    
    if (activity.subtitle) {
      return `${activity.title} - ${activity.subtitle}`;
    }
    return activity.title;
  }

  // Helper to format progress text
  get progressText(): string {
    const activity = this.continueActivity();
    if (!activity) return '';
    
    if (activity.completedQuestions && activity.totalQuestions) {
      return `${activity.completedQuestions}/${activity.totalQuestions} questions • ${activity.progress}% Complete`;
    }
    return `${activity.progress}% Complete`;
  }

  // Daily Challenge - refreshes daily
  dailyChallenge = signal<DailyChallenge>({
    id: 'daily-2025-11-02',
    date: new Date().toISOString().split('T')[0], // Today's date
    title: 'Daily Challenge #342',
    description: '10 randomized questions across all categories',
    totalQuestions: 10,
    timeLimit: 15,
    completed: false,
    attempts: 0,
    maxAttempts: 1,
  });

  // Quick Practice Options
  quickPracticeOptions = signal<QuickPractice[]>([
    {
      id: 'quick-random',
      title: 'Quick Practice',
      description: '5 questions • Random selection',
      questionCount: 5,
      selectionStrategy: 'random',
      icon: 'flash',
      color: '#f59e0b', // Amber
    },
    {
      id: 'focus-weak',
      title: 'Focus Mode',
      description: '10 questions • Your weak areas',
      questionCount: 10,
      selectionStrategy: 'weak-areas',
      icon: 'target',
      color: '#ef4444', // Red
    },
  ]);

  // Categories for exploration
  categories = signal<Category[]>([
    {
      slug: 'abstract-reasoning',
      name: 'Abstract Reasoning',
      iconSvg: 'assets/categories/abstract-reasoning.svg',
      description: 'Pattern recognition and logical sequences',
      topics: 24,
      color: '#9333ea', // Purple
    },
    {
      slug: 'verbal-reasoning',
      name: 'Verbal Reasoning',
      iconSvg: 'assets/categories/verbal-reasoning.svg',
      description: 'Reading comprehension and language skills',
      topics: 32,
      color: '#3b82f6', // Blue
    },
    {
      slug: 'numerical-reasoning',
      name: 'Numerical Reasoning',
      iconSvg: 'assets/categories/numerical-reasoning.svg',
      description: 'Mathematical problems and data analysis',
      topics: 28,
      color: '#10b981', // Green
    },
    {
      slug: 'logical-reasoning',
      name: 'Logical Reasoning',
      iconSvg: 'assets/categories/logical-reasoning.svg',
      description: 'Critical thinking and deductive reasoning',
      topics: 30,
      color: '#f59e0b', // Amber
    },
    {
      slug: 'spatial-reasoning',
      name: 'Spatial Reasoning',
      iconSvg: 'assets/categories/spatial-reasoning.svg',
      description: 'Visual and spatial problem solving',
      topics: 20,
      color: '#06b6d4', // Cyan
    },
    {
      slug: 'diagrammatic-reasoning',
      name: 'Diagrammatic Reasoning',
      iconSvg: 'assets/categories/diagrammatic-reasoning.svg',
      description: 'Process diagrams and flowcharts',
      topics: 18,
      color: '#ec4899', // Pink
    },
    {
      slug: 'data-interpretation',
      name: 'Data Interpretation',
      iconSvg: 'assets/categories/data-interpretation.svg',
      description: 'Charts, graphs, and statistical data',
      topics: 26,
      color: '#6366f1', // Indigo
    },
    {
      slug: 'critical-thinking',
      name: 'Critical Thinking',
      iconSvg: 'assets/categories/critical-thinking.svg',
      description: 'Analytical and evaluative thinking',
      topics: 22,
      color: '#ef4444', // Red
    },
  ]);

  // Recommended Topics - personalized based on performance and activity
  recommendedTopics = signal<RecommendedTopic[]>([
    {
      id: 'topic-1',
      slug: 'syllogisms',
      title: 'Syllogisms',
      categoryName: 'Logical Reasoning',
      categorySlug: 'logical-reasoning',
      categoryColor: '#f59e0b',
      status: 'recommended',
      difficulty: 'intermediate',
      estimatedTime: 15,
      questionsCount: 20,
      reason: 'Based on your recent performance',
    },
    {
      id: 'topic-2',
      slug: 'percentages',
      title: 'Percentages & Profit Loss',
      categoryName: 'Numerical Reasoning',
      categorySlug: 'numerical-reasoning',
      categoryColor: '#10b981',
      status: 'in-progress',
      progress: 45,
      difficulty: 'beginner',
      estimatedTime: 12,
      questionsCount: 18,
    },
    {
      id: 'topic-3',
      slug: 'analogies',
      title: 'Word Analogies',
      categoryName: 'Verbal Reasoning',
      categorySlug: 'verbal-reasoning',
      categoryColor: '#3b82f6',
      status: 'new',
      difficulty: 'beginner',
      estimatedTime: 10,
      questionsCount: 15,
      reason: 'New content available',
    },
    {
      id: 'topic-4',
      slug: 'table-interpretation',
      title: 'Table & Chart Interpretation',
      categoryName: 'Data Interpretation',
      categorySlug: 'data-interpretation',
      categoryColor: '#6366f1',
      status: 'recommended',
      difficulty: 'intermediate',
      estimatedTime: 18,
      questionsCount: 22,
      reason: 'Strengthen your weak area',
    },
  ]);

  // Check if daily challenge is available
  get isDailyChallengeAvailable(): boolean {
    const challenge = this.dailyChallenge();
    return !challenge.completed && challenge.attempts < challenge.maxAttempts;
  }

  // Get daily challenge status text
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

  constructor(private router: Router) {}

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  navigateToSettings() {
    // TODO: Create settings page
    this.router.navigate(['/tabs/profile']); // Temporary redirect to profile
  }

  navigateToNotifications() {
    // TODO: Create notifications page
    // Mark notifications as read when navigating
    // this.notificationService.markAllAsRead();
    this.router.navigate(['/tabs/profile']); // Temporary redirect to profile
    
    // Simulate clearing badge (in real app, this happens after viewing notifications)
    // setTimeout(() => this.unreadNotifications.set(0), 500);
  }

  continueLearning() {
    const activity = this.continueActivity();
    if (!activity) {
      // No recent activity - navigate to explore/categories
      this.router.navigate(['/tabs/categories']);
      return;
    }

    // Navigate to exact resume point with state for position restoration
    this.router.navigate([activity.resumeUrl], {
      state: {
        resumeFrom: activity.currentQuestionIndex,
        timeElapsed: activity.timeElapsed,
        activityId: activity.id,
      },
    });
  }

  startDailyChallenge() {
    const challenge = this.dailyChallenge();
    if (!this.isDailyChallengeAvailable) {
      return; // Already completed or no attempts left
    }

    // TODO: Navigate to test-taking screen with daily challenge configuration
    this.router.navigate(['/test'], {
      state: {
        type: 'daily-challenge',
        challengeId: challenge.id,
        questionCount: challenge.totalQuestions,
        timeLimit: challenge.timeLimit,
        selectionStrategy: 'random',
      },
    });
  }

  startQuickPractice(practice: QuickPractice) {
    // TODO: Navigate to test-taking screen with quick practice configuration
    this.router.navigate(['/test'], {
      state: {
        type: 'quick-practice',
        practiceId: practice.id,
        questionCount: practice.questionCount,
        selectionStrategy: practice.selectionStrategy,
      },
    });
  }

  navigateToCategory(category: Category) {
    this.router.navigate(['/tabs/categories', category.slug]);
  }

  viewAllCategories() {
    this.router.navigate(['/tabs/categories']);
  }

  navigateToTopic(topic: RecommendedTopic) {
    this.router.navigate([
      '/tabs/categories',
      topic.categorySlug,
      'topics',
      topic.slug,
    ]);
  }

  getStatusLabel(topic: RecommendedTopic): string {
    if (topic.status === 'new') return 'New';
    if (topic.status === 'in-progress' && topic.progress) {
      return `${topic.progress}% Done`;
    }
    if (topic.status === 'recommended' && topic.reason) {
      return topic.reason;
    }
    return 'Recommended for you';
  }

  getStatusIcon(status: string): string {
    if (status === 'new') return 'sparkles';
    if (status === 'in-progress') return 'time';
    return 'bulb';
  }

  getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }
}
