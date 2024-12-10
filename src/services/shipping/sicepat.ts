import axios from 'axios';
import { ShippingService, ShippingRate } from './types';
import { captureError } from '../../utils/errorTracking';

export class SiCepatService implements ShippingService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SICEPAT_API_KEY;
    this.baseUrl = 'https://api.sicepat.com/v1';
  }

  async calculateRates(params: {
    origin: string;
    destination: string;
    weight: number;
  }): Promise<ShippingRate[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/rates/calculate`,
        {
          origin_code: params.origin,
          destination_code: params.destination,
          weight: params.weight
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.rates.map((rate: any) => ({
        service: rate.service,
        description: rate.description,
        price: rate.cost,
        estimatedDays: rate.etd,
        reliability: 0.9,
        coverage: 0.8,
        courier: 'sicepat'
      }));
    } catch (error) {
      captureError(error as Error, { context: 'SiCepat Rate Calculation' });
      throw error;
    }
  }

  async createShipment(params: {
    orderId: string;
    service: string;
    origin: string;
    destination: string;
    weight: number;
    items: any[];
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/shipment/create`,
        {
          reference_number: params.orderId,
          service_type: params.service,
          origin_address: params.origin,
          destination_address: params.destination,
          parcel_weight: params.weight,
          parcel_content: params.items.map(item => item.name).join(', '),
          parcel_category: 'Fashion & Accessories',
          insurance_value: params.items.reduce((total, item) => total + item.price, 0),
          cod_value: 0, // We don't support COD for now
          pickup_time: new Date().toISOString(),
          pickup_service: false // Customer will drop off at SiCepat counter
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status.code !== 200) {
        throw new Error(response.data.status.description);
      }

      return {
        trackingNumber: response.data.waybill_number,
        estimatedDelivery: response.data.estimated_delivery,
        price: response.data.shipping_cost,
        status: 'created'
      };

    } catch (error) {
      captureError(error as Error, {
        context: 'SiCepat Shipment Creation',
        orderId: params.orderId,
        service: params.service
      });
      throw error;
    }
  }
} 