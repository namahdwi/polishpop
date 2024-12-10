export interface QRISClient {
  createPayment(params: {
    external_id: string;
    amount: number;
    customer: {
      name: string;
    };
  }): Promise<{
    qr_string: string;
    expiry_time: string;
    status: string;
  }>;

  getPaymentStatus(orderId: string): Promise<string>;
} 