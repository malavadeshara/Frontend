import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateVehicleModalComponent } from './update-vehicle-modal';
import { VehicleService } from '../../../core/services/vehicle.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UpdateVehicleModalComponent', () => {
  let component: UpdateVehicleModalComponent;
  let fixture: ComponentFixture<UpdateVehicleModalComponent>;
  let vehicleServiceMock: any;

  const mockVehicle = {
    id: 1,
    name: 'Test Car',
    model: 'X123',
    year: 2022,
    price: 10000,
    currency: 'USD',
    inStock: true,
    images: ['img1.jpg', 'img2.jpg'],
    shortDescription: 'Short desc',
    detailedDescription: 'Detailed desc',
    specifications: {
      engine: 'V8', power: '400HP', torque: '500Nm',
      fuelType: 'Petrol', transmission: 'Manual', mileage: '15km/l',
      topSpeed: '250km/h', acceleration: '5s', bodyType: 'Sedan',
      drivetrain: 'AWD', seating: 5
    },
    dimensions: {
      length: '4m', width: '1.8m', height: '1.5m', wheelbase: '2.5m', bootSpace: '400L'
    },
    features: ['AC', 'Sunroof']
  };

  beforeAll(() => {
    (window as any).bootstrap = {
      Modal: {
        getInstance: jasmine.createSpy('getInstance').and.returnValue({
          hide: jasmine.createSpy('hide')
        })
      },
      Toast: function (el: any, options: any) {
        return {
          show: jasmine.createSpy('show'),
          dispose: jasmine.createSpy('dispose')
        };
      }
    };

    (window as any).bootstrap.Toast.getInstance = jasmine.createSpy('getInstance').and.returnValue(null);
  });

  beforeEach(async () => {
    vehicleServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of(mockVehicle)),
      update: jasmine.createSpy('update').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, UpdateVehicleModalComponent],
      providers: [{ provide: VehicleService, useValue: vehicleServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVehicleModalComponent);
    component = fixture.componentInstance;
    component.vehicleId = 1;


    component.editVehicle = structuredClone(mockVehicle);

    fixture.detectChanges();
  });


  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicle on vehicleId change', fakeAsync(() => {
    component.ngOnChanges({
      vehicleId: {
        currentValue: 1,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    tick();
    expect(vehicleServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.editVehicle.name).toBe('Test Car');
  }));

  it('should add a feature', () => {
    component.featureInput = 'Leather Seats';
    component.addFeature();
    expect(component.editVehicle.features).toContain('Leather Seats');
    expect(component.featureInput).toBe('');
  });

  it('should remove a feature', () => {
    component.removeFeature('AC');
    expect(component.editVehicle.features).not.toContain('AC');
  });

  it('should remove an existing image', () => {
    component.removeImage('img1.jpg');
    expect(component.removedImages).toContain('img1.jpg');
    expect(component.editVehicle.images).not.toContain('img1.jpg');
  });

  it('should remove a new image preview', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.newImages = [file];
    component.newImagePreviews = [{ file, url: 'blob:test' }];
    component.removeNewImage(file);
    expect(component.newImages.length).toBe(0);
    expect(component.newImagePreviews.length).toBe(0);
  });

  it('should call updateVehicle and emit updated event on success', fakeAsync(() => {
    spyOn(component.updated, 'emit');
    component.updateVehicle();
    tick();
    expect(vehicleServiceMock.update).toHaveBeenCalled();
    expect(component.updated.emit).toHaveBeenCalled();
  }));

  it('should handle error on loadVehicle failure', fakeAsync(() => {
    vehicleServiceMock.getById.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');
    component.loadVehicle();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Failed to load vehicle details.');
  }));

  it('should handle error on updateVehicle failure', fakeAsync(() => {
    vehicleServiceMock.update.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');
    component.updateVehicle();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Failed to update vehicle.');
  }));
});