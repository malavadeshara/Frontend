export interface VehicleDetail {
  name: string;
  model: string;
  year: number;

  images: string[];

  price: number;
  currency: string;
  ageInShowroom: string;
  inStock: boolean;

  shortDescription: string;

  specifications: VehicleSpecifications;
  dimensions: VehicleDimensions;

  features: string[];

  detailedDescription: string;
}

export interface VehicleSpecifications {
  engine: string;
  power: string;
  torque: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  topSpeed: string;
  acceleration: string;
  seating: number;
  bodyType: string;
  drivetrain: string;
}

export interface VehicleDimensions {
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  bootSpace: string;
}