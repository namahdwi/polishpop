import { Timestamp } from 'firebase/firestore';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;
  remainingOffers: number;
  totalOffers: number;
  maxUses: number;
  currentUses: number;
  isFirstTimeOnly: boolean;
  applicableProducts: string[];
  terms: string[];
}

export interface PromotionClaim {
  id: string;
  userId: string;
  promotionId: string;
  code: string;
  appliedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  type: 'promotion';
  createdAt: Date;
  designDetails?: {
    name: string;
    description: string;
    imageUrl: string;
  };
} 