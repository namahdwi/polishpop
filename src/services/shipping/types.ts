export interface ShippingService {
  calculateRates(params: {
    origin: string;
    destination: string;
    weight: number;
    courier?: string;
  }): Promise<ShippingRate[]>;
}

export interface ShippingRate {
  service: string;
  description: string;
  price: number;
  estimatedDays: number;
  reliability: number;
  coverage: number;
  courier: string;
}

export interface CourierService {
  id: string;
  name: string;
  code: string;
  services: string[];
  calculateRates(params: ShippingParams): Promise<ShippingRate[]>;
}

export interface ShippingParams {
  origin: GeoLocation;
  destination: GeoLocation;
  weight: number;
  value?: number;
  courier?: string;
  isLocalDelivery?: boolean;
}

export interface GeoLocation {
  city: string;
  isKediriArea: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  postalCode?: string;
}

export interface CustomerPreference {
  preferredCourier?: string;
  maxPrice?: number;
  maxDeliveryDays?: number;
  priorityFactor: 'price' | 'speed' | 'reliability';
}

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shippingMethod?: string;
  shipping?: ShippingRate | null;
} 