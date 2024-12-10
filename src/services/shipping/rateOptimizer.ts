import { ShippingRate, CourierService, ShippingParams, CustomerPreference, GeoLocation } from './types';
import { SUPPORTED_COURIERS } from './indonesianShipping';
import { captureError } from '../../utils/errorTracking';

export class ShippingRateOptimizer {
  private static instance: ShippingRateOptimizer;

  static getInstance(): ShippingRateOptimizer {
    if (!this.instance) {
      this.instance = new ShippingRateOptimizer();
    }
    return this.instance;
  }

  async optimizeRates(params: {
    origin: GeoLocation;
    destination: GeoLocation;
    weight: number;
    value: number;
    customerPreferences: CustomerPreference;
  }): Promise<ShippingRate[]> {
    try {
      const rates = await this.getAllAvailableRates(params);
      const optimizedRates = this.applyOptimizationRules(rates, params);
      return this.sortAndFilterRates(optimizedRates, params.customerPreferences);
    } catch (error) {
      captureError(error as Error, { context: 'Shipping Rate Optimization' });
      throw error;
    }
  }

  private async getAllAvailableRates(params: ShippingParams): Promise<ShippingRate[]> {
    const courierServices = this.getAvailableCourierServices(params.destination);
    const ratePromises = courierServices.map(service => 
      service.calculateRates({
        ...params,
        courier: service.code
      })
    );

    const rates = await Promise.all(ratePromises);
    return rates.flat();
  }

  private getAvailableCourierServices(destination: GeoLocation): CourierService[] {
    return SUPPORTED_COURIERS.filter(courier => 
      this.isCourierAvailable(courier, destination)
    );
  }

  private isCourierAvailable(courier: CourierService, destination: GeoLocation): boolean {
    // Local delivery services (GoSend, Grab) only available within Kediri
    if (['gosend', 'grab'].includes(courier.code)) {
      return destination.city.toLowerCase() === 'kediri';
    }

    // National couriers (JNE, SiCepat) available everywhere except local Kediri deliveries
    if (['jne', 'sicepat'].includes(courier.code)) {
      return destination.city.toLowerCase() !== 'kediri';
    }

    return false;
  }

  private applyOptimizationRules(rates: ShippingRate[], params: ShippingParams): ShippingRate[] {
    return rates.map(rate => ({
      ...rate,
      score: this.calculateRateScore(rate, params)
    }));
  }

  private calculateRateScore(rate: ShippingRate, params: ShippingParams): number {
    const weightFactors = {
      price: 0.4,
      speed: 0.3,
      reliability: 0.2,
      coverage: 0.1
    };

    // Normalize values to a 0-1 scale
    const normalizedPrice = rate.price / params.value; // Price relative to item value
    const normalizedSpeed = rate.estimatedDays / 7; // Assuming max 7 days delivery
    
    // Calculate weighted score (lower is better)
    const score = (
      (normalizedPrice * weightFactors.price) +
      (normalizedSpeed * weightFactors.speed) +
      ((1 - rate.reliability) * weightFactors.reliability) +
      ((1 - rate.coverage) * weightFactors.coverage)
    );

    // Convert to a positive score where higher is better
    return 1 - (score / (weightFactors.price + weightFactors.speed + 
                 weightFactors.reliability + weightFactors.coverage));
  }

  private sortAndFilterRates(rates: ShippingRate[], preferences: CustomerPreference): ShippingRate[] {
    return rates
      .filter(rate => this.meetsPreferences(rate, preferences))
      .sort((a, b) => {
        if (preferences.priorityFactor === 'price') return a.price - b.price;
        if (preferences.priorityFactor === 'speed') return a.estimatedDays - b.estimatedDays;
        return b.reliability - a.reliability;
      });
  }

  private meetsPreferences(rate: ShippingRate, preferences: CustomerPreference): boolean {
    if (preferences.maxPrice && rate.price > preferences.maxPrice) return false;
    if (preferences.maxDeliveryDays && rate.estimatedDays > preferences.maxDeliveryDays) return false;
    if (preferences.preferredCourier && rate.courier !== preferences.preferredCourier) return false;
    return true;
  }
} 