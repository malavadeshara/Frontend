export interface Vehicle {
  name: string;
  model: string;
  year: number;
  images: string[];
  price: number;
  currency: string;
  ageInShowroom: string;
  inStock: boolean;
  shortDescription: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}