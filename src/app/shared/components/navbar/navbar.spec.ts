import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

const mockOffcanvas = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
};

const mockModal = {
    show: jasmine.createSpy('show')
};

(window as any).bootstrap = {
    Offcanvas: function () {
        return mockOffcanvas;
    },
    Modal: function () {
        return mockModal;
    }
};

(window as any).bootstrap.Offcanvas.getInstance = () => mockOffcanvas;

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let router: Router;
    let authService: jasmine.SpyObj<AuthService>;
    let httpClient: jasmine.SpyObj<HttpClient>;

    beforeEach(async () => {
        authService = jasmine.createSpyObj('AuthService', ['logout']);
        httpClient = jasmine.createSpyObj('HttpClient', ['post']);

        await TestBed.configureTestingModule({
            imports: [CommonModule, RouterTestingModule, NavbarComponent],
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: HttpClient, useValue: httpClient }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        spyOn(router, 'navigate');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show customer links when role is Customer', () => {
        component.role = 'Customer';
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Vehicles');
        expect(compiled.textContent).toContain('My Bookings');
    });

    it('should show admin links when role is Admin', () => {
        component.role = 'Admin';
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Vehicles');
        expect(compiled.textContent).toContain('Bookings');
    });

    it('should logout successfully and navigate to login', () => {
        httpClient.post.and.returnValue(of({}));

        component.logout();

        expect(httpClient.post).toHaveBeenCalled();
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should still logout even if API logout fails', () => {
        httpClient.post.and.returnValue(throwError(() => new Error('Error')));

        component.logout();

        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });


    // it('should navigate and close offcanvas', () => {
    //     component.navigate('/vehicles');

    //     expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
    //     expect(mockOffcanvas.hide).toHaveBeenCalled();
    // });


    // it('should open booking offcanvas on mobile', (done) => {
    //     spyOnProperty(window, 'innerWidth').and.returnValue(500);

    //     const navCanvas = document.createElement('div');
    //     navCanvas.id = 'navbarOffcanvas';
    //     document.body.appendChild(navCanvas);

    //     const bookingCanvas = document.createElement('div');
    //     bookingCanvas.id = 'bookingOffcanvas';
    //     document.body.appendChild(bookingCanvas);

    //     component.openMyBookingsMobile();

    //     setTimeout(() => {
    //         expect(mockOffcanvas.hide).toHaveBeenCalled();
    //         expect(mockOffcanvas.show).toHaveBeenCalled();
    //         done();
    //     }, 350);
    // });


    // it('should open modal on desktop', () => {
    //     spyOnProperty(window, 'innerWidth').and.returnValue(1200);

    //     const modal = document.createElement('div');
    //     modal.id = 'bookingModal';
    //     document.body.appendChild(modal);

    //     component.openMyBookingsDesktop();

    //     expect(mockModal.show).toHaveBeenCalled();
    // });
});