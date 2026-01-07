import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult, Vehicle } from '../../features/vehicles/vehicle-listing/vehicle.models';
import { VehicleDetail } from '../../features/vehicles/vehicle-detail/vehicle-detail.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private readonly baseUrl = 'https://vehicle-inventory-api.onrender.com/api/vehicles';
  // private readonly baseUrl = 'http://localhost/api/api/vehicles';

  constructor(private http: HttpClient) { }

  // VEHICLE DETAIL
  getById(id: number): Observable<VehicleDetail> {
    return this.http.get<VehicleDetail>(`${this.baseUrl}/${id}`);
  }

  update(id: number, data: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }


  getPaged(pageNumber: number, pageSize: number): Observable<PagedResult<Vehicle>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PagedResult<Vehicle>>(this.baseUrl, { params });
  }

  getFiltered(
    filters: any,
    pageNumber: number,
    pageSize: number
  ): Observable<PagedResult<Vehicle>> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (filters.inStock !== null) {
      params = params.set('inStock', filters.inStock);
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    return this.http.get<PagedResult<Vehicle>>(
      `${this.baseUrl}/filter`,
      { params }
    );
  }

  create(data: FormData) {
    return this.http.post(this.baseUrl, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getSlots(vehicleId: number, date: string) {
    // console.log("inside getSlots");
    // console.log(`https://localhost:7251/api/vehicles/${vehicleId}/slots?date=${date}`);

    return this.http.get<any[]>(`https://vehicle-inventory-api.onrender.com/vehicles/${vehicleId}/slots`, { params: { date } });
  }

  // Add createBooking method
createBooking(payload: { vehicleId: number, bookingDate: string, slotIndex: number }) {
  return this.http.post<any>(
    `https://vehicle-inventory-api.onrender.com/api`, // your controller endpoint
    payload
  );
}


}