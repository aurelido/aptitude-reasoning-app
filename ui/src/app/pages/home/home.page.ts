import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import {
  UserProfile,
  ContinueLearningActivity,
  DailyChallenge,
  QuickPractice,
  Category,
  RecommendedTopic,
} from './home.models';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { ContinueLearningCardComponent } from './components/continue-learning-card/continue-learning-card.component';
import { DailyChallengeCardComponent } from './components/daily-challenge-card/daily-challenge-card.component';
import { QuickPracticeSectionComponent } from './components/quick-practice-section/quick-practice-section.component';
import { CategoriesSectionComponent } from './components/categories-section/categories-section.component';
import { RecommendedTopicsSectionComponent } from './components/recommended-topics-section/recommended-topics-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    HomeHeaderComponent,
    ContinueLearningCardComponent,
    DailyChallengeCardComponent,
    QuickPracticeSectionComponent,
    CategoriesSectionComponent,
    RecommendedTopicsSectionComponent,
  ],
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
      icon: 'contract-outline',
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
    if (challenge.completed || challenge.attempts >= challenge.maxAttempts) {
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
}
