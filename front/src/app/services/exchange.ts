import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Exchange {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/exchanges`;

  getAllRequests() {
    return this.http.get(this.apiUrl);
  }

  getRequestById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createRequest(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateRequest(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteRequest(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}