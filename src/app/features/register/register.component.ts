import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  // State management variables for loading and error handling
  isLoading: boolean = false;
  errorMessage: string = '';
  registerForm!: FormGroup;
  private signupSubscription: Subscription = new Subscription();
  ngOnInit() {
    this.registerFormInit();
  }

  registerFormInit() {
    // Initialize the reactive registration form with validators
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        username: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z0-9_]{3,30}$/),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        gender: new FormControl('', [Validators.required]),
        dateOfBirth: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/),
        ]),
        rePassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // Custom validator to check if password and confirmation match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  // Handle form submission and API subscription
  onSubmit(): void {
    // Unsubscribe from any previous active request to avoid memory leaks or duplicate calls
    this.signupSubscription?.unsubscribe();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this._AuthService.signup(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Navigate to login on successful registration
          this._Router.navigate(['/login']);
        },
        error: (err) => {
          console.log('🚀 ~ RegisterComponent ~ onSubmit ~ err:', err);
          this.isLoading = false;
          // Capture error message from API response
          this.errorMessage =
            err.error?.message || err.error?.errors || 'Something went wrong. Please try again.';
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  // Lifecycle hook to clean up subscriptions when the component is destroyed
  ngOnDestroy(): void {
    this.signupSubscription?.unsubscribe();
  }
}
