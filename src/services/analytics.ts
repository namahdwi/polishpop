import ReactGA from 'react-ga4';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';
import { Analytics } from 'firebase/analytics';

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {
    // Initialize GA4
    ReactGA.initialize('G-1CSTE40K68');
  }

  static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }

  private logAnalyticsEvent(analytics: Analytics | null, eventName: string, params?: any) {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  }

  trackPageView(path: string): void {
    ReactGA.send({ hitType: "pageview", page: path });
    this.logAnalyticsEvent(analytics, 'page_view', {
      page_path: path
    });
  }

  trackProductView(product: {
    id: string;
    name: string;
    price: number;
    category: string;
  }): void {
    ReactGA.event({
      category: 'Product',
      action: 'View',
      label: product.name
    });

    this.logAnalyticsEvent(analytics, 'view_item', {
      currency: 'IDR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price
      }]
    });
  }

  trackAddToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }): void {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'Add to Cart',
      label: product.name
    });

    this.logAnalyticsEvent(analytics, 'add_to_cart', {
      currency: 'IDR',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        quantity: product.quantity,
        price: product.price
      }]
    });
  }

  trackPurchase(order: {
    id: string;
    total: number;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }): void {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'Purchase',
      value: order.total
    });

    this.logAnalyticsEvent(analytics, 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'IDR',
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }

  trackSearch(searchTerm: string): void {
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: searchTerm
    });

    this.logAnalyticsEvent(analytics, 'search', {
      search_term: searchTerm
    });
  }

  trackPromoView(promo: {
    id: string;
    name: string;
    creative: string;
  }): void {
    this.logAnalyticsEvent(analytics, 'view_promotion', {
      promotion_id: promo.id,
      promotion_name: promo.name,
      creative_name: promo.creative
    });
  }

  track(eventName: string, properties?: Record<string, any>): void {
    console.log('Event:', eventName, properties);
  }
} 