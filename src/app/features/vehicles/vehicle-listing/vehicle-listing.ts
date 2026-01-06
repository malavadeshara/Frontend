import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from './vehicle.models';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleCardComponent } from "../../../shared/components/vehicle-card/vehicle-card";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderComponent } from "../../../shared/components/loader/loader";
import { CreateVehicleModalComponent } from "../create-vehicle-modal/create-vehicle-modal";

declare var bootstrap: any;

@Component({
  selector: 'app-vehicle-listing',
  templateUrl: './vehicle-listing.html',
  styleUrls: ['./vehicle-listing.css'],
  imports: [VehicleCardComponent, CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent, CreateVehicleModalComponent],
  standalone: true
})
export class VehicleListingComponent implements OnInit {

  vehicles: Vehicle[] = [];
  totalCount = 0;

  pageNumber = 1;
  pageSize = 6;

  /** FILTERS */
  filters = {
    inStock: null as boolean | null,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    sort: ''
  };

  role!: 'Admin' | 'Customer';

  /** UI STATE */
  showLoader = false;

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole() as any;
    this.setPageSize();
    window.addEventListener('resize', () => this.setPageSize());
    this.loadVehicles();
  }

  setPageSize(): void {
    const w = window.innerWidth;
    this.pageSize = w >= 992 ? 6 : w >= 576 ? 4 : 3;
    this.pageNumber = 1;

    console.log('Page Size set to:', this.pageSize);
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getFiltered(
      this.filters,
      this.pageNumber,
      this.pageSize
    ).subscribe(res => {
      this.vehicles = this.sortVehicles(res.items);
      this.totalCount = res.totalCount;
    });
  }

  applyFilters(): void {
  // Validate min and max price
  if (this.filters.minPrice != null && this.filters.maxPrice != null) {
    if (this.filters.maxPrice < this.filters.minPrice) {
      this.showToast('Max Price cannot be less than Min Price', true);
      return; // Stop further execution, do not call API
    }
  }

  this.pageNumber = 1;
  this.loadVehicles();
}


  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadVehicles();
  }

  sortVehicles(list: Vehicle[]): Vehicle[] {
    if (this.filters.sort === 'low') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (this.filters.sort === 'high') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }

  deleteVehicle(id: number): void {
    this.vehicleService.delete(id).subscribe({
      next: () => this.loadVehicles(),
      error: () => this.showToast('Failed to delete vehicle', true)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  showToast(message: string, isError = false): void {
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white ${isError ? 'bg-danger' : 'bg-success'} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  // Add fixed positioning for bottom-right
  toastEl.style.position = 'fixed';
  toastEl.style.bottom = '1rem';
  toastEl.style.right = '1rem';
  toastEl.style.zIndex = '9999'; // ensure it appears above other content

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  document.body.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

}