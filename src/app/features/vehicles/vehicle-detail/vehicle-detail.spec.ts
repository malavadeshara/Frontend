import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDetailComponent } from './vehicle-detail';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VehicleDetail } from './vehicle-detail.model';

describe('VehicleDetailComponent', () => {
  let component: VehicleDetailComponent;
  let fixture: ComponentFixture<VehicleDetailComponent>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVehicle: VehicleDetail = {
    name: 'Tesla',
    model: 'Model S',
    year: 2024,
    images: ['img1.jpg', 'img2.jpg'],
    price: 7500000,
    currency: 'INR',
    ageInShowroom: '2 months',
    inStock: true,
    shortDescription: 'Premium electric sedan',
    specifications: {
      engine: 'Electric',
      power: '670 hp',
      torque: '850 Nm',
      fuelType: 'Electric',
      transmission: 'Automatic',
      mileage: '600 km',
      topSpeed: '250 km/h',
      acceleration: '3.2s',
      seating: 5,
      bodyType: 'Sedan',
      drivetrain: 'AWD'
    },
    dimensions: {
      length: '4970 mm',
      width: '1964 mm',
      height: '1445 mm',
      wheelbase: '2960 mm',
      bootSpace: '793 L'
    },
    features: ['Autopilot', 'Panoramic Roof', 'Touchscreen Display'],
    detailedDescription: 'High-performance electric luxury sedan.'
  };

  beforeEach(async () => {
    vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getById']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [VehicleDetailComponent],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch vehicle details on init', () => {
    vehicleServiceSpy.getById.and.returnValue(of(mockVehicle));

    component.ngOnInit();
    fixture.detectChanges();

    expect(vehicleServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.vehicle).toEqual(mockVehicle);
    expect(component.loading).toBeFalse();
  });

  it('should redirect to /vehicles if id is invalid', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/vehicles']);
  });

  it('should redirect to /vehicles on API error', () => {
    vehicleServiceSpy.getById.and.returnValue(throwError(() => new Error('API Error')));

    component.fetchVehicle(1);

    expect(component.loading).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/vehicles']);
  });

  it('should navigate back to vehicle listing', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/vehicles']);
  });
});