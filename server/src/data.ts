import { v4 as uuid } from 'uuid';
import type {
  Category,
  Topic,
  Test,
  Question,
  User,
  UserProfile,
  UserPreferences,
  DailyChallenge,
  DailyChallengeAttempt,
  TopicProgress,
  CategoryProgress,
  UserProgress,
  TestAttempt,
  HomeScreenData,
} from './backend-models';

// In-memory stores (Maps for quick lookup)
export const users = new Map<string, User>();
export const profiles = new Map<string, UserProfile>();
export const categories = new Map<string, Category>();
export const topics = new Map<string, Topic>();
export const tests = new Map<string, Test>();
export const questions = new Map<string, Question>();
export const testAttempts = new Map<string, TestAttempt>();
export const topicProgress = new Map<string, TopicProgress>();
export const categoryProgress = new Map<string, CategoryProgress>();
export const userProgress = new Map<string, UserProgress>();
export const dailyChallenges = new Map<string, DailyChallenge>();
export const dailyChallengeAttempts = new Map<string, DailyChallengeAttempt>();

// Seed minimal demo data
(function seed() {
  const userId = uuid();
  const now = new Date();
  const prefs: UserPreferences = {
    emailNotifications: true,
    pushNotifications: false,
    dailyChallengeReminder: true,
    defaultDifficulty: 'intermediate',
    practiceMode: 'timed',
    theme: 'auto',
    language: 'en',
  };
  const user: User = {
    id: userId,
    email: 'sarah.johnson@example.com',
    passwordHash: '$2a$10$abcdefghijklmnopqrstuv', // not valid; login will be handled during register
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah J',
    status: 'active',
    emailVerified: true,
    preferences: prefs,
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  };
  users.set(userId, user);

  const profile: UserProfile = {
    id: userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    initials: 'SJ',
    avatar: undefined,
    totalTopicsStarted: 1,
    totalTopicsCompleted: 0,
    totalTestsCompleted: 0,
    totalQuestionsAnswered: 0,
    averageScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    memberSince: now,
    lastActive: now,
  };
  profiles.set(userId, profile);

  const catId = uuid();
  const cat: Category = {
    id: catId,
    slug: 'numerical-reasoning',
    name: 'Numerical Reasoning',
    description: 'Practice ratios, percentages, and more.',
    icon: 'calculator',
    iconSvg: undefined,
    color: '#3b82f6',
    topics: [],
    topicCount: 0,
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  };
  categories.set(catId, cat);

  const topicId = uuid();
  const topic: Topic = {
    id: topicId,
    slug: 'ratios-and-proportions',
    categoryId: catId,
    title: 'Ratios & Proportions',
    description: 'Understand and solve ratio problems.',
    learningObjectives: ['Simplify ratios', 'Solve proportion problems'],
    tests: [],
    testCount: 0,
    difficulty: 'beginner',
    estimatedTime: 20,
    totalQuestions: 5,
    prerequisites: [],
    recommendedFor: ['beginners'],
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    isNew: true,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
  topics.set(topicId, topic);
  const catUpdate = categories.get(catId)!;
  catUpdate.topics.push(topicId);
  catUpdate.topicCount = 1;
  categories.set(catId, catUpdate);

  const testId = uuid();
  const test: Test = {
    id: testId,
    topicId,
    categoryId: catId,
    title: 'Ratios Practice 1',
    description: 'Five MCQs on ratios',
    instructions: 'Select the best answer.',
    type: 'practice',
    difficulty: 'beginner',
    questions: [],
    questionCount: 5,
    timeLimit: 10,
    estimatedTime: 10,
    passingScore: 60,
    pointsPerQuestion: 10,
    allowReview: true,
    showCorrectAnswers: true,
    shuffleQuestions: false,
    shuffleOptions: true,
    isPublished: true,
    requiresPremium: false,
    displayOrder: 1,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
  tests.set(testId, test);
  const topicUpdate = topics.get(topicId)!;
  topicUpdate.tests.push(testId);
  topicUpdate.testCount = 1;
  topics.set(topicId, topicUpdate);

  // Add 5 simple questions
  for (let i = 1; i <= 5; i++) {
    const qId = uuid();
    questions.set(qId, {
      id: qId,
      testId,
      topicId,
      categoryId: catId,
      questionText: `What is the ratio of ${i}:${i * 2} simplified?`,
      questionType: 'multiple-choice',
      options: [
        { id: 'a', text: '1:1', displayOrder: 1 },
        { id: 'b', text: '1:2', displayOrder: 2 },
        { id: 'c', text: '2:1', displayOrder: 3 },
        { id: 'd', text: '2:3', displayOrder: 4 },
      ],
      correctOptionIds: ['b'],
      difficulty: 'beginner',
      tags: ['ratios'],
      explanation: 'Divide both terms by their GCD.',
      detailedSolution: 'GCD(i, 2i) = i so ratio reduces to 1:2',
      hints: ['Think GCD'],
      difficultyRating: 20,
      averageTimeSpent: 15,
      correctAnswerRate: 80,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    });
    const testUpdate = tests.get(testId)!;
    testUpdate.questions.push(qId);
    tests.set(testId, testUpdate);
  }
})();

export function getProfileForUser(userId: string): UserProfile | undefined {
  return profiles.get(userId);
}

export function buildHomeData(userId: string): HomeScreenData {
  const profile = getProfileForUser(userId)!;
  const catWithProgress = Array.from(categories.values()).map((c) => ({
    category: c,
    completedTopics: 0,
    totalTopics: c.topicCount,
    progressPercentage: 0,
    averageScore: 0,
    lastAccessedAt: undefined,
    isWeakArea: false,
    isStrength: false,
  }));
  return {
    user: profile,
    unreadNotifications: 3,
    continueActivity: {
      type: 'topic',
      id: Array.from(topics.values())[0]?.id || '',
      title: 'Numerical Reasoning',
      subtitle: 'Ratios & Proportions',
      progress: 0,
      resumeUrl: '/categories/numerical-reasoning/topics/ratios-proportions/practice',
    },
    dailyChallenge: {
      challenge: {
        id: uuid(),
        date: new Date().toISOString().slice(0, 10),
        title: 'Daily Mix',
        description: '5 mixed questions',
        questions: [],
        questionCount: 5,
        timeLimit: 10,
        pointsReward: 50,
        bonusPoints: 20,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      },
      userAttempt: undefined,
      isAvailable: true,
      isCompleted: false,
    },
    quickPractice: [
      { id: 'qp1', title: '5 Random', description: 'Quick 5 questions', questionCount: 5, icon: 'flash', color: '#22c55e' },
    ],
    categories: catWithProgress,
    recommendedTopics: [
      {
        topic: Array.from(topics.values())[0],
        progress: undefined,
        recommendation: {
          userId,
          topicId: Array.from(topics.values())[0].id,
          reason: 'new-content',
          reasonText: 'New content available',
          relevanceScore: 90,
          confidenceScore: 80,
          basedOn: [],
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 3600 * 1000),
        },
      },
    ],
  };
}
