import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { IndonesianPaymentService } from '../../services/payments/indonesianPayments';
import { CSRFProtection } from '../../middleware/csrf';
import { RateLimiter } from '../../middleware/rateLimiting';
import { sanitizeInput } from '../../utils/security';
import { captureError } from '../../utils/errorTracking';
import ShippingForm from './ShippingForm';
import { OrderSummary } from './OrderSummary';
import { PaymentForm } from './PaymentForm';
import OrderConfirmation from './OrderConfirmation';
import { StepIndicator } from './StepIndicator';
import type { ShippingDetails } from '../../types/checkout';
import { RateLimitError } from '../../utils/errors';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

const checkoutRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // max 5 checkout attempts per window
});

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const { items, total, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize CSRF token
    const csrfProtection = CSRFProtection.getInstance();
    csrfProtection.generateToken();
  }, []);

  if (!user) {
    window.location.href = '/login?redirect=/checkout';
    return null;
  }

  const handleShippingSubmit = async (details: ShippingDetails) => {
    try {
      // Sanitize input
      const sanitizedDetails = Object.entries(details).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: sanitizeInput(value)
      }), {} as ShippingDetails);

      // Validate shipping details
      if (!validateShippingDetails(sanitizedDetails)) {
        throw new Error('Invalid shipping details');
      }

      setShippingDetails(sanitizedDetails);
      setCurrentStep('payment');
    } catch (error) {
      captureError(error as Error, { context: 'Shipping Submission' });
      setError((error as Error).message);
    }
  };

  const handlePaymentSubmit = async (method: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check rate limit
      await checkoutRateLimiter.checkLimit(user.uid);

      // Verify CSRF token
      const csrfProtection = CSRFProtection.getInstance();
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (!token || !csrfProtection.verifyToken(token)) {
        throw new Error('Invalid security token');
      }

      const orderId = await createOrder(items, shippingDetails!);

      const paymentService = IndonesianPaymentService.getInstance();
      await paymentService.createPayment({
        orderId,
        amount: total,
        method: sanitizeInput(method),
        customerEmail: user.email ?? '',
        customerPhone: shippingDetails?.phone ?? ''
      });

      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      if (error instanceof RateLimitError) {
        setError('Too many checkout attempts. Please try again later.');
      } else {
        setError((error as Error).message);
      }
      captureError(error as Error, { context: 'Payment Submission' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between mb-8">
        <StepIndicator
          number={1}
          title="Shipping"
          active={currentStep === 'shipping'}
          completed={currentStep !== 'shipping'}
        />
        <StepIndicator
          number={2}
          title="Payment"
          active={currentStep === 'payment'}
          completed={currentStep === 'confirmation'}
        />
        <StepIndicator
          number={3}
          title="Confirmation"
          active={currentStep === 'confirmation'}
          completed={false}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {currentStep === 'shipping' && (
        <ShippingForm onSubmit={handleShippingSubmit} />
      )}

      {currentStep === 'payment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PaymentForm onSubmit={handlePaymentSubmit} loading={loading} />
          <OrderSummary items={items} total={total} />
        </div>
      )}

      {currentStep === 'confirmation' && (
        <OrderConfirmation />
      )}
    </div>
  );
}

function validateShippingDetails(details: ShippingDetails): boolean {
  const required = ['address', 'city', 'state', 'zipCode', 'phone'] as const;
  return required.every(field => {
    const value = details[field];
    return typeof value === 'string' && value.trim().length > 0;
  });
} 