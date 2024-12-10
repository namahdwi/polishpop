import { useAuthStore } from '../../store/authStore';
import { usePromotionStore } from '../../store/promotionStore';
import { LoyaltyProgram } from '../../services/loyalty/loyaltyProgram';
import { useEffect, useState } from 'react';
import { Reward } from '../../types';
import { Heart, ShoppingBag, Gift, Star, Copy } from 'lucide-react';
import { useFavoriteStore } from '../../store/favoriteStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PromotionClaim } from '../../types/promotion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function CustomerPortal() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentPromotion } = usePromotionStore();
  const { favorites } = useFavoriteStore();
  const [points] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [orderHistory, setOrderHistory] = useState<PromotionClaim[]>([]);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!user) return;

      try {
        const [loyaltyProgram, claimsSnapshot] = await Promise.all([
          LoyaltyProgram.getInstance().getAvailableRewards(points),
          getDocs(query(
            collection(db, 'promotionClaims'),
            where('userId', '==', user.uid)
          ))
        ]);

        setRewards(loyaltyProgram);

        const claims = claimsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            promotionId: data.promotionId,
            code: data.code,
            appliedAt: data.appliedAt.toDate(),
            status: data.status,
            type: 'promotion',
            createdAt: data.createdAt.toDate(),
            designDetails: data.designDetails || null
          } as PromotionClaim;
        });

        setOrderHistory(claims);
      } catch (err) {
        setError('Failed to load customer data. Please try again later.');
        console.error('Error loading customer data:', err);
      }
    };

    loadCustomerData();
  }, [user, points]);


  const handleViewDesign = (designId: string) => {
    navigate(`/catalog/${designId}`);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/account/orders/${orderId}`);
  };

  const handleCopyCode = (e: React.MouseEvent<HTMLButtonElement>, code: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return;
    
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) return;

      if (points < reward.requiredPoints) {
        toast.error('Not enough points to redeem this reward');
        return;
      }

      // TODO: Implement reward redemption logic
      toast.success('Reward redeemed successfully!');
    } catch (error) {
      toast.error('Failed to redeem reward');
      console.error('Error redeeming reward:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">Please sign in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Customer Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary mb-2">
          Welcome back, {user?.displayName || 'Guest'}!
        </h1>
        <p className="text-gray-600">Manage your account and track your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loyalty & Rewards Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-[#FB85AC]" />
            <h2 className="text-lg font-medium text-secondary">Loyalty Program</h2>
          </div>
          <p className="text-3xl font-bold text-[#FB85AC] mb-4">{points} points</p>
          <div className="space-y-3">
            {rewards.map(reward => (
              <div key={reward.id} className="p-3 bg-pink-50 rounded-xl">
                <h3 className="font-medium text-secondary">{reward.name}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <button
                  onClick={() => handleRedeemReward(reward.id)}
                  className="mt-2 text-[#FB85AC] hover:text-[#ff6b99] text-sm font-medium"
                >
                  Redeem ({reward.requiredPoints} points)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Special Offers Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-[#FB85AC]" />
            <h2 className="text-lg font-medium text-secondary">Special Offers</h2>
          </div>
          {currentPromotion ? (
            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="font-medium text-secondary mb-2">{currentPromotion.title}</p>
              <p className="text-sm text-gray-600 mb-3">{currentPromotion.description}</p>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <span className="font-mono text-secondary">{currentPromotion.code}</span>
                <button
                  onClick={(e) => handleCopyCode(e, currentPromotion.code)}
                  className="ml-auto text-[#FB85AC] hover:text-[#ff6b99]"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active offers at the moment</p>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-[#FB85AC]" />
            <h2 className="text-lg font-medium text-secondary">Recent Orders</h2>
          </div>
          {orderHistory.length > 0 ? (
            <div className="space-y-3">
              {orderHistory.map(order => (
                <div
                  key={order.id}
                  className="p-3 bg-pink-50 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <p className="font-medium text-secondary">
                    {order.type === 'promotion' ? 'Free Nail Art Set' : `Order #${order.id}`}
                  </p>
                  {order.designDetails && (
                    <div className="mt-2 mb-2">
                      <img
                        src={order.designDetails.imageUrl}
                        alt={order.designDetails.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <p className="text-sm font-medium mt-1">{order.designDetails.name}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    Status: {order.status === 'pending' ? 'Preparing your custom nails' :
                      order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders yet</p>
          )}
        </div>
      </div>

      {/* Favorite Designs Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#FB85AC]" />
          <h2 className="text-lg font-medium text-secondary">Favorite Designs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.length > 0 ? (
            favorites.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewDesign(design.id)}
              >
                <img src={design.imageUrl} alt={design.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium text-secondary">{design.name}</h3>
                  <p className="text-sm text-gray-600">${design.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">
              No favorite designs yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 