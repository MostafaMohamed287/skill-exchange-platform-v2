
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Skill {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getSkills() {
    return this.http.get<any[]>(`${this.apiUrl}/skills`);
  }

  getSkillById(id: string) {
    return this.http.get(`${this.apiUrl}/skills/${id}`);
  }

  createSkill(data: any) {
    return this.http.post(`${this.apiUrl}/skills`, data);
  }

  updateSkill(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/skills/${id}`, data);
  }

  deleteSkill(id: string) {
    return this.http.delete(`${this.apiUrl}/skills/${id}`);
  }
}

