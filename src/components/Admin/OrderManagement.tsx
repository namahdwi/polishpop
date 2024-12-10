import { useOrderStore } from '../../store/orderStore';
import { OrderStatus } from '../../types';
import { useNavigate } from 'react-router-dom';

export default function OrderManagement() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();

  const handleViewDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewDetails(order.id)}
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.shippingDetails.fullName}</td>
                <td className="px-6 py-4">
                  Rp {order.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === OrderStatus.DELIVERED 
                      ? 'bg-green-100 text-green-800'
                      : order.status === OrderStatus.SHIPPED
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(order.id);
                    }}
                    className="text-primary hover:text-[#ff6b99]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 