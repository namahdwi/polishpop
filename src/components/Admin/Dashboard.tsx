import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { usePromotionStore } from '../../store/promotionStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowUp, ArrowDown, Minus, Link } from 'lucide-react';
import OrderManagement from './OrderManagement';
import PromotionManagement from './PromotionManagement';
import InventoryManagement from './InventoryManagement';
import Analytics from './Analytics';

interface PeriodStats {
  orders: number;
  revenue: number;
  promotions: number;
  inventory: number;
}

interface DashboardCardProps {
  title: string;
  value: string | number;
  previousValue: number;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

function DashboardCard({ title, value, previousValue, trend, trendDirection }: DashboardCardProps) {
  const percentageChange = previousValue 
    ? ((Number(value) - previousValue) / previousValue * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className="ml-2 flex items-center">
          {trendDirection === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
          {trendDirection === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
          {trendDirection === 'neutral' && <Minus className="w-4 h-4 text-gray-500" />}
          <span className={`ml-1 text-sm font-medium ${
            trendDirection === 'up' ? 'text-green-600' : 
            trendDirection === 'down' ? 'text-red-600' : 
            'text-gray-500'
          }`}>
            {percentageChange}% {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const authState = useAuthStore();
  const { orders } = useOrderStore();
  const { currentPromotion } = usePromotionStore();
  const { inventory } = useInventoryStore();
  const [previousStats, setPreviousStats] = useState<PeriodStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousPeriodData = async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      try {
        const [ordersSnapshot, promotionsSnapshot] = await Promise.all([
          getDocs(query(
            collection(db, 'orders'),
            where('createdAt', '>=', Timestamp.fromDate(sixtyDaysAgo)),
            where('createdAt', '<=', Timestamp.fromDate(thirtyDaysAgo))
          )),
          getDocs(query(
            collection(db, 'promotions'),
            where('endDate', '>=', Timestamp.fromDate(sixtyDaysAgo)),
            where('endDate', '<=', Timestamp.fromDate(thirtyDaysAgo))
          ))
        ]);

        const previousOrders = ordersSnapshot.docs;
        const previousRevenue = previousOrders.reduce((sum, order) => {
          const data = order.data();
          return sum + (data.total || 0);
        }, 0);

        setPreviousStats({
          orders: previousOrders.length,
          revenue: previousRevenue,
          promotions: promotionsSnapshot.docs.length,
          inventory: inventory.length // Using current inventory as baseline
        });
      } catch (error) {
        console.error('Error fetching previous period data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousPeriodData();
  }, [inventory]);

  const user = authState.user;

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Link 
            to="/" 
            className="text-primary hover:text-[#ff6b99] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const getTrendDirection = (current: number, previous: number) => {
    if (current === previous) return 'neutral';
    return current > previous ? 'up' : 'down';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Orders"
            value={orders.length}
            previousValue={previousStats?.orders || 0}
            trend="vs last period"
            trendDirection={getTrendDirection(orders.length, previousStats?.orders || 0)}
          />
          <DashboardCard
            title="Active Promotions"
            value={currentPromotion ? 1 : 0}
            previousValue={previousStats?.promotions || 0}
            trend="vs last period"
            trendDirection={getTrendDirection(currentPromotion ? 1 : 0, previousStats?.promotions || 0)}
          />
          <DashboardCard
            title="Revenue"
            value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
            previousValue={previousStats?.revenue || 0}
            trend="vs last period"
            trendDirection={getTrendDirection(totalRevenue, previousStats?.revenue || 0)}
          />
          <DashboardCard
            title="Inventory Items"
            value={inventory.length}
            previousValue={previousStats?.inventory || 0}
            trend="vs last period"
            trendDirection={getTrendDirection(inventory.length, previousStats?.inventory || 0)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrderManagement />
          <PromotionManagement />
        </div>

        <div className="mt-8">
          <InventoryManagement />
        </div>

        <div className="mt-8">
          <Analytics />
        </div>
      </div>
    </div>
  );
} 