import { ReactNode } from "react";

export interface Review {
  id: string;
  rating: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface NailDesign {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  styles: string[];
  lengths: string[];
  isPromotional?: boolean;
  promotionalPrice?: number;
}

export const CATEGORIES = [
  'Classic',
  'Artistic',
  'Minimalist',
  'Glamour',
  'Seasonal'
] as const;

export const STYLES = [
  'French',
  'Glitter',
  'Matte',
  'Metallic',
  'Floral',
  'Geometric',
  'Abstract'
] as const;

export const LENGTHS = [
  'Short',
  'Medium',
  'Long',
  'Extra Long'
] as const;

export interface PromotionState {
  remainingOffers: number;
  isActive: boolean;
}

export type NailSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ShippingDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  processingDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  trackingNumber?: string;
  shippingDetails: ShippingDetails;
}

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export interface CustomerQuery {
  customer: {
    phone: string;
    name: string;
  };
  message: string;
  orderId?: string;
  queryType?: string;
}

export interface Reward {
  id: string;
  title: string;
  name: string;
  description: string;
  requiredPoints: number;
  type: 'discount' | 'freeItem' | 'voucher';
  value: number;
  expiresAt?: string;
  icon?: ReactNode;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export * from './promotion';



