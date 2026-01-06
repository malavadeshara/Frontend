import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../../features/auth/register/register.models';
import { LoginRequest, LoginResponse } from '../../features/auth/login/login.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost/api/api/auth';
  const baseUrlUser = 'http://localhost/api/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),       // provides HttpClient
        provideHttpClientTesting() // replaces deprecated HttpClientTestingModule
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register API', () => {
    const payload: RegisterRequest = {
      userName: 'testuser',
      email: 'test@test.com',
      password: '123456',
      // confirmPassword: '123456'
    };

    service.register(payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should call login API and return tokens', () => {
    const payload: LoginRequest = {
      email: 'a@test.com',
      password: '123456'
    };

    const mockResponse: LoginResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };

    service.login(payload).subscribe(response => {
      expect(response.accessToken).toBe('access-token');
      expect(response.refreshToken).toBe('refresh-token');
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get current user', () => {
    const mockUser = { id: 1, email: 'test@test.com' };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrlUser}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should save and get access token', () => {
    service.saveToken('abc');
    expect(service.getToken()).toBe('abc');
  });

  it('should clear on logout', () => {
    localStorage.setItem('accessToken', 't');
    localStorage.setItem('refreshToken', 'r');

    service.logout();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});