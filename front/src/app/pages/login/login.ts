
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    const loginData = this.loginForm.value;

    this.http.post<any>(
      `${environment.apiUrl}/users/login`,
      loginData
    ).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message ||
          'Login failed, please check your credentials.';
      }
    });
  }
}
