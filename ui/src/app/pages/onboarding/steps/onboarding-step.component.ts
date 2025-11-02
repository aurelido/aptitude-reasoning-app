import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface Step {
  imageSrc: string;
  headline: string;
  description: string;
}

@Component({
  selector: 'app-onboarding-step',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
  <!-- <ion-content class="ion-padding flex flex-col items-center justify-center min-h-screen"> -->
  <ion-content class="min-h-[100dvh] bg-white relative overflow-hidden flex flex-col">
    <div class="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-70 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_70%)]"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-70 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_70%)]"></div>

    <ion-button fill="clear" size="small" (click)="skip.emit()" class="!absolute top-4 right-4 text-slate-500">Skip</ion-button>

    <div class="flex-1 flex items-center justify-center px-6 py-10">
      <div class="w-full max-w-2xl text-center">
        <div class="mx-auto w-full max-w-[560px] aspect-square">
          <img [src]="imageSrc" [alt]="headline" class="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(79,70,229,0.22)]"/>
        </div>

        <h1 class="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{{ headline }}</h1>
        <p class="mt-3 text-[13px] md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="px-6 pb-6 flex items-center justify-between">
      <ion-button fill="clear" (click)="back.emit()" class="text-slate-600">Back</ion-button>
      <div class="flex items-center gap-2">
        <ng-container *ngFor="let _ of [].constructor(total); let i = index">
          <span class="w-2.5 h-2.5 rounded-full" [ngClass]="i === current ? 'bg-primary' : 'ring-2 ring-primary/30'"></span>
        </ng-container>
      </div>
      <ion-button (click)="next.emit()">{{ current === total - 1 ? 'Get Started' : 'Next' }}</ion-button>
    </div>
  </ion-content>
  `,
})
export class OnboardingStepComponent {
  @Input() imageSrc = '';
  @Input() headline = '';
  @Input() description = '';
  @Input() current = 0;
  @Input() total = 1;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();
}
