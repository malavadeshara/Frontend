import { Component, OnInit } from '@angular/core';
import { AdminBookingWithVehicle } from '../../../core/utils/AdminBookingWithVehicle ';
import { BookingService } from '../../../core/services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-all-bookings',
  imports: [CommonModule],
  templateUrl: './get-all-bookings.html',
  styleUrl: './get-all-bookings.css',
  standalone: true
})
export class GetAllBookings implements OnInit {

  bookings: AdminBookingWithVehicle[] = [];
  loading = false;
  actionLoadingId: string | null = null;
  activeTab = 1; // Pending

  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';

  readonly SLOT_TIMINGS: Record<number, string> = {
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

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;

    this.bookingService.getAllBookingsWithVehicles().subscribe({
      next: (data) => {
        this.bookings = data;
        // console.log(data);
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load bookings', 'danger');
        this.loading = false;
      }
    });
  }

  getBookingsByStatus(status: number): AdminBookingWithVehicle[] {
    return this.bookings.filter(b => b.booking.status === status);
  }

  getSlotTime(index: number): string {
    return this.SLOT_TIMINGS[index] ?? 'Unknown';
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Confirmed';
      case 3: return 'Rejected';
      // case 4: return 'Auto Rejected';
      // case 5: return 'Resolved';
      default: return "";
    }
  }

  confirmBooking(id: string): void {
    this.actionLoadingId = id;

    this.bookingService.confirm(id).subscribe({
      next: () => {
        this.showToast('Booking confirmed successfully', 'success');
        this.updateStatus(id, 2);
      },
      error: () => {
        this.showToast('Failed to confirm booking', 'danger');
        this.actionLoadingId = null;
      }
    });
  }

  rejectBooking(id: string): void {
    this.actionLoadingId = id;

    this.bookingService.reject(id).subscribe({
      next: () => {
        this.showToast('Booking rejected successfully', 'success');
        this.updateStatus(id, 3);
      },
      error: () => {
        this.showToast('Failed to reject booking', 'danger');
        this.actionLoadingId = null;
      }
    });
  }

  private updateStatus(id: string, status: number): void {
    const item = this.bookings.find(b => b.booking.id === id);
    if (item) {
      item.booking.status = status;
    }
    this.actionLoadingId = null;
  }

  getStatusBadgeClass(status: number): string {
  switch (status) {
    case 1: return 'bg-warning text-dark'; // Pending
    case 2: return 'bg-success';           // Confirmed
    case 3: return 'bg-danger';            // Rejected
    default: return 'bg-secondary';
  }
}

  showToast(message: string, type: 'success' | 'danger'): void {
    this.toastMessage = message;
    this.toastType = type;

    const toastEl = document.getElementById('adminToast');
    if (!toastEl) return;

    const toast = new (window as any).bootstrap.Toast(toastEl, {
      delay: 3000
    });
    toast.show();
  }
}