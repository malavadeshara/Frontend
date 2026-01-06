// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { VehicleService } from '../../../core/services/vehicle.service';
// import { SLOT_TIMINGS } from '../../../core/utils/slot-timing.util';

// interface SlotResponse {
//   slotIndex: number;
//   isAvailable: boolean;
// }

// @Component({
//   selector: 'app-booking-modal',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './booking-modal.html'
// })
// export class BookingModalComponent {
//   @Input() vehicleId!: number;

//   selectedDate = '';              // yyyy-MM-dd
//   slots: SlotResponse[] = [];
//   selectedSlot?: number;
//   loadingSlots = false;

//   slotTimings = SLOT_TIMINGS;

//   constructor(private vehicleService: VehicleService) {}

//   /** Disable Sundays + past dates */
//   isDateDisabled(date: string): boolean {
//     const selected = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     return selected < today || selected.getDay() === 0;
//   }

//   onDateChange(): void {
//     if (!this.selectedDate) return;

//     if (this.isDateDisabled(this.selectedDate)) {
//       this.selectedDate = '';
//       this.slots = [];
//       return;
//     }

//     this.fetchSlots();
//   }

//   fetchSlots(): void {
//     if (!this.vehicleId || !this.selectedDate) return;

//     this.loadingSlots = true;

//     // selectedDate is already yyyy-MM-dd (DO NOT convert)
//     this.vehicleService
//       .getSlots(this.vehicleId, this.selectedDate)
//       .subscribe({
//         next: (res) => {
//           this.slots = res;
//           this.loadingSlots = false;
//         },
//         error: () => {
//           this.slots = [];
//           this.loadingSlots = false;
//         }
//       });
//   }

//   selectSlot(index: number): void {
//     this.selectedSlot = index;
//   }

//   closeModal(): void {
//     (document.getElementById('bookingModal') as any)?.classList.remove('show');
//   }
// }


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { SLOT_TIMINGS } from '../../../core/utils/slot-timing.util';

interface SlotResponse {
  slotIndex: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.html'
})
export class BookingModalComponent {
  @Input() vehicleId!: number;

  selectedDate = '';              // yyyy-MM-dd
  slots: SlotResponse[] = [];
  selectedSlot?: number;
  loadingSlots = false;
  bookingInProgress = false;

  slotTimings = SLOT_TIMINGS;

  constructor(private vehicleService: VehicleService) {}

  /** Disable Sundays + past dates */
  isDateDisabled(date: string): boolean {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected < today || selected.getDay() === 0;
  }

  onDateChange(): void {
    if (!this.selectedDate) return;

    if (this.isDateDisabled(this.selectedDate)) {
      this.selectedDate = '';
      this.slots = [];
      return;
    }

    this.fetchSlots();
  }

  fetchSlots(): void {
    if (!this.vehicleId || !this.selectedDate) return;

    this.loadingSlots = true;

    this.vehicleService
      .getSlots(this.vehicleId, this.selectedDate)
      .subscribe({
        next: (res) => {
          this.slots = res;
          this.loadingSlots = false;
        },
        error: () => {
          this.slots = [];
          this.loadingSlots = false;
        }
      });
  }

  selectSlot(index: number): void {
    this.selectedSlot = index;
  }

  /** Confirm booking */
  confirmBooking(): void {
    if (!this.selectedSlot && this.selectedSlot !== 0) return;
    if (!this.selectedDate) return;

    this.bookingInProgress = true;

    const payload = {
      vehicleId: this.vehicleId,
      bookingDate: this.selectedDate,
      slotIndex: this.selectedSlot
    };

    this.vehicleService.createBooking(payload).subscribe({
      next: (res) => {
        this.bookingInProgress = false;
        this.closeModal();
        this.showToast(res.message || 'Booking successful!');
      },
      error: () => {
        this.bookingInProgress = false;
        this.showToast('Booking failed. Please try again.');
      }
    });
  }

  closeModal(): void {
    const modalEl = document.getElementById('bookingModal') as any;
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
  }

  /** Simple toast */
  showToast(message: string) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-primary border-0';
    toastEl.style.position = 'fixed';
    toastEl.style.bottom = '20px';
    toastEl.style.right = '20px';
    toastEl.style.zIndex = '9999';
    toastEl.role = 'alert';
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    document.body.appendChild(toastEl);
    const toast = new (window as any).bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
}