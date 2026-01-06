import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    RouterLink
  ]
})
export class RegisterComponent {

  registerForm: FormGroup;
  isLoading = false;
  toastMessage = '';
  showToast = false;
  toastClass = 'text-bg-danger';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      ]]
    });
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.showValidationToast();
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;

        this.toastClass = 'text-bg-success';
        this.toastMessage = 'Registration successful! Redirecting to login...';
        this.showToast = true;

        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
        this.toastClass = 'text-bg-danger';
        this.toastMessage = 'Registration failed. Please try again.';
        this.showToast = true;

        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }
    });
  }


  private showValidationToast(): void {
    if (this.registerForm.controls['email'].invalid) {
      this.toastMessage = 'Please enter a valid email address.';
    } else if (this.registerForm.controls['password'].invalid) {
      this.toastMessage =
        'Password must be at least 8 characters, include uppercase, lowercase, number and special character.';
    } else {
      this.toastMessage = 'Please fill all required fields correctly.';
    }
    this.showToast = true;
  }
}