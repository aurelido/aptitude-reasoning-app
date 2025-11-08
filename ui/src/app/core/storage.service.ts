import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }

  get<T>(key: string, fallback: T | null = null): T | null {
    const s = this.storage();
    if (!s) return fallback;
    const raw = s.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw) as T; } catch { return fallback; }
  }

  set(key: string, value: unknown): void {
    const s = this.storage();
    if (!s) return;
    s.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    const s = this.storage();
    if (!s) return;
    s.removeItem(key);
  }
}
