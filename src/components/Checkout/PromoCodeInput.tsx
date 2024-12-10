import { useState } from 'react';
import { usePromotionStore } from '../../store/promotionStore';
import { toast } from 'react-hot-toast';
import { Promotion } from '../../types/promotion';

interface Props {
  onApply: (promotion: Promotion) => void;
}

export default function PromoCodeInput({ onApply }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { validatePromoCode } = usePromotionStore();

  const handleApplyCode = async () => {
    if (!code) return;
    
    setLoading(true);
    try {
      const promotion = await validatePromoCode(code);
      if (promotion) {
        onApply(promotion);
        toast.success('Promotion applied successfully!');
      } else {
        toast.error('Invalid or expired promotion code');
      }
    } catch (error) {
      toast.error('Failed to validate promotion code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter promo code"
        className="flex-1 rounded-lg border-gray-300"
      />
      <button
        onClick={handleApplyCode}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#ff6b99] disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  );
} 