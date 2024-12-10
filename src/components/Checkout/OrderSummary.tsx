import type { CartItem } from '../../types/cart';

interface Props {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: Props) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${item.price * item.quantity}</p>
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>${total}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 