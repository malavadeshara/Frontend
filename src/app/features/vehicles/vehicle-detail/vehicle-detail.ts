import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleDetail } from './vehicle-detail.model';
import { BookingModalComponent } from "../booking-modal/booking-modal";

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, BookingModalComponent],
  templateUrl: './vehicle-detail.html',
  styleUrls: ['./vehicle-detail.css']
})
export class VehicleDetailComponent implements OnInit {
  vehicleId!: number;  // <-- store ID separately
  vehicle!: VehicleDetail;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/vehicles']);
      return;
    }
    this.vehicleId = id;
    this.fetchVehicle(id);
  }

  fetchVehicle(id: number): void {
    this.vehicleService.getById(id).subscribe({
      next: (res) => {
        this.vehicle = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/vehicles']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }
}