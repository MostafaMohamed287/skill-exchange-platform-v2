import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  // المستخدم الحالي (بيتقرأ من localStorage أول ما التطبيق يفتح)
  private _user = signal<any | null>(this.readStoredUser());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(data: any) {
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/users`, data);
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    this.setUser(user);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }

  private readStoredUser(): any | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
