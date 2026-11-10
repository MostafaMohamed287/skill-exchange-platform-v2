import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class User {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  getUsers() {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}