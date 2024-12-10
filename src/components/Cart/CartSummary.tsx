// @ts-ignore
import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface Props {
  subtotal: number;
  onCheckout: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: Props) {
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-secondary mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        {shipping > 0 && (
          <p className="text-xs text-gray-500">
            Free shipping on orders over $50
          </p>
        )}
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-secondary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-[#ff6b99] text-white py-3 rounded-full transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        Proceed to Checkout
      </button>
    </div>
  );
}