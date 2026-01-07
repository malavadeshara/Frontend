import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent {
  @Input() role!: 'Admin' | 'Customer';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  // logout(): void {
  //   this.http.post('http://localhost/api/api/auth/logout', {}).subscribe({
  //     next: () => this.finishLogout(),
  //     error: () => this.finishLogout()
  //   });
  // }

  logout(): void {
    this.http.post('https://vehicle-inventory-api.onrender.com/api/auth/logout', {}).subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  private finishLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    // Hide offcanvas after click
    const offcanvasEl = document.getElementById('navbarOffcanvas');
    bootstrap.Offcanvas.getInstance(offcanvasEl)?.hide();
  }
}