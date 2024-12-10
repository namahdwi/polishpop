import { create } from 'zustand';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Promotion } from '../types/promotion';

interface PromotionState {
  currentPromotion: Promotion | null;
  loading: boolean;
  error: string | null;
  fetchActivePromotions: () => Promise<void>;
}

export const usePromotionStore = create<PromotionState>((set) => ({
  currentPromotion: null,
  loading: false,
  error: null,

  fetchActivePromotions: async () => {
    set({ loading: true, error: null });
    try {
      const now = Timestamp.now();
      const promotionsRef = collection(db, 'promotions');
      const q = query(
        promotionsRef,
        where('isActive', '==', true),
        where('endDate', '>=', now)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        set({ currentPromotion: null, loading: false });
        return;
      }

      const promotions = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Promotion, 'id'>)
        }))
        .filter(promo => promo.startDate <= now);

      set({ 
        currentPromotion: promotions[0] || null,
        loading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error fetching promotions:', error);
      set({ 
        error: 'Failed to fetch promotions',
        currentPromotion: null,
        loading: false 
      });
    }
  }
}));