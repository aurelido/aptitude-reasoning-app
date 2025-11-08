import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStore } from '../../core/auth.store';
import { Router } from '@angular/router';
import { UsersApi } from '../../core/users.api';

interface AvatarOption { id: number; src: string; locked: boolean; }

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/tabs/profile"></ion-back-button>
      </ion-buttons>
      <ion-title>Edit Profile</ion-title>
      <ion-buttons slot="end">
        <ion-button [disabled]="form.invalid" (click)="save()">Save</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <!-- Identity -->
    <ion-list inset lines="full">
      <ion-list-header>Personal Information</ion-list-header>
      <ion-item>
        <ion-input label="First name" labelPlacement="stacked" formControlName="firstName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Last name" labelPlacement="stacked" formControlName="lastName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Display name" labelPlacement="stacked" formControlName="name"></ion-input>
      </ion-item>
    </ion-list>

    <!-- Avatars -->
    <div class="ion-margin-top">
      <h2 class="section-title">Choose Avatar</h2>
      <div class="avatar-grid">
        <button type="button" class="avatar-cell" *ngFor="let a of avatars()" (click)="selectAvatar(a)">
          <ion-avatar [class.locked]="a.locked && !isSubscriber()" [class.selected]="a.src === selectedAvatar()">
            <img [src]="a.src" [alt]="'Avatar ' + a.id" />
          </ion-avatar>
          <ion-icon *ngIf="a.locked && !isSubscriber()" name="lock-closed" class="lock"></ion-icon>
          <ion-icon *ngIf="a.src === selectedAvatar()" name="checkmark-circle" class="check"></ion-icon>
        </button>
      </div>
      <ion-note class="ion-margin-top">6 avatars are free. Unlock the rest with a subscription.</ion-note>
    </div>
  </ion-content>
  `,
  styles: [`
    .section-title { font-weight: 700; font-size: 16px; margin: 12px 8px; }
    .avatar-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .avatar-cell { position:relative; padding:0; background:none; border:none; }
    ion-avatar { width:64px; height:64px; box-shadow:0 4px 12px rgba(0,0,0,.08); border-radius:50%; overflow:hidden; }
    ion-avatar.locked { filter: grayscale(0.15) brightness(0.9); opacity: 0.8; }
    ion-avatar.selected { outline: 3px solid var(--ion-color-primary); }
    .lock { position:absolute; bottom:-6px; right:-6px; background:#fff; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,.15); padding:4px; }
    .check { position:absolute; top:-8px; right:-8px; color: var(--ion-color-primary); background:#fff; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,.15); padding:2px; }
  `]
})
export class EditProfilePage {
  private fb = inject(FormBuilder);
  private store = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(ToastController);
  private users = inject(UsersApi);

  // TODO: replace with real entitlement check
  isSubscriber = signal(false);

  readonly initial = this.store.user();

  form = this.fb.nonNullable.group({
    firstName: [this.initial?.firstName ?? '', [Validators.required]],
    lastName: [this.initial?.lastName ?? '', [Validators.required]],
    name: [this.initial?.name ?? '', [Validators.required]],
  });

  selectedAvatar = signal<string | null>(this.initial?.avatar ?? null);

  avatars = signal<AvatarOption[]>(Array.from({ length: 16 }, (_, i) => {
    const id = i + 1;
    const src = `assets/avatars/avatar-${String(id).padStart(2,'0')}.png`;
    const locked = id > 6; // first 6 are free
    return { id, src, locked };
  }));

  async selectAvatar(a: AvatarOption) {
    if (a.locked && !this.isSubscriber()) {
      const t = await this.toast.create({ message: 'This avatar is available for subscribers.', duration: 2000, color: 'medium' });
      t.present();
      return;
    }
    this.selectedAvatar.set(a.src);
  }

  save() {
    if (this.form.invalid) return;
    const { firstName, lastName, name } = this.form.getRawValue();
    const payload = {
      firstName,
      lastName,
      displayName: name,
      avatar: this.selectedAvatar(),
    };
    this.users.updateMyProfile(payload).subscribe(profile => {
      // Server returns profile; sync to store
      this.store.updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        name: profile.name,
        avatar: profile.avatar ?? null,
        initials: profile.initials,
      });
      this.router.navigate(['/tabs/profile']);
    });
  }
}
