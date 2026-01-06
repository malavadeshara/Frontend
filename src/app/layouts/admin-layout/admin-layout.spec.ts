import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminLayoutComponent } from './admin-layout';


@Component({
  selector: 'app-navbar',
  standalone: true,
  template: '<div>Mock Navbar</div>',
})
class MockNavbarComponent {
  @Input() role!: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  template: '<div>Mock Footer</div>',
})
class MockFooterComponent {}


describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AdminLayoutComponent
      ]
    })
      .overrideComponent(AdminLayoutComponent, {
        set: {
          imports: [
            RouterTestingModule,
            MockNavbarComponent,
            MockFooterComponent
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the admin layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navbar component', () => {
    const navbar = fixture.debugElement.query(
      By.directive(MockNavbarComponent)
    );
    expect(navbar).toBeTruthy();
  });

  it('should pass role="Admin" to navbar component', () => {
    const navbar = fixture.debugElement.query(
      By.directive(MockNavbarComponent)
    ).componentInstance as MockNavbarComponent;

    expect(navbar.role).toBe('Admin');
  });

  it('should render router-outlet', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).toBeTruthy();
  });

  it('should render the footer component', () => {
    const footer = fixture.debugElement.query(
      By.directive(MockFooterComponent)
    );
    expect(footer).toBeTruthy();
  });
});