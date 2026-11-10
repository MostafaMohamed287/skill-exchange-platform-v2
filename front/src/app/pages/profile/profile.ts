import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
templateUrl: './profile.html',
styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.http.get(`${this.apiUrl}/users/profile`).subscribe({
        next: (res: any) => {
          this.user = res;
        },
        error: (err) => {
          console.error('Error fetching profile', err);
        }
      });
    }
  }
}
