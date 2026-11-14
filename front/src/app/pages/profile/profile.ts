import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = environment.apiUrl;

  get user(): any {
    return this.auth.user();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  // بيحدّث بيانات المستخدم من السيرفر (الراوت ده محتاج توكن)
  loadProfile() {
    const id = this.user?._id;
    if (!id) return;

    this.http.get(`${this.apiUrl}/users/${id}`).subscribe({
      next: (res: any) => this.auth.setUser(res),
      error: (err) => console.error('Error fetching profile', err)
    });
  }
}
