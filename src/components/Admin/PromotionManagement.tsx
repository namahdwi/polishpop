import { useState } from 'react';
import { usePromotionStore } from '../../store/promotionStore';
import { Promotion } from '../../types/promotion';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function PromotionManagement() {
  const { currentPromotion, fetchActivePromotions } = usePromotionStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: 100,
    isFirstTimeOnly: true,
    maxUses: 100,
    currentUses: 0,
    totalOffers: 100,
    remainingOffers: 100,
    isActive: true,
    applicableProducts: [],
    terms: []
  });

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'promotions'), {
        ...newPromotion,
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        isActive: true,
        remainingOffers: newPromotion.totalOffers || 100,
        applicableProducts: newPromotion.applicableProducts || [],
        terms: newPromotion.terms || []
      });
      
      await fetchActivePromotions();
      setIsCreating(false);
      toast.success('Promotion created successfully!');
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast.error('Failed to create promotion');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Promotion Management</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#ff6b99]"
        >
          {isCreating ? 'Cancel' : 'Create New'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleCreatePromotion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newPromotion.title}
              onChange={e => setNewPromotion(p => ({ ...p, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Promo Code</label>
            <input
              type="text"
              value={newPromotion.code}
              onChange={e => setNewPromotion(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Uses</label>
            <input
              type="number"
              value={newPromotion.maxUses}
              onChange={e => setNewPromotion(p => ({ ...p, maxUses: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              value={newPromotion.discountType}
              onChange={e => setNewPromotion(p => ({ ...p, discountType: e.target.value as 'percentage' | 'fixed' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Value</label>
            <input
              type="number"
              value={newPromotion.discountValue}
              onChange={e => setNewPromotion(p => ({ ...p, discountValue: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFirstTimeOnly"
              checked={newPromotion.isFirstTimeOnly}
              onChange={e => setNewPromotion(p => ({ ...p, isFirstTimeOnly: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFirstTimeOnly" className="ml-2 text-sm text-gray-700">
              First-time customers only
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#ff6b99]"
          >
            Create Promotion
          </button>
        </form>
      ) : currentPromotion ? (
        <div>
          <h3 className="font-medium">Active Promotion</h3>
          <p className="mt-2">{currentPromotion.title}</p>
          <p className="text-sm text-gray-500">Code: {currentPromotion.code}</p>
          <p className="text-sm text-gray-500">
            Uses: {currentPromotion.currentUses} / {currentPromotion.maxUses}
          </p>
          <p className="text-sm text-gray-500">
            Valid until: {currentPromotion.endDate.toDate().toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No active promotions</p>
      )}
    </div>
  );
} 