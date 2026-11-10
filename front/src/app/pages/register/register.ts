
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private authService = inject(Auth);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  bio = '';
  location = '';

  successMessage = '';
  errorMessage = '';

  register() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      bio: this.bio,
      location: this.location
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        console.log('Register successful:', response);

        this.successMessage = 'Registration successful!';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500);
      },

      error: (error) => {
        console.log('Register failed:', error);

        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      }
    });
  }
}

