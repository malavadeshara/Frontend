import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    RouterModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  toastMessage = '';
  showToast = false;
  toastClass = 'text-bg-danger'; // default to error


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    const savedCredentials = localStorage.getItem('rememberMe');
    if (savedCredentials) {
      const creds = JSON.parse(savedCredentials);
      this.loginForm.patchValue({
        email: creds.email,
        password: creds.password,
        rememberMe: true
      });
    }
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.showToastMessage('Please enter valid email and password.');
      return;
    }

    this.isLoading = true;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.accessToken);

        if (rememberMe) {
          localStorage.setItem(
            'rememberMe',
            JSON.stringify({ email, password })
          );
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Show success toast
        this.showToastMessage('Login successful! Redirecting...', 'success');

        // Load user after token is saved
        this.loadCurrentUser();
      },
      error: () => {
        this.isLoading = false;
        this.showToastMessage('Internal Server Error.');
      }
    });
  }


  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoading = false;

        this.showToastMessage('Login successful!', 'success');
        this.authService.saveUserRole(user.role);

        if (user.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/vehicles']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.showToastMessage('Unable to fetch user details.', 'error');
      }
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'error'): void {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
    this.showToast = true;

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }
}