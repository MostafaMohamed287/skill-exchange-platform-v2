import { Component, inject, signal } from '@angular/core';
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

  successMessage = signal('');
  errorMessage = signal('');

  register() {
    if (!this.name.trim() || !this.email.trim() || !this.password) {
      this.errorMessage.set('Please enter your name, email and password.');
      this.successMessage.set('');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      bio: this.bio,
      location: this.location
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.successMessage.set('Registration successful! Redirecting to login...');
        this.errorMessage.set('');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        const msg: string = error.error?.message || '';

        this.errorMessage.set(
          msg.includes('already') || msg.includes('E11000')
            ? 'This email is already registered. Try logging in.'
            : 'Registration failed. Please try again.'
        );
        this.successMessage.set('');
      }
    });
  }
}
