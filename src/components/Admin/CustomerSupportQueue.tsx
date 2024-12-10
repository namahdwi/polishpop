import { useEffect, useState } from 'react';
import { CustomerSupportQueue, QueueItem } from '../../services/customerService/queueService';
import { useAuthStore } from '../../store/authStore';

export default function CustomerSupportQueueComponent() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const queueService = CustomerSupportQueue.getInstance();

  useEffect(() => {
    loadQueue();
    // Set up real-time updates
    const interval = setInterval(loadQueue, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function loadQueue() {
    try {
      const items = await queueService.getPendingQueries();
      setQueue(items);
    } catch (error) {
      console.error('Failed to load support queue:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAssign = async (itemId: string) => {
    if (!user?.uid) return;
    try {
      await queueService.assignAgent(itemId, user.uid);
      await loadQueue();
    } catch (error) {
      console.error('Failed to assign query:', error);
    }
  };

  const handleResolve = async (itemId: string) => {
    try {
      await queueService.resolveQuery(itemId);
      await loadQueue();
    } catch (error) {
      console.error('Failed to resolve query:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Support Queue</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading queue...</div>
      ) : queue.length > 0 ? (
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.customerName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.customerPhone}</p>
                  <p className="mt-2 text-gray-700">{item.queryMessage}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {item.createdAt.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!item.assignedTo && (
                    <button
                      onClick={() => handleAssign(item.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600"
                    >
                      Assign to Me
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No pending support queries
        </div>
      )}
    </div>
  );
} 