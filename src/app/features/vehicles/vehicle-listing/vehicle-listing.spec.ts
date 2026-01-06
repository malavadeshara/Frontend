import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListingComponent } from './vehicle-listing';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from './vehicle.models';

@Component({ 
  selector: 'app-vehicle-card', 
  template: '',
  standalone: true 
})
class VehicleCardStubComponent {
  @Input() vehicle: Vehicle | any;
  @Input() role: any;
  @Output() updated = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}

@Component({ 
  selector: 'app-create-vehicle-modal', 
  template: '',
  standalone: true 
})
class CreateVehicleModalStubComponent {
  @Output() vehicleCreated = new EventEmitter<any>();
}

describe('VehicleListingComponent', () => {
  let component: VehicleListingComponent;
  let fixture: ComponentFixture<VehicleListingComponent>;
  let vehicleServiceMock: any;
  let authServiceMock: any;

  const mockVehicles: Vehicle[] = [
    { name: 'Car A', model: 'Model A', year: 2020, images: ['img1.jpg'], price: 10000, currency: 'USD', ageInShowroom: '2 years', inStock: true, shortDescription: 'A car' },
    { name: 'Car B', model: 'Model B', year: 2021, images: ['img2.jpg'], price: 15000, currency: 'USD', ageInShowroom: '1 year', inStock: false, shortDescription: 'B car' }
  ];

  beforeEach(async () => {
    vehicleServiceMock = {
      getFiltered: jasmine.createSpy('getFiltered').and.returnValue(
        of({ items: mockVehicles, pageNumber: 1, pageSize: 6, totalCount: 2 })
      ),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    authServiceMock = {
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue('Admin')
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        ReactiveFormsModule,
        VehicleListingComponent,
        VehicleCardStubComponent,           // <-- import instead of declare
        CreateVehicleModalStubComponent     // <-- import instead of declare
      ],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize role and load vehicles on ngOnInit', () => {
    expect(component.role).toBe('Admin');
    expect(vehicleServiceMock.getFiltered).toHaveBeenCalled();
    expect(component.vehicles.length).toBe(2);
  });

  it('should delete vehicle and reload on success', () => {
    spyOn(component, 'loadVehicles');
    component.deleteVehicle(1);
    expect(vehicleServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.loadVehicles).toHaveBeenCalled();
  });

  it('should show toast on delete error', () => {
    vehicleServiceMock.delete.and.returnValue(throwError(() => new Error('Error')));
    spyOn(component, 'showToast');
    component.deleteVehicle(1);
    expect(component.showToast).toHaveBeenCalledWith('Failed to delete vehicle', true);
  });

  it('should compute totalPages correctly', () => {
    component.totalCount = 12;
    component.pageSize = 5;
    expect(component.totalPages).toBe(3);
  });

  it('should change page correctly', () => {
    spyOn(component, 'loadVehicles');
    component.totalCount = 12;
    component.pageSize = 6;
    component.changePage(2);
    expect(component.pageNumber).toBe(2);
    expect(component.loadVehicles).toHaveBeenCalled();
  });

  it('should not change page if out of bounds', () => {
    spyOn(component, 'loadVehicles');
    component.pageNumber = 1;
    component.totalCount = 12;
    component.pageSize = 6;
    component.changePage(0);
    component.changePage(3);
    expect(component.pageNumber).toBe(1);
    expect(component.loadVehicles).not.toHaveBeenCalled();
  });
});