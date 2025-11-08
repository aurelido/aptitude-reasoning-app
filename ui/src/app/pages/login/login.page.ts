import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { AuthStore } from '../../core/auth.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>Sign in</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <ion-item>
        <ion-input label="Email" labelPlacement="stacked" type="email" formControlName="email" required></ion-input>
      </ion-item>
      <ion-note color="danger" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Valid email required</ion-note>

      <ion-item>
        <ion-input label="Password" labelPlacement="stacked" type="password" formControlName="password" required></ion-input>
      </ion-item>
      <ion-note color="danger" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Password required</ion-note>

      <ion-button type="submit" expand="block" [disabled]="form.invalid || loading">{{ loading ? 'Signing in...' : 'Sign in' }}</ion-button>
    </form>

    <div class="ion-text-center ion-margin-top">
      <ion-button fill="clear" size="small" (click)="goOnboarding()">New here? Learn more</ion-button>
    </div>
  </ion-content>
  `,
  styles: [``]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private store = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  redirectUrl: string | null = null;
  loading = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // If already authed, go to tabs/home
    if (this.store.isAuthenticated()) {
      this.router.navigate(['/tabs']);
      return;
    }
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const dest = this.redirectUrl || '/tabs';
        this.router.navigateByUrl(dest);
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  goOnboarding() { this.router.navigate(['/onboarding']); }
}
