import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = signal('');

  onSubmit() {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.errorMessage.set('Please fill in all fields correctly.');
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.auth.saveSession(response.token, response.user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Login failed, please check your credentials.'
        );
      }
    });
  }
}
