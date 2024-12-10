import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutGrid, Package, Tag, BarChart2, Users, LogOut, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Orders', path: '/admin/orders' },
    { icon: Tag, label: 'Promotions', path: '/admin/promotions' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-xl font-bold text-primary">Admin Portal</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => {/* Add logout logic */}}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-primary"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 