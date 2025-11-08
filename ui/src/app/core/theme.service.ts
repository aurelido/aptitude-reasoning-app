import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private KEY = 'prefers-dark';

  isDark(): boolean {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved !== null) return saved === 'true';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  }

  apply(dark: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', dark);
    document.body.classList.toggle('dark', dark);
    try { localStorage.setItem(this.KEY, String(dark)); } catch {}
  }
}
