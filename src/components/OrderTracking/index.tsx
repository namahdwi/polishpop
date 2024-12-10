import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import Timeline from '../ui/Timeline';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import NotFound from '../ui/NotFound';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, fetchOrders, loading, error } = useOrderStore();
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (orderId) {
      fetchOrders(orderId);
    }
  }, [orderId, fetchOrders]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <NotFound message="Order not found" />;

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', date: order.createdAt },
    { status: 'processing', label: 'Processing', date: order.processingDate || '-' },
    { status: 'shipped', label: 'Shipped', date: order.shippedDate || '-' },
    { status: 'delivered', label: 'Delivered', date: order.deliveredDate || '-' }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Order Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <span className="ml-2 font-mono">{order.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <span className="ml-2">${order.total.toFixed(2)}</span>
            </div>
            {order.trackingNumber && (
              <div>
                <span className="text-gray-600">Tracking Number:</span>
                <span className="ml-2 font-mono">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600">Address:</span>
              <span className="ml-2">{order.shippingDetails.address}</span>
            </div>
            <div>
              <span className="text-gray-600">City:</span>
              <span className="ml-2">{order.shippingDetails.city}</span>
            </div>
            <div>
              <span className="text-gray-600">State:</span>
              <span className="ml-2">{order.shippingDetails.state}</span>
            </div>
            <div>
              <span className="text-gray-600">ZIP Code:</span>
              <span className="ml-2">{order.shippingDetails.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
          <Timeline steps={statusSteps.map(step => ({ ...step, date: step.date.toString() }))} currentStep={currentStepIndex} />
        </div>
      </div>
    </div>
  );
}
