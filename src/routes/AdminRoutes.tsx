import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/Admin/Dashboard';
import OrderDetails from '../components/Admin/OrderDetails';
import AdminLayout from '../layouts/AdminLayout';
import ProductManagement from '../components/Admin/ProductManagement';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="products" element={<ProductManagement />} />
      </Route>
    </Routes>
  );
} 