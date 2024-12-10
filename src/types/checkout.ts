export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  codAgreed: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: number;
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
} 