import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCardComponent } from './vehicle-card';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

/**
 * Standalone stub for UpdateVehicleModalComponent
 */
@Component({
  selector: 'app-update-vehicle-modal',
  template: '',
  standalone: true
})
class UpdateVehicleModalStubComponent {
  @Input() vehicleId!: number;
  @Output() updated = new EventEmitter<void>();
}

describe('VehicleCardComponent', () => {
  let component: VehicleCardComponent;
  let fixture: ComponentFixture<VehicleCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVehicle = {
    id: 1,
    name: 'Honda City',
    year: 2023,
    inStock: true,
    ageInShowroom: '2 months',
    price: 1200000,
    shortDescription: 'Comfortable sedan',
    images: ['img1.jpg', 'img2.jpg']
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        VehicleCardComponent,
        UpdateVehicleModalStubComponent,
        HttpClientTestingModule // ✅ FIX
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleCardComponent);
    component = fixture.componentInstance;

    component.vehicle = mockVehicle;
    component.role = 'Customer';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display vehicle name and year', () => {
    const title = fixture.nativeElement.querySelector('h5');
    expect(title.textContent).toContain('Honda City');
    expect(title.textContent).toContain('2023');
  });

  it('should show "In Stock" badge when vehicle is in stock', () => {
    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent.trim()).toBe('In Stock');
    expect(badge.classList).toContain('bg-success');
  });

  it('should render carousel images', () => {
    const images = fixture.nativeElement.querySelectorAll('.carousel-item img');
    expect(images.length).toBe(2);
    expect(images[0].src).toContain('img1.jpg');
  });

  it('should show View Details button for Customer role', () => {
    const viewBtn = fixture.debugElement.query(
      By.css('button.btn-primary')
    );
    expect(viewBtn).toBeTruthy();
  });

  it('should navigate to vehicle details on View Details click', () => {
    const viewBtn = fixture.debugElement.query(
      By.css('button.btn-primary')
    );

    viewBtn.triggerEventHandler('click', null);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/vehicles',
      mockVehicle.id
    ]);
  });

  it('should NOT show Edit/Delete buttons for Customer role', () => {
    const actionArea = fixture.debugElement.query(
      By.css('.card-body .mt-auto')
    );

    const editBtn = actionArea.query(By.css('button.btn-secondary'));
    const deleteBtn = actionArea.query(By.css('button.btn-danger'));

    expect(editBtn).toBeNull();
    expect(deleteBtn).toBeNull();
  });


  it('should show Edit and Delete buttons for Admin role', () => {
    component.role = 'Admin';
    fixture.detectChanges();

    const editBtn = fixture.debugElement.query(By.css('button.btn-secondary'));
    const deleteBtn = fixture.debugElement.query(By.css('button.btn-danger'));

    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();
  });

  it('should emit delete event when confirmed', () => {
    component.role = 'Admin';
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.delete, 'emit');

    const deleteBtn = fixture.debugElement.query(By.css('button.btn-danger'));
    deleteBtn.triggerEventHandler('click', null);

    expect(component.delete.emit).toHaveBeenCalledWith(mockVehicle.id);
  });

  it('should not emit delete event when confirmation is cancelled', () => {
    component.role = 'Admin';
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.delete, 'emit');

    const deleteBtn = fixture.debugElement.query(By.css('button.btn-danger'));
    deleteBtn.triggerEventHandler('click', null);

    expect(component.delete.emit).not.toHaveBeenCalled();
  });

  it('should pass vehicleId to UpdateVehicleModalComponent', () => {
    const modalDebugEl = fixture.debugElement.query(
      By.css('app-update-vehicle-modal')
    );
    expect(modalDebugEl).toBeTruthy();
    const modalInstance = modalDebugEl.componentInstance as any;
    expect(modalInstance.vehicleId).toBe(mockVehicle.id);
  });

});