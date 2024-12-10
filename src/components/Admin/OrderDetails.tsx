import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OrderStatus } from '../../types';
import { toast } from 'react-hot-toast';
import { Package, Truck, CheckCircle } from 'lucide-react';

interface OrderDetails {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  discount: number;
  promotionCode: string | null;
  status: OrderStatus;
  shippingDetails: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: Date;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as OrderDetails);
        }
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: newStatus
      });
      setOrder({ ...order, status: newStatus });
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <div className="flex items-center gap-2">
            {Object.values(OrderStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`px-4 py-2 rounded-lg ${
                  order.status === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'processing' && <Package className="w-4 h-4 inline mr-1" />}
                {status === 'shipped' && <Truck className="w-4 h-4 inline mr-1" />}
                {status === 'delivered' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Customer Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Name:</span> {order.shippingDetails.fullName}</p>
              <p><span className="font-medium">Phone:</span> {order.shippingDetails.phone}</p>
              <p><span className="font-medium">Address:</span> {order.shippingDetails.address}</p>
              <p><span className="font-medium">City:</span> {order.shippingDetails.city}</p>
              <p><span className="font-medium">State:</span> {order.shippingDetails.state}</p>
              <p><span className="font-medium">ZIP:</span> {order.shippingDetails.zipCode}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                {order.promotionCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Promotion ({order.promotionCode})</span>
                    <span>-Rp {order.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t pt-2 font-medium">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>Rp {order.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 