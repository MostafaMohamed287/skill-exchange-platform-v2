import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  login(data: any) {
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/users`, data);
  }
}