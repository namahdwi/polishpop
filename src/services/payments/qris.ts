import { generateQRCode } from '../../utils/qrcode';
import { captureError } from '../../utils/errorTracking';

export class QRISClient {
  private baseUrl: string;
  private merchantId: string;
  private merchantKey: string;

  constructor(config: { merchantId: string; merchantKey: string }) {
    this.merchantId = config.merchantId;
    this.merchantKey = config.merchantKey;
    this.baseUrl = 'https://api.dana.id'; // Replace with actual DANA API endpoint
  }

  async createPayment(params: {
    external_id: string;
    amount: number;
    customer: { name: string }
  }) {
    // Implement API call to DANA
    const response = await fetch(`${this.baseUrl}/qris/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-ID': this.merchantId,
        'X-Merchant-Key': this.merchantKey,
      },
      body: JSON.stringify(params)
    });
    
    return response.json();
  }

  async getPaymentStatus(orderId: string) {
    const response = await fetch(`${this.baseUrl}/qris/status/${orderId}`, {
      headers: {
        'X-Merchant-ID': this.merchantId,
        'X-Merchant-Key': this.merchantKey,
      }
    });
    
    return response.json();
  }
}

export class QRISPaymentService {
  private static instance: QRISPaymentService;
  private client: QRISClient;

  private constructor() {
    this.client = new QRISClient({
      merchantId: import.meta.env.VITE_QRIS_MERCHANT_ID,
      merchantKey: import.meta.env.VITE_QRIS_MERCHANT_KEY
    });
  }

  static getInstance(): QRISPaymentService {
    if (!this.instance) {
      this.instance = new QRISPaymentService();
    }
    return this.instance;
  }

  async createQRISPayment(params: {
    orderId: string;
    amount: number;
    customerName: string;
  }) {
    try {
      const response = await this.client.createPayment({
        external_id: params.orderId,
        amount: params.amount,
        customer: {
          name: params.customerName
        }
      });

      const qrCode = await generateQRCode(response.qr_string);

      return {
        qrCode,
        expiryTime: response.expiry_time,
        status: response.status
      };
    } catch (error) {
      captureError(error as Error, { context: 'QRIS Payment Creation' });
      throw error;
    }
  }

  async checkPaymentStatus(orderId: string) {
    try {
      const status = await this.client.getPaymentStatus(orderId);
      return status;
    } catch (error) {
      captureError(error as Error, { context: 'QRIS Payment Status Check' });
      throw error;
    }
  }
} 