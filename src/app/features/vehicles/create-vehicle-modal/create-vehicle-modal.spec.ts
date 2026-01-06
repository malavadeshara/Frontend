import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateVehicleModalComponent } from './create-vehicle-modal';
import { VehicleService } from '../../../core/services/vehicle.service';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CreateVehicleModalComponent', () => {
  let component: CreateVehicleModalComponent;
  let fixture: ComponentFixture<CreateVehicleModalComponent>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;

  beforeEach(async () => {
    // Spy for VehicleService
    vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['create']);

    // Mock Bootstrap Modal and Toast for the tests
    (window as any).bootstrap = {
      Modal: {
        getInstance: jasmine.createSpy('getInstance').and.returnValue({
          hide: jasmine.createSpy('hide')
        })
      },
      Toast: jasmine.createSpy('Toast').and.callFake(function () {
        return {
          show: jasmine.createSpy('show'),
          _element: document.createElement('div')
        };
      })
    };

    // Configure TestBed for standalone component
    await TestBed.configureTestingModule({
      imports: [CreateVehicleModalComponent, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    }).compileComponents();

    // Create component fixture
    fixture = TestBed.createComponent(CreateVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.vehicleForm).toBeTruthy();
    expect(component.vehicleForm.value.currency).toBe('INR');
    expect(component.vehicleForm.value.inStock).toBeTrue();
  });

  it('should add a feature', () => {
    component.newFeature = 'Sunroof';
    component.addFeature();

    expect(component.features.length).toBe(1);
    expect(component.features[0]).toBe('Sunroof');
    expect(component.newFeature).toBe('');
  });

  it('should not add duplicate feature', () => {
    component.features = ['ABS'];
    component.newFeature = 'ABS';
    component.addFeature();

    expect(component.features.length).toBe(1);
  });

  it('should remove feature', () => {
    component.features = ['ABS', 'Airbags'];
    component.removeFeature(0);

    expect(component.features).toEqual(['Airbags']);
  });

  it('should add selected images and previews', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
        value: 'fake'
      }
    };

    // FileReader mock
    spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function (this: FileReader) {
      this.onload!({} as ProgressEvent<FileReader>);
    });

    component.onImagesSelected(event);

    expect(component.selectedImages.length).toBe(1);
    expect(component.imagePreviews.length).toBe(1);
  });

  it('should remove image and preview', () => {
    component.selectedImages = [new File(['a'], 'a.png')];
    component.imagePreviews = ['data:image/png;base64,test'];

    component.removeImage(0);

    expect(component.selectedImages.length).toBe(0);
    expect(component.imagePreviews.length).toBe(0);
  });

  it('should submit vehicle successfully', () => {
    vehicleServiceSpy.create.and.returnValue(of({}));

    spyOn(component.vehicleCreated, 'emit');
    spyOn(component, 'showToast');

    // Patch all required fields
    component.vehicleForm.patchValue({
      name: 'Tesla',
      model: 'Model S',
      year: 2024,
      price: 5000000,
      currency: 'INR',
      inStock: true,
      shortDescription: 'Short desc',
      detailedDescription: 'Detailed desc',
      engine: 'Electric',
      power: '670hp',
      torque: '900Nm',
      fuelType: 'Electric',
      transmission: 'Automatic',
      mileage: '400km',
      topSpeed: '250km/h',
      acceleration: '3.5s',
      seating: '5',
      bodyType: 'Sedan',
      drivetrain: 'AWD',
      length: '4970',
      width: '1964',
      height: '1445',
      wheelbase: '2990',
      bootSpace: '500L'
    });

    component.features = ['ABS'];
    component.selectedImages = [new File(['a'], 'a.png')];

    component.submitVehicle();

    expect(vehicleServiceSpy.create).toHaveBeenCalled();
    expect(component.vehicleCreated.emit).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Vehicle created successfully');
    expect(component.showLoader).toBeFalse();
  });

  it('should handle submit error', () => {
    vehicleServiceSpy.create.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(component, 'showToast');

    component.vehicleForm.patchValue({
      name: 'BMW',
      model: 'X5',
      year: 2023,
      price: 6000000,
      currency: 'INR',
      inStock: true,
      shortDescription: 'Short desc',
      detailedDescription: 'Detailed desc',
      engine: 'Diesel',
      power: '400hp',
      torque: '700Nm',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      mileage: '300km',
      topSpeed: '220km/h',
      acceleration: '5s',
      seating: '5',
      bodyType: 'SUV',
      drivetrain: 'AWD',
      length: '4850',
      width: '1950',
      height: '1750',
      wheelbase: '2920',
      bootSpace: '600L'
    });

    component.features = ['ABS'];
    component.selectedImages = [new File(['a'], 'a.png')];

    component.submitVehicle();

    expect(vehicleServiceSpy.create).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Failed to create vehicle', true);
    expect(component.showLoader).toBeFalse();
  });

  it('should show loader during submit', () => {
    vehicleServiceSpy.create.and.returnValue(of({}));

    component.vehicleForm.patchValue({
      name: 'Audi',
      model: 'A6',
      year: 2022,
      price: 5500000,
      currency: 'INR',
      inStock: true,
      shortDescription: 'Short desc',
      detailedDescription: 'Detailed desc',
      engine: 'Petrol',
      power: '450hp',
      torque: '600Nm',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      mileage: '350km',
      topSpeed: '240km/h',
      acceleration: '4.5s',
      seating: '5',
      bodyType: 'Sedan',
      drivetrain: 'AWD',
      length: '4920',
      width: '1880',
      height: '1450',
      wheelbase: '2950',
      bootSpace: '480L'
    });

    component.features = ['ABS'];
    component.selectedImages = [new File(['a'], 'a.png')];

    component.submitVehicle();

    expect(component.showLoader).toBeFalse();
  });
});