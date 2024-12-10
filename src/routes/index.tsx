import { createBrowserRouter } from 'react-router-dom';
import AdminDashboard from '../components/Admin/Dashboard';
import OrderDetails from '../components/Admin/OrderDetails';
import AdminLayout from '../layouts/AdminLayout';

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'orders/:orderId',
        element: <OrderDetails />
      }
    ]
  }
]); 