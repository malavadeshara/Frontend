import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();

      if (role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'Customer') {
        this.router.navigate(['/vehicles']);
      }

      return false;
    }

    return true;
  }
}