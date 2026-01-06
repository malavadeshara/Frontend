import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpdateVehicleModalComponent } from '../../../features/vehicles/update-vehicle-modal/update-vehicle-modal';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.html',
  styleUrls: ['./vehicle-card.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UpdateVehicleModalComponent]
})
export class VehicleCardComponent {
  @Input() vehicle!: any;
  @Input() role!: 'Admin' | 'Customer';
  @Output() delete = new EventEmitter<number>();
  @Output() updated = new EventEmitter<void>();

  constructor(private router: Router) { }

  viewDetails(): void {
    this.router.navigate(['/vehicles', this.vehicle.id]);
  }

  onDelete(): void {
    if (confirm(`Delete ${this.vehicle.name}?`)) {
      this.delete.emit(this.vehicle.id);
    }
  }
}