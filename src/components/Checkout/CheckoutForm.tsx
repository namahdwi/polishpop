import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import PromoCodeInput from './PromoCodeInput';
import ShippingForm from './ShippingForm';
import { createOrder } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Promotion } from '../../types/promotion';

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, total, clearCart } = useCartStore();
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
  const [, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    codAgreed: false
  });

  const handlePromoApplied = (promotion: Promotion) => {
    setAppliedPromotion(promotion);
  };

  const discount = appliedPromotion ? 
    (appliedPromotion.discountType === 'percentage' ? 
      appliedPromotion.discountValue / 100 : 
      appliedPromotion.discountValue / total
    ) : 0;

  const finalTotal = total * (1 - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!shippingDetails.codAgreed) {
      toast.error('Please agree to COD payment for shipping');
      return;
    }

    setLoading(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        items: cart,
        shippingDetails,
        promotion: appliedPromotion || undefined,
        total: finalTotal,
        discount: discount
      });

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/account/orders/${orderId}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <PromoCodeInput onApply={handlePromoApplied} />
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 mt-4">
            <span>Discount Applied</span>
            <span>-${(total * discount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-4 text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <ShippingForm
        values={shippingDetails}
        onChange={setShippingDetails}
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#ff6b99] transition-colors"
      >
        Place Order
      </button>
    </form>
  );
} 