import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from './../utils/booking.model';
import { Vehicle } from './../utils/vehicle.model';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BookingWithVehicle } from '../utils/booking.model';
import { AdminBookingWithVehicle } from '../utils/AdminBookingWithVehicle ';


@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) { }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>('https://vehicle-inventory-api.onrender.com/api/my');
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`https://vehicle-inventory-api.onrender.com/api/vehicles/${id}`);
  }

  getBookingsWithVehicles(): Observable<BookingWithVehicle[]> {
    return this.getMyBookings().pipe(
      switchMap((bookings) => {
        const observables = bookings.map((b) =>
          this.getVehicleById(b.vehicleId).pipe(
            map((vehicle) => ({ booking: b, vehicle }))
          )
        );

        console.log('Fetching vehicles for bookings:', bookings);
        return forkJoin(observables); // waits for all vehicle calls
      })
    );
  }

  getAllBookingsWithVehicles(): Observable<AdminBookingWithVehicle[]> {
    return this.getAllBookings().pipe(
      switchMap((bookings) => {
        if (!bookings.length) {
          return of([]);
        }

        const requests = bookings.map(b =>
          this.getVehicleById(b.vehicleId).pipe(
            map(vehicle => ({
              booking: b,
              vehicle
            }))
          )
        );

        return forkJoin(requests);
      })
    );
  }


  getAllBookings() {
    return this.http.get<any[]>('https://vehicle-inventory-api.onrender.com/api/admin/get-all-bookings');
  }

  confirm(id: string) {
    return this.http.post(`https://vehicle-inventory-api.onrender.com/api/${id}/confirm`, {});
  }

  reject(id: string) {
    return this.http.post(`https://vehicle-inventory-api.onrender.com/api/${id}/reject`, {});
  }
}