import { useEffect } from 'react';
import { Gift } from 'lucide-react';
import { usePromotionStore } from '../store/promotionStore';

export default function PromotionBanner() {
  const { currentPromotion, loading, error, fetchActivePromotions } = usePromotionStore();

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        await fetchActivePromotions();
      } catch (error) {
        console.error('Error loading promotions:', error);
      }
    };
    loadPromotions();
  }, []);

  if (loading) {
    return null;
  }

  if (error || !currentPromotion) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#FB85AC] to-[#ff6b99] text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
          <Gift className="w-5 h-5 animate-bounce" />
          <span className="font-medium">
            {currentPromotion.title} - {currentPromotion.description}
          </span>
          {currentPromotion.remainingOffers < 20 && (
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              Only {currentPromotion.remainingOffers} left!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}