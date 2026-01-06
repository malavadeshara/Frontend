import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    provideHttpClientTesting,
    HttpTestingController
} from '@angular/common/http/testing';

import { VehicleService } from './vehicle.service';
import { PagedResult, Vehicle } from '../../features/vehicles/vehicle-listing/vehicle.models';
import { VehicleDetail } from '../../features/vehicles/vehicle-detail/vehicle-detail.model';

describe('VehicleService', () => {
    let service: VehicleService;
    let httpMock: HttpTestingController;

    const baseUrl = 'http://localhost/api/api/vehicles';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VehicleService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(VehicleService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // ensure no pending requests
    });

    /* ================= BASIC ================= */

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /* ================= GET BY ID ================= */

    it('should get vehicle by id', () => {
        const mockVehicle: VehicleDetail = {
            name: 'BMW X5',
            model: 'X5',
            year: 2023,
            images: ['img1.jpg', 'img2.jpg'],
            price: 80000,
            currency: 'USD',
            ageInShowroom: '2 months',
            inStock: true,
            shortDescription: 'Luxury SUV',

            specifications: {
                engine: '3.0L',
                power: '335 hp',
                torque: '450 Nm',
                fuelType: 'Petrol',
                transmission: 'Automatic',
                mileage: '12 km/l',
                topSpeed: '250 km/h',
                acceleration: '5.5s',
                seating: 5,
                bodyType: 'SUV',
                drivetrain: 'AWD'
            },

            dimensions: {
                length: '4922 mm',
                width: '2004 mm',
                height: '1745 mm',
                wheelbase: '2975 mm',
                bootSpace: '650 L'
            },

            features: ['ABS', 'Airbags', 'Sunroof'],
            detailedDescription: 'A premium luxury SUV with excellent performance.'
        };

        service.getById(1).subscribe(vehicle => {
            expect(vehicle).toEqual(mockVehicle);
        });

        const req = httpMock.expectOne(`${baseUrl}/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockVehicle);
    });


    /* ================= UPDATE ================= */

    it('should update vehicle', () => {
        const formData = new FormData();
        formData.append('name', 'Updated Vehicle');

        service.update(2, formData).subscribe();

        const req = httpMock.expectOne(`${baseUrl}/2`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(formData);
        req.flush(null);
    });

    /* ================= PAGED ================= */

    it('should get paged vehicles', () => {
        const mockResponse: PagedResult<Vehicle> = {
            items: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10
        };

        service.getPaged(1, 10).subscribe(result => {
            expect(result).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            r =>
                r.url === baseUrl &&
                r.params.get('pageNumber') === '1' &&
                r.params.get('pageSize') === '10'
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    /* ================= FILTERED ================= */

    it('should get filtered vehicles with all filters', () => {
        const filters = {
            inStock: true,
            minPrice: 1000,
            maxPrice: 5000
        };

        service.getFiltered(filters, 1, 10).subscribe();

        const req = httpMock.expectOne(
            r =>
                r.url === `${baseUrl}/filter` &&
                r.params.get('pageNumber') === '1' &&
                r.params.get('pageSize') === '10' &&
                r.params.get('inStock') === 'true' &&
                r.params.get('minPrice') === '1000' &&
                r.params.get('maxPrice') === '5000'
        );

        expect(req.request.method).toBe('GET');
        req.flush({ items: [], totalCount: 0 });
    });

    it('should get filtered vehicles without optional filters', () => {
        const filters = {
            inStock: null,
            minPrice: null,
            maxPrice: null
        };

        service.getFiltered(filters, 2, 5).subscribe();

        const req = httpMock.expectOne(
            r =>
                r.url === `${baseUrl}/filter` &&
                r.params.get('pageNumber') === '2' &&
                r.params.get('pageSize') === '5' &&
                !r.params.has('inStock') &&
                !r.params.has('minPrice') &&
                !r.params.has('maxPrice')
        );

        expect(req.request.method).toBe('GET');
        req.flush({ items: [], totalCount: 0 });
    });

    /* ================= CREATE ================= */

    it('should create vehicle', () => {
        const formData = new FormData();
        formData.append('brand', 'Audi');

        service.create(formData).subscribe();

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe(formData);
        req.flush(null);
    });

    /* ================= DELETE ================= */

    it('should delete vehicle by id', () => {
        service.delete(5).subscribe(response => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne(`${baseUrl}/5`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });


});