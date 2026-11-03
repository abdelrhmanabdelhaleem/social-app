import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  // State management variables for loading and error handling
  isLoading: boolean = false;
  errorMessage: string = '';
  loginForm!: FormGroup;
  private signinSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.loginFormInit();
  }

  // Initialize the login form using FormBuilder
  loginFormInit(): void {
    this.loginForm = this._FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Handle form submission and API subscription
  onSubmit(): void {
    this.signinSubscription?.unsubscribe();

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.signinSubscription = this._AuthService.signin(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Optionally save user token to local storage
          if (response.data?.token) {
            localStorage.setItem('userToken', response.data.token);
          }
          // Navigate to home or dashboard on success
          this._Router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          // Capture error message from API response
          this.errorMessage =
            err.error?.message ||
            err.error?.errors ||
            'Invalid email or password. Please try again.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Lifecycle hook to clean up subscriptions when component is destroyed
  ngOnDestroy(): void {
    this.signinSubscription?.unsubscribe();
  }
}
