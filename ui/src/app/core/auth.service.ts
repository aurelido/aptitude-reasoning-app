import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthStore, UserProfile } from './auth.store';

interface LoginRequest { email: string; password: string; }
interface LoginResponse { token: string; user: UserProfile; }
interface RegisterRequest { email: string; password: string; firstName: string; lastName: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly store = inject(AuthStore);

  login(body: LoginRequest): Observable<UserProfile> {
    return this.api.post<LoginResponse>('/auth/login', body).pipe(
      tap(res => this.store.setAuth(res.token, res.user)),
      map(res => res.user)
    );
  }

  register(body: RegisterRequest): Observable<UserProfile> {
    return this.api.post<LoginResponse>('/auth/register', body).pipe(
      tap(res => this.store.setAuth(res.token, res.user)),
      map(res => res.user)
    );
  }

  logout() { this.store.clear(); }
}
