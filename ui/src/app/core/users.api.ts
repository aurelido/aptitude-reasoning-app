import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserPreferencesDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  dailyChallengeReminder?: boolean;
  defaultDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  practiceMode?: 'timed' | 'untimed';
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'es' | 'fr' | 'de' | 'hi';
}

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  initials?: string;
  avatar?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly api = inject(ApiService);

  getMyPreferences(): Observable<UserPreferencesDto> {
    return this.api.get<UserPreferencesDto>('/users/me/preferences');
  }

  updateMyPreferences(patch: Partial<UserPreferencesDto>): Observable<UserPreferencesDto> {
    return this.api.patch<UserPreferencesDto>('/users/me/preferences', patch);
  }

  updateMyProfile(patch: Partial<UserProfileDto & { displayName?: string; avatar?: string | null }>): Observable<UserProfileDto> {
    return this.api.patch<UserProfileDto>('/users/me', patch);
  }
}
