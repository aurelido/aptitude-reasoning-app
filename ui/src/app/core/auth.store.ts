import { Injectable, computed, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  initials?: string;
  avatar?: string | null;
}

interface PersistedAuth { token: string; user: UserProfile; }

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly KEY = 'auth';

  readonly token = signal<string | null>(null);
  readonly user = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.token());

  constructor(private storage: StorageService) {
    const saved = this.storage.get<PersistedAuth>(this.KEY);
    if (saved?.token) {
      this.token.set(saved.token);
      this.user.set(saved.user);
    }
  }

  setAuth(token: string, user: UserProfile) {
    this.token.set(token);
    this.user.set(user);
    this.storage.set(this.KEY, { token, user });
  }

  clear() {
    this.token.set(null);
    this.user.set(null);
    this.storage.remove(this.KEY);
  }

  updateUser(patch: Partial<UserProfile>) {
    const current = this.user();
    if (!current) return;
    const next = { ...current, ...patch } as UserProfile;
    this.user.set(next);
    const saved = this.storage.get<{ token: string; user: UserProfile }>(this.KEY);
    if (saved?.token) {
      this.storage.set(this.KEY, { token: saved.token, user: next });
    }
  }
}
