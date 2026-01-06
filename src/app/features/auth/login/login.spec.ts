import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';


class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(
    of({ accessToken: 'fake-token' })
  );
  saveToken = jasmine.createSpy('saveToken');
  getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(
    of({ role: 'Admin' })
  );
  saveUserRole = jasmine.createSpy('saveUserRole');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate'); // spy router navigate
    fixture.detectChanges();
  });


  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: '',
      rememberMe: false
    });
  });

  it('should show error toast when form is invalid', () => {
    component.submit();
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toContain('Please enter valid email and password.');
    expect(authService.login).not.toHaveBeenCalled();
  });


  it('should login successfully and navigate to admin dashboard', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'admin@test.com',
      password: 'password',
      rememberMe: true
    });

    spyOn(localStorage, 'setItem');

    component.submit();
    tick();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'password'
    });
    expect(authService.saveToken).toHaveBeenCalledWith('fake-token');
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(authService.saveUserRole).toHaveBeenCalledWith('Admin');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'rememberMe',
      JSON.stringify({ email: 'admin@test.com', password: 'password' })
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate to vehicles page for non-admin user', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue(of({ role: 'Customer' }));
    component.loginForm.setValue({
      email: 'user@test.com',
      password: 'password',
      rememberMe: false
    });

    component.submit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
  }));


  it('should show error toast when login fails', fakeAsync(() => {
    authService.login.and.returnValue(
      throwError(() => new Error('Server error'))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password',
      rememberMe: false
    });

    component.submit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toContain('Internal Server Error');
  }));

  it('should handle error when fetching current user fails', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue(
      throwError(() => new Error('User error'))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password',
      rememberMe: false
    });

    component.submit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.toastMessage).toContain('Unable to fetch user details');
  }));

  it('should save credentials to localStorage when rememberMe is checked', fakeAsync(() => {
    spyOn(localStorage, 'setItem');

    component.loginForm.setValue({
      email: 'remember@test.com',
      password: 'password',
      rememberMe: true
    });

    component.submit();
    tick();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'rememberMe',
      JSON.stringify({ email: 'remember@test.com', password: 'password' })
    );
  }));

  it('should remove rememberMe from localStorage when unchecked', fakeAsync(() => {
    spyOn(localStorage, 'removeItem');

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password',
      rememberMe: false
    });

    component.submit();
    tick();

    expect(localStorage.removeItem).toHaveBeenCalledWith('rememberMe');
  }));

  it('should auto-hide toast after 4 seconds', fakeAsync(() => {
    component['showToastMessage']('Test message');
    expect(component.showToast).toBeTrue();

    tick(4000);
    expect(component.showToast).toBeFalse();
  }));
});