import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

type TopicStatus = 'not-started' | 'in-progress' | 'completed';
type Difficulty = 'easy' | 'medium' | 'hard';

type TopicData = {
  name: string;
  description: string;
  hasFormulas: boolean;
  totalAttempts: number;
  correctAnswers: number;
  averageTime: string;
  lastPracticed: string;
  progress: number;
  questions: number;
  status: TopicStatus;
};

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './topic.page.html',
  styleUrls: ['./topic.page.scss'],
})
export class TopicPage {
  categorySlug = '';
  topicSlug = '';
  selectedDifficulty = signal<Difficulty>('medium');
  topicData: TopicData | null = null;

  private readonly topicsDatabase: Record<string, TopicData> = {
    'pattern-recognition': {
      name: 'Pattern Recognition',
      description: 'Learn to identify and predict patterns in visual sequences. This fundamental skill is essential for abstract reasoning tests.',
      hasFormulas: false,
      totalAttempts: 45,
      correctAnswers: 34,
      averageTime: '1:45',
      lastPracticed: '2 days ago',
      progress: 75,
      questions: 45,
      status: 'in-progress',
    },
    'number-systems': {
      name: 'Number Systems',
      description: 'Master different number systems including natural numbers, integers, rational and irrational numbers, and their properties.',
      hasFormulas: true,
      totalAttempts: 48,
      correctAnswers: 43,
      averageTime: '2:10',
      lastPracticed: 'Today',
      progress: 90,
      questions: 48,
      status: 'in-progress',
    },
    'syllogisms': {
      name: 'Syllogisms',
      description: 'Understand logical arguments and conclusions based on given premises. Essential for competitive exams.',
      hasFormulas: false,
      totalAttempts: 50,
      correctAnswers: 35,
      averageTime: '1:55',
      lastPracticed: '1 day ago',
      progress: 70,
      questions: 50,
      status: 'in-progress',
    },
    'reading-comprehension': {
      name: 'Reading Comprehension',
      description: 'Improve your ability to understand, analyze, and interpret written passages effectively.',
      hasFormulas: false,
      totalAttempts: 55,
      correctAnswers: 44,
      averageTime: '3:20',
      lastPracticed: 'Today',
      progress: 60,
      questions: 55,
      status: 'in-progress',
    },
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.categorySlug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.topicSlug = this.route.snapshot.paramMap.get('topicSlug') ?? '';
    this.topicData = this.topicsDatabase[this.topicSlug] || {
      name: this.deslugify(this.topicSlug),
      description: 'Master this topic through structured learning and practice.',
      hasFormulas: false,
      totalAttempts: 0,
      correctAnswers: 0,
      averageTime: '--',
      lastPracticed: 'Never',
      progress: 0,
      questions: 40,
      status: 'not-started',
    };
  }

  goBack() {
    this.router.navigate(['/tabs/categories', this.categorySlug]);
  }

  selectDifficulty(difficulty: Difficulty) {
    this.selectedDifficulty.set(difficulty);
  }

  get accuracy(): number {
    if (!this.topicData || this.topicData.totalAttempts === 0) return 0;
    return Math.round((this.topicData.correctAnswers / this.topicData.totalAttempts) * 100);
  }

  getDifficultyColor(difficulty: Difficulty): string {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
    };
    return colors[difficulty];
  }

  getPracticeModes() {
    if (!this.topicData) return [];
    
    return [
      {
        icon: 'play-circle-outline',
        title: 'Practice Questions',
        description: 'Practice at your own pace with instant feedback',
        color: 'primary',
        questions: Math.floor(this.topicData.questions * 0.6),
        recommended: true,
      },
      {
        icon: 'time-outline',
        title: 'Timed Test',
        description: 'Simulate real exam conditions with time limits',
        color: 'secondary',
        questions: Math.floor(this.topicData.questions * 0.4),
        duration: '30 min',
      },
      {
        icon: 'layers-outline',
        title: 'Flashcards',
        description: 'Quick revision of key concepts and formulas',
        color: 'tertiary',
        cards: 25,
      },
      {
        icon: 'trending-up-outline',
        title: 'Review Progress',
        description: 'Analyze your performance and identify weak areas',
        color: 'primary',
      },
    ];
  }

  private deslugify(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
