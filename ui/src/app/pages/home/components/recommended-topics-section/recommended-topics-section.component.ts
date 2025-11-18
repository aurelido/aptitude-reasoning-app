import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecommendedTopic } from '../../home.models';

@Component({
  selector: 'app-recommended-topics-section',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './recommended-topics-section.component.html',
  styleUrls: ['./recommended-topics-section.component.scss'],
})
export class RecommendedTopicsSectionComponent {
  @Input({ required: true }) topics: RecommendedTopic[] = [];
  @Output() topicClick = new EventEmitter<RecommendedTopic>();

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
