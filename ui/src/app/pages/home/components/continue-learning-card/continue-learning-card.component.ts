import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContinueLearningActivity } from '../../home.models';

@Component({
  selector: 'app-continue-learning-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './continue-learning-card.component.html',
  styleUrls: ['./continue-learning-card.component.scss'],
})
export class ContinueLearningCardComponent {
  @Input() activity: ContinueLearningActivity | null = null;
  @Output() continue = new EventEmitter<void>();

  get activityTitle(): string {
    const activity = this.activity;
    if (!activity) return 'Start Your First Lesson';

    if (activity.subtitle) {
      return `${activity.title} - ${activity.subtitle}`;
    }
    return activity.title;
  }

  get progressText(): string {
    const activity = this.activity;
    if (!activity) return '';

    if (activity.completedQuestions && activity.totalQuestions) {
      return `${activity.completedQuestions}/${activity.totalQuestions} questions • ${activity.progress}% Complete`;
    }
    return `${activity.progress}% Complete`;
  }
}
