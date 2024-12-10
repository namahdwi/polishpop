import axios from 'axios';
import { ShippingService, ShippingRate, CourierService, ShippingParams } from './types';
import { captureError } from '../../utils/errorTracking';

export const SUPPORTED_COURIERS: CourierService[] = [
  {
    id: 'jne',
    name: 'JNE',
    code: 'jne',
    services: ['REG', 'YES', 'OKE'],
    calculateRates: async (params: ShippingParams): Promise<ShippingRate[]> => {
      try {
        const response = await axios.post(
          'https://api.rajaongkir.com/starter/cost',
          {
            origin: params.origin.city,
            destination: params.destination.city,
            weight: params.weight,
            courier: 'jne'
          },
          {
            headers: { key: import.meta.env.VITE_RAJAONGKIR_KEY }
          }
        );

        return response.data.rajaongkir.results[0].costs.map((cost: any) => ({
          service: cost.service,
          description: cost.description,
          price: cost.cost[0].value,
          estimatedDays: parseInt(cost.cost[0].etd),
          reliability: 0.85,
          coverage: 0.9,
          courier: 'jne'
        }));
      } catch (error) {
        captureError(error as Error, { context: 'JNE Rate Calculation' });
        return [];
      }
    }
  },
  {
    id: 'gosend',
    name: 'GoSend',
    code: 'gosend',
    services: ['instant', 'sameday'],
    calculateRates: async (params: ShippingParams): Promise<ShippingRate[]> => {
      if (!params.origin.isKediriArea || !params.destination.isKediriArea) {
        return [];
      }

      return [
        {
          service: 'instant',
          description: 'Instant Delivery (1 hour)',
          price: 15000,
          estimatedDays: 0,
          reliability: 0.95,
          coverage: 1.0,
          courier: 'gosend'
        },
        {
          service: 'sameday',
          description: 'Same Day Delivery (6 hours)',
          price: 12000,
          estimatedDays: 0,
          reliability: 0.95,
          coverage: 1.0,
          courier: 'gosend'
        }
      ];
    }
  },
  {
    id: 'grab',
    name: 'GrabExpress',
    code: 'grab',
    services: ['instant', 'sameday'],
    calculateRates: async (params: ShippingParams): Promise<ShippingRate[]> => {
      if (!params.origin.isKediriArea || !params.destination.isKediriArea) {
        return [];
      }

      // Base rate calculation for Grab in Kediri
      const baseRate = 10000;
      const distanceRate = 2000; // per km
      const distance = calculateDistance(
        params.origin.latitude ?? 0,
        params.origin.longitude ?? 0,
        params.destination.latitude ?? 0,
        params.destination.longitude ?? 0
      );

      return [
        {
          service: 'instant',
          description: 'Instant Delivery (1 hour)',
          price: baseRate + (distanceRate * distance),
          estimatedDays: 0,
          reliability: 0.95,
          coverage: 1.0,
          courier: 'grab'
        },
        {
          service: 'sameday',
          description: 'Same Day Delivery (6 hours)',
          price: baseRate + (distanceRate * distance * 0.8), // 20% discount for sameday
          estimatedDays: 0,
          reliability: 0.95,
          coverage: 1.0,
          courier: 'grab'
        }
      ];
    }
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    code: 'sicepat',
    services: ['REG', 'BEST'],
    calculateRates: async (params: ShippingParams): Promise<ShippingRate[]> => {
      try {
        if (params.origin.isKediriArea && params.destination.isKediriArea) {
          return []; // Don't use SiCepat for local Kediri deliveries
        }

        const response = await axios.post(
          'https://api.sicepat.com/v1/rates/calculate',
          {
            origin_code: params.origin.postalCode,
            destination_code: params.destination.postalCode,
            weight: params.weight
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SICEPAT_API_KEY}`
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
        captureError(error as Error, { 
          context: 'SiCepat Rate Calculation',
          origin: params.origin.city,
          destination: params.destination.city
        });
        return [];
      }
    }
  }
] as const;

export class IndonesianShippingService implements ShippingService {
  private static instance: IndonesianShippingService;
  private rajaOngkirKey: string;

  private constructor() {
    this.rajaOngkirKey = import.meta.env.VITE_RAJAONGKIR_KEY;
  }

  static getInstance(): IndonesianShippingService {
    if (!this.instance) {
      this.instance = new IndonesianShippingService();
    }
    return this.instance;
  }

  async calculateRates(params: {
    origin: string;
    destination: string;
    weight: number;
    courier: string;
  }): Promise<ShippingRate[]> {
    try {
      const isLocalDelivery = this.isKediriLocalDelivery(params.origin, params.destination);

      // For local Kediri deliveries, only use instant delivery services
      if (isLocalDelivery) {
        if (!['gosend', 'grab'].includes(params.courier)) {
          return [];
        }
        return await this.calculateInstantDeliveryRates(params);
      }

      // For deliveries outside Kediri, only use traditional couriers
      if (!isLocalDelivery) {
        if (!['jne', 'sicepat'].includes(params.courier)) {
          return [];
        }
        return await this.calculateTraditionalCourierRates(params);
      }

      return [];
    } catch (error) {
      captureError(error as Error, { 
        context: 'Shipping Rate Calculation',
        origin: params.origin,
        destination: params.destination
      });
      throw error;
    }
  }

  private isKediriLocalDelivery(origin: string, destination: string): boolean {
    const kediriRegions = ['kediri', 'kota kediri', 'kabupaten kediri'];
    return kediriRegions.includes(origin.toLowerCase()) && 
           kediriRegions.includes(destination.toLowerCase());
  }

  private async calculateInstantDeliveryRates(params: any): Promise<ShippingRate[]> {
    // Kediri-specific instant delivery rates
    const baseRates = {
      'gosend': [
        { service: 'instant', price: 15000, time: '1 hour' },
        { service: 'sameday', price: 12000, time: '6 hours' }
      ],
      'grab': [
        { service: 'instant', price: 16000, time: '1 hour' },
        { service: 'sameday', price: 13000, time: '6 hours' }
      ]
    };

    const selectedRates = baseRates[params.courier as keyof typeof baseRates] || [];
    
    return selectedRates.map(rate => ({
      service: rate.service,
      description: `${rate.service} delivery - ${rate.time}`,
      price: rate.price,
      estimatedDays: 0,
      reliability: 0.95,
      coverage: 1.0,
      courier: params.courier
    }));
  }

  private async calculateTraditionalCourierRates(params: any): Promise<ShippingRate[]> {
    const response = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      {
        origin: params.origin,
        destination: params.destination,
        weight: params.weight,
        courier: params.courier
      },
      {
        headers: {
          key: this.rajaOngkirKey
        }
      }
    );
    return response.data.rajaongkir.results;
  }
} 

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}