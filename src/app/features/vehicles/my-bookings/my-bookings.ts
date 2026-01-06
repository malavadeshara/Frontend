import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { BookingService } from './../../../core/services/booking.service';
import { BookingWithVehicle } from './../../../core/utils/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css'],
})
export class MyBookingsComponent implements OnInit {
  bookingsWithVehicles: BookingWithVehicle[] = [];
  loading = false;
  error = '';

  // Slot timing map (single source of truth)
  private readonly SLOT_TIMINGS: Record<number, string> = {
    0: '10:00 AM - 11:00 AM',
    1: '11:00 AM - 12:00 PM',
    2: '12:00 PM - 01:00 PM',
    3: '01:00 PM - 02:00 PM',
    4: '02:00 PM - 03:00 PM',
    5: '03:00 PM - 04:00 PM',
    6: '04:00 PM - 05:00 PM',
    7: '05:00 PM - 06:00 PM',
    8: '06:00 PM - 07:00 PM',
  };

  constructor(
    private bookingService: BookingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';

    this.bookingService.getBookingsWithVehicles().subscribe({
      next: (data) => {
        this.bookingsWithVehicles = data;
        console.log('Loaded bookings with vehicles:', data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.error = 'Failed to load bookings. Please try again later.';
        this.loading = false;
      },
    });
  }

  getSlotTime(slotIndex: number): string {
    return this.SLOT_TIMINGS[slotIndex] ?? 'Unknown';
  }

  getStatusBadge(
    status: number
  ): { text: string; color: string } {
    switch (status) {
      case 1:
        return { text: 'Pending', color: 'warning' };
      case 2:
        return { text: 'Confirmed', color: 'success' };
      case 3:
        return { text: 'Rejected', color: 'danger' };
      case 4:
        return { text: 'Auto Rejected', color: 'danger' };
      case 5:
        return { text: 'Resolved', color: 'info' };
      default:
        return { text: 'Unknown', color: 'secondary' };
    }
  }

  goBack(): void {
    this.location.back();
  }
}