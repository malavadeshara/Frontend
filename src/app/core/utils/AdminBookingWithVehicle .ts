import { Booking } from "./booking.model";
import { Vehicle } from "./vehicle.model";

// export interface AdminBookingWithVehicle {
//   booking: AdminBooking;
//   vehicle: {
//     id: number;
//     name: string;
//     model: string;
//     year: number;
//     price: number;
//     currency: string;
//   };
// }

export interface AdminBookingWithVehicle {
  booking: Booking;
  vehicle: Vehicle;
}

// export interface Vehicle {
//   id: number;
//   name: string;
//   model: string;
//   year: number;
//   price: number;
//   currency: string;
// }