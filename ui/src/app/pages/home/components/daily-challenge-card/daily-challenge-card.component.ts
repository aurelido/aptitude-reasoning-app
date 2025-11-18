import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DailyChallenge } from '../../home.models';

@Component({
  selector: 'app-daily-challenge-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './daily-challenge-card.component.html',
  styleUrls: ['./daily-challenge-card.component.scss'],
})
export class DailyChallengeCardComponent {
  @Input({ required: true }) challenge!: DailyChallenge;
  @Output() start = new EventEmitter<void>();

  get isAvailable(): boolean {
    const challenge = this.challenge;
    return !challenge.completed && challenge.attempts < challenge.maxAttempts;
  }

  get status(): string {
    const challenge = this.challenge;
    if (challenge.completed) {
      return `Completed! Score: ${challenge.score}%`;
    }
    if (challenge.attempts >= challenge.maxAttempts) {
      return 'Completed for today';
    }
    return `${challenge.totalQuestions} questions • ${challenge.timeLimit} min`;
  }
}
