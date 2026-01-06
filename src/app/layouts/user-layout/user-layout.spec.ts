import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { UserLayoutComponent } from './user-layout';


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


describe('UserLayoutComponent', () => {
  let component: UserLayoutComponent;
  let fixture: ComponentFixture<UserLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        UserLayoutComponent
      ]
    })
      .overrideComponent(UserLayoutComponent, {
        set: {
          imports: [
            RouterTestingModule,
            MockNavbarComponent,
            MockFooterComponent
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the user layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navbar component', () => {
    const navbar = fixture.debugElement.query(
      By.directive(MockNavbarComponent)
    );
    expect(navbar).toBeTruthy();
  });

  it('should pass role="Customer" to navbar component', () => {
    const navbar = fixture.debugElement.query(
      By.directive(MockNavbarComponent)
    ).componentInstance as MockNavbarComponent;

    expect(navbar.role).toBe('Customer');
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