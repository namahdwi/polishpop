import { captureError } from '../../utils/errorTracking';
import Xendit from 'xendit-node';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'e-wallet' | 'va' | 'retail' | 'qris';
  icon: string;
  fee: number;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'gopay', name: 'GoPay', type: 'e-wallet', icon: '/icons/gopay.svg', fee: 0 },
  { id: 'ovo', name: 'OVO', type: 'e-wallet', icon: '/icons/ovo.svg', fee: 0 },
  { id: 'dana', name: 'DANA', type: 'e-wallet', icon: '/icons/dana.svg', fee: 0 },
  { id: 'shopeepay', name: 'ShopeePay', type: 'e-wallet', icon: '/icons/shopeepay.svg', fee: 0 },
  { id: 'bca_va', name: 'BCA Virtual Account', type: 'va', icon: '/icons/bca.svg', fee: 4000 },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', type: 'va', icon: '/icons/mandiri.svg', fee: 4000 },
  { id: 'bni_va', name: 'BNI Virtual Account', type: 'va', icon: '/icons/bni.svg', fee: 4000 },
  { id: 'indomaret', name: 'Indomaret', type: 'retail', icon: '/icons/indomaret.svg', fee: 2500 },
  { id: 'alfamart', name: 'Alfamart', type: 'retail', icon: '/icons/alfamart.svg', fee: 2500 },
  { id: 'qris', name: 'QRIS', type: 'qris', icon: '/icons/qris.svg', fee: 0 },
];

export class IndonesianPaymentService {
  private static instance: IndonesianPaymentService;
  private xenditClient: any;

  private constructor() {
    this.xenditClient = this.initializeXendit();
  }

  static getInstance(): IndonesianPaymentService {
    if (!this.instance) {
      this.instance = new IndonesianPaymentService();
    }
    return this.instance;
  }

  async initializeCheckout(): Promise<void> {
    try {
      // Use the proper balance API endpoint
      return Promise.resolve();
    } catch (error) {
      captureError(error as Error, { context: 'Payment Service Initialization' });
      throw error;
    }
  }

  private initializeXendit() {
    const secretKey = import.meta.env.VITE_XENDIT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Xendit secret key is not configured');
    }
    return new Xendit({ secretKey });
  }

  private async createEWalletCharge(params: any, amount: number) {
    const charge = await this.xenditClient.eWallet.createCharge({
      referenceID: params.orderId,
      currency: 'IDR',
      amount: amount,
      checkoutMethod: 'ONE_TIME_PAYMENT',
      channelCode: params.method.toUpperCase(),
      channelProperties: {
        successRedirectURL: `${window.location.origin}/payment/success`,
        failureRedirectURL: `${window.location.origin}/payment/failure`,
      }
    });
    return charge;
  }

  private async createVirtualAccount(params: any, amount: number) {
    const va = await this.xenditClient.virtualAccount.create({
      externalID: params.orderId,
      bankCode: params.method.split('_')[0].toUpperCase(),
      name: params.customerName,
      amount: amount,
      currency: 'IDR'
    });
    return va;
  }

  private async createRetailPayment(params: any, amount: number) {
    const retail = await this.xenditClient.retailOutlet.create({
      externalID: params.orderId,
      retailOutletName: params.method.toUpperCase(),
      name: params.customerName,
      amount: amount,
      currency: 'IDR'
    });
    return retail;
  }

  private async createQRISPayment(params: any, amount: number) {
    const qris = await this.xenditClient.qris.create({
      externalID: params.orderId,
      amount: amount,
      currency: 'IDR',
      callbackURL: `${window.location.origin}/api/payments/callback`
    });
    return qris;
  }

  async createPayment(params: {
    orderId: string;
    amount: number;
    method: string;
    customerEmail: string;
    customerPhone: string;
  }) {
    try {
      const paymentMethod = PAYMENT_METHODS.find(m => m.id === params.method);
      if (!paymentMethod) throw new Error('Invalid payment method');

      const totalAmount = params.amount + paymentMethod.fee;

      switch (paymentMethod.type) {
        case 'e-wallet':
          return await this.createEWalletCharge(params, totalAmount);
        case 'va':
          return await this.createVirtualAccount(params, totalAmount);
        case 'retail':
          return await this.createRetailPayment(params, totalAmount);
        case 'qris':
          return await this.createQRISPayment(params, totalAmount);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      captureError(error as Error, { context: 'Payment Creation' });
      throw error;
    }
  }
} 