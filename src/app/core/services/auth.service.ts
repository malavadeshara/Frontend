import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../features/auth/register/register.models';
import { LoginRequest, LoginResponse } from '../../features/auth/login/login.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl = 'https://vehicle-inventory-api.onrender.com/api/auth'; // adjust if needed
    private readonly baseUrlUser = 'https://vehicle-inventory-api.onrender.com/api/users'; // adjust if needed

    // private readonly baseUrl = 'http://localhost/api/api/auth';
    // private readonly baseUrlUser = 'http://localhost/api/api/users'

    constructor(private http: HttpClient) { }

    register(payload: RegisterRequest): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/register`, payload);
    }

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
    }

    getCurrentUser(): Observable<any> {
        return this.http.get(`${this.baseUrlUser}/me`);
    }

    saveToken(token: string): void {
        localStorage.setItem('accessToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    logout(): void {
        localStorage.clear();
    }

    saveUserRole(role: string): void {
        localStorage.setItem('role', role);
    }

    getUserRole(): string | null {
        return localStorage.getItem('role');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

}