import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { defer, throwError } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../shared/components/dummy/dummy';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  // Helper for async observable
  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        LoaderComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate email correctly', () => {
    const email = component.registerForm.controls['email'];
    email.setValue('invalidEmail');
    expect(email.invalid).toBeTruthy();

    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('should validate password correctly', () => {
    const password = component.registerForm.controls['password'];

    password.setValue('short');
    expect(password.invalid).toBeTruthy();

    password.setValue('Valid1@Password');
    expect(password.valid).toBeTruthy();
  });

  it('should show validation toast if email in form is invalid on submit', () => {
    component.submit();
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toContain('Please enter a valid email address.');
  });

  it('should call authService.register on valid form submission', fakeAsync(() => {
    component.registerForm.setValue({
      userName: 'TestUser',
      email: 'test@example.com',
      password: 'Valid1@Password'
    });

    authServiceSpy.register.and.returnValue(asyncData(void 0)); // make async

    component.submit();

    // isLoading should be true immediately after submit
    expect(component.isLoading).toBeTrue();
    expect(authServiceSpy.register).toHaveBeenCalledWith({
      userName: 'TestUser',
      email: 'test@example.com',
      password: 'Valid1@Password'
    });

    tick(); // flush async observable

    // after observable resolves, isLoading should be false
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle successful registration', fakeAsync(() => {
    component.registerForm.setValue({
      userName: 'TestUser',
      email: 'test@example.com',
      password: 'Valid1@Password'
    });

    authServiceSpy.register.and.returnValue(of(void 0));

    component.submit();
    tick(); // simulate async

    expect(component.isLoading).toBeFalse();
    expect(component.showToast).toBeTrue();
    expect(component.toastClass).toBe('text-bg-success');
    expect(component.toastMessage).toContain('Registration successful');

    tick(2000); // wait for redirect timeout
    expect(fixture.componentRef.injector.get(RouterTestingModule)).toBeTruthy(); // Router is available
    expect(component.showToast).toBeFalse();
  }));

  it('should handle registration failure', fakeAsync(() => {
    component.registerForm.setValue({
      userName: 'TestUser',
      email: 'test@example.com',
      password: 'Valid1@Password'
    });

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Failed')));

    component.submit();
    tick(); // simulate async

    expect(component.isLoading).toBeFalse();
    expect(component.showToast).toBeTrue();
    expect(component.toastClass).toBe('text-bg-danger');
    expect(component.toastMessage).toContain('Registration failed');

    tick(2000); // wait for toast timeout
    expect(component.showToast).toBeFalse();
  }));
});