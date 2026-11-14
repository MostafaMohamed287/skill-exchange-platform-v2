import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  owner?: { name: string };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skills`;

  auth = inject(Auth);

  allSkills = signal<Skill[]>([]);
  featuredSkills = computed(() => this.allSkills().slice(0, 3));

  searchResults: Skill[] = [];
  searchTerm: string = '';
  hasSearched: boolean = false;

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills() {
    this.http.get<Skill[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.allSkills.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearch() {
    this.hasSearched = true;

    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.searchResults = this.allSkills().filter(skill =>
      skill.title?.toLowerCase().includes(term) ||
      skill.category?.toLowerCase().includes(term)
    );
  }
}
