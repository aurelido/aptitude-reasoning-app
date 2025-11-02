import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingStepComponent, Step } from './steps/onboarding-step.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IonicModule, CommonModule, OnboardingStepComponent],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  steps: Step[] = [
    {
      imageSrc: 'assets/onboarding/step1.png',
      headline: 'Structured Learning Paths',
      description:
        'Master concepts with guided lessons and practice. Follow a clear roadmap to exam success.'
    },
    {
      imageSrc: 'assets/onboarding/step2.png',
      headline: 'Smart Practice Sets',
      description:
        'Adaptive question banks tuned to your level. Practice by topic, difficulty, or timed mocks.'
    },
    {
      imageSrc: 'assets/onboarding/step3.png',
      headline: 'Explanations & Tips',
      description:
        'Every answer explained clearly with tricks, shortcuts, and notes you can save.'
    },
    {
      imageSrc: 'assets/onboarding/step4.png',
      headline: 'Track Your Progress',
      description:
        'Beautiful charts and streaks keep you motivated. See accuracy, speed, and mastery grow.'
    }
  ];

  current = signal(0);
  total = this.steps.length;
  readonly isLast = computed(() => this.current() === this.total - 1);

  constructor(private router: Router) {}

  ngOnInit() {}

  next() {
    if (this.current() < this.total - 1) {
      this.current.set(this.current() + 1);
    } else {
      this.finish();
    }
  }

  back() {
    if (this.current() > 0) this.current.set(this.current() - 1);
  }

  skip() {
    this.finish();
  }

  private finish() {
    this.router.navigateByUrl('/tabs/home');
  }
}
