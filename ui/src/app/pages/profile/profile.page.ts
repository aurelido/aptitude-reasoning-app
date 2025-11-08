import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/auth.store';
import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';
import { Router } from '@angular/router';
import { UsersApi, UserPreferencesDto } from '../../core/users.api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  private store = inject(AuthStore);
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private router = inject(Router);
  private usersApi = inject(UsersApi);

  readonly user = this.store.user; // signal

  // Demo values; later bind to real backend
  stats = signal([
    { label: 'Tests Completed', value: '12' },
    { label: 'Accuracy', value: '78%' },
    { label: 'Achievements', value: '8' },
    { label: 'Study Time', value: '24h' },
  ]);

  // Preferences (persist minimal dark mode locally)
  darkMode = signal(this.theme.isDark());
  notifications = signal(true);
  language = signal('en');
  difficulty = signal('medium');

  readonly levelBadge = computed(() => ({
    title: 'Intermediate Thinker 🧠',
    gradient: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500'
  }));

  ngOnInit() {
    // Hydrate preferences
    this.usersApi.getMyPreferences().subscribe((prefs) => {
      // theme
      this.darkMode.set((prefs.theme ?? 'light') === 'dark');
      // language
      if (prefs.language) this.language.set(prefs.language);
      // difficulty mapping
      const d = prefs.defaultDifficulty ?? 'beginner';
      this.difficulty.set(this.mapDifficultyFromApi(d));
      // daily challenge reminders
      if (typeof prefs.dailyChallengeReminder === 'boolean') {
        this.notifications.set(prefs.dailyChallengeReminder);
      }
      // apply theme immediately
      this.theme.apply(this.darkMode());
    });
  }

  private mapDifficultyToApi(local: string): UserPreferencesDto['defaultDifficulty'] {
    if (local === 'easy') return 'beginner';
    if (local === 'medium') return 'intermediate';
    return 'advanced';
  }
  private mapDifficultyFromApi(api: UserPreferencesDto['defaultDifficulty']): 'easy'|'medium'|'hard' {
    if (api === 'beginner') return 'easy';
    if (api === 'intermediate') return 'medium';
    return 'hard';
  }

  private persistPreferences(partial: Partial<UserPreferencesDto>) {
    this.usersApi.updateMyPreferences(partial).subscribe();
  }

  toggleDarkMode(ev: CustomEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checked = (ev as any).detail?.checked ?? false;
    this.darkMode.set(checked);
    this.theme.apply(checked);
    this.persistPreferences({ theme: checked ? 'dark' : 'light' });
  }

  onNotificationsChange(ev: CustomEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checked = (ev as any).detail?.checked ?? false;
    this.notifications.set(checked);
    this.persistPreferences({ dailyChallengeReminder: checked });
  }

  onLanguageChange(ev: CustomEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (ev as any).detail?.value;
    if (!val) return;
    this.language.set(val);
    this.persistPreferences({ language: val });
  }

  onDifficultyChange(ev: CustomEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (ev as any).detail?.value;
    if (!val) return;
    this.difficulty.set(val);
    this.persistPreferences({ defaultDifficulty: this.mapDifficultyToApi(val) });
  }

  goEdit() { this.router.navigate(['/tabs/profile/edit']); }

  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
