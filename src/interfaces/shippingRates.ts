import { ShippingError } from './shippingError';

export interface ShippingRatesRequest {
  destination: ShippingDestination;
  packages: ShippingPackage[];
  currency?: string;
}

export interface ShippingRatesResponse {
  rates: ShippingRate[];
  success: boolean;
  errors: ShippingError[];
}

export interface ShippingDestination {
  street: string;
  city: string;
  post_code: string;
  country_code: string;
  suburb?: string;
  state?: string;
}

export interface ShippingPackage {
  weight: number;
  height?: number;
  width?: number;
  length?: number;
}

export interface ShippingRate {
  service_name: string;
  service_code: string;
  total_price: number;
}
