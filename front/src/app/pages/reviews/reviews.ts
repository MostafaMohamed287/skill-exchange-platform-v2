import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Review {
  _id?: string;
  reviewer: { _id: string; name: string; email: string };
  reviewee: { _id: string; name: string; email: string };
  skill: { _id: string; title: string };
  rating: number;
  comment?: string;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewComponent implements OnInit {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  reviews = signal<Review[]>([]);
  showForm = signal(false);

  newReview = {
    reviewer: '',
    reviewee: '',
    skill: '',
    rating: 5,
    comment: ''
  };

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews() {
    this.http.get<Review[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.reviews.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
  }

  submitReview() {
    this.http.post(this.apiUrl, this.newReview).subscribe({
      next: () => {
        this.getReviews();
        this.showForm.set(false);
        this.newReview = { reviewer: '', reviewee: '', skill: '', rating: 5, comment: '' };
      },
      error: (err) => {
        console.error(err);
alert('An error occurred while adding the review. Please check that the entered data is valid.');      }
    });
  }
}