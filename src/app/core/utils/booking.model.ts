import { Vehicle } from "./vehicle.model";

export interface Booking {
  id: string;
  vehicleId: number;
  bookingDate: string;
  slotIndex: number;
  status: number;
}

export interface BookingWithVehicle {
  booking: Booking;
  vehicle: Vehicle;
}