import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Auth } from '../../services/auth';
import { User } from '../../services/user';
import { Skill } from '../../services/skill';

interface Review {
  _id?: string;
  reviewer: { _id: string; name: string };
  reviewee: { _id: string; name: string };
  skill: { _id: string; title: string };
  rating: number;
  comment?: string;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewComponent implements OnInit {

  private http = inject(HttpClient);
  private userService = inject(User);
  private skillService = inject(Skill);
  private apiUrl = `${environment.apiUrl}/reviews`;

  auth = inject(Auth);

  reviews = signal<Review[]>([]);
  users = signal<any[]>([]);
  skills = signal<any[]>([]);
  showForm = signal(false);
  errorMessage = signal('');

  revieweeId = signal('');
  skillId = '';
  rating = 5;
  comment = '';

  myId = computed<string | undefined>(() => this.auth.user()?._id);

  // أقيّم أي حد غيري
  otherUsers = computed(() => this.users().filter(u => u._id !== this.myId()));

  // السكيلز بتاعت الشخص اللي بقيّمه
  revieweeSkills = computed(() =>
    this.skills().filter(s => s.owner?._id === this.revieweeId())
  );

  ngOnInit(): void {
    this.getReviews();

    if (this.auth.isLoggedIn()) {
      this.userService.getUsers().subscribe({
        next: (data: any) => this.users.set(data),
        error: (err) => console.error(err)
      });

      this.skillService.getSkills().subscribe({
        next: (data: any) => this.skills.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  getReviews() {
    this.http.get<Review[]>(this.apiUrl).subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => console.error(err)
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    this.errorMessage.set('');
  }

  onRevieweeChange(id: string) {
    this.revieweeId.set(id);
    this.skillId = '';
  }

  submitReview() {
    if (!this.revieweeId() || !this.skillId) {
      this.errorMessage.set('Please choose a user and a skill.');
      return;
    }

    const payload = {
      reviewer: this.myId(),          // أنا (المستخدم المسجل) تلقائي
      reviewee: this.revieweeId(),
      skill: this.skillId,
      rating: this.rating,
      comment: this.comment
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.getReviews();
        this.showForm.set(false);
        this.errorMessage.set('');
        this.revieweeId.set('');
        this.skillId = '';
        this.rating = 5;
        this.comment = '';
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Could not add the review. Please try again.');
      }
    });
  }
}
