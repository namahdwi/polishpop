import { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface PeriodStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface FirestoreOrder {
  id: string;
  total: number;
  createdAt: Timestamp;
  // Add other order fields as needed
}

export default function Analytics() {
  const { orders } = useOrderStore();
  const [, setPreviousPeriodStats] = useState<PeriodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviousPeriodData = async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const previousPeriodQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(sixtyDaysAgo)),
        where('createdAt', '<=', Timestamp.fromDate(thirtyDaysAgo))
      );

      try {
        setLoading(true);
        const snapshot = await getDocs(previousPeriodQuery);
        const previousOrders = snapshot.docs.map(doc => ({
          ...(doc.data() as FirestoreOrder),
          id: doc.id
        }));

        const stats = {
          totalOrders: previousOrders.length,
          totalRevenue: previousOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          averageOrderValue: previousOrders.length > 0 
            ? previousOrders.reduce((sum, order) => sum + (order.total || 0), 0) / previousOrders.length 
            : 0
        };

        setPreviousPeriodStats(stats);
      } catch (error) {
        console.error('Error fetching previous period data:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousPeriodData();
  }, []);

  const currentStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length 
      : 0
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-1 text-xl font-semibold">{currentStats.totalOrders}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-1 text-xl font-semibold">
            Rp {currentStats.totalRevenue.toLocaleString('id-ID')}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
          <p className="mt-1 text-xl font-semibold">
            Rp {currentStats.averageOrderValue.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
} 