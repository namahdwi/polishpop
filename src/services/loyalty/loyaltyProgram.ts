import { 
  runTransaction,
  query,
  where,
  getDocs,
  Transaction} from 'firebase/firestore';
import { db, getCollection, getDocument } from '../../lib/firebase';
import { Order, Customer, Reward } from '../../types';
import { captureError } from '../../utils/errorTracking';

export class LoyaltyProgram {
  private static instance: LoyaltyProgram;
  private readonly POINTS_MULTIPLIER = 10; // Rp 1000 = 1 point

  private constructor() {}

  static getInstance(): LoyaltyProgram {
    if (!this.instance) {
      this.instance = new LoyaltyProgram();
    }
    return this.instance;
  }

  async calculatePoints(order: Order): Promise<number> {
    return Math.floor(order.total / 1000) * this.POINTS_MULTIPLIER;
  }

  async addPoints(customerId: string, points: number): Promise<void> {
    try {
      await runTransaction(db, async (transaction: Transaction) => {
        const customerRef = getDocument<Customer>('customers', customerId);
        const customerDoc = await transaction.get(customerRef);
        
        if (!customerDoc.exists()) {
          throw new Error('Customer not found');
        }

        const currentPoints = customerDoc.data()?.points || 0;
        transaction.update(customerRef, {
          points: currentPoints + points,
          updatedAt: new Date()
        });
      });
    } catch (error) {
      captureError(error as Error, {
        context: 'Loyalty Points Addition',
        customerId,
        points
      });
      throw error;
    }
  }

  async getAvailableRewards(points: number): Promise<Reward[]> {
    try {
      const rewardsRef = getCollection<Reward>('rewards');
      const rewardsQuery = query(rewardsRef, where('requiredPoints', '<=', points));
      const rewardsSnapshot = await getDocs(rewardsQuery);

      return rewardsSnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      captureError(error as Error, {
        context: 'Get Available Rewards',
        points
      });
      throw error;
    }
  }

  async redeemReward(customerId: string, rewardId: string): Promise<void> {
    try {
      await runTransaction(db, async (transaction: Transaction) => {
        const rewardRef = getDocument<Reward>('rewards', rewardId);
        const customerRef = getDocument<Customer>('customers', customerId);

        const [rewardDoc, customerDoc] = await Promise.all([
          transaction.get(rewardRef),
          transaction.get(customerRef)
        ]);

        if (!rewardDoc.exists() || !customerDoc.exists()) {
          throw new Error('Reward or customer not found');
        }

        const reward = rewardDoc.data();
        const customer = customerDoc.data();

        if (!reward || !customer) {
          throw new Error('Invalid reward or customer data');
        }

        if (customer.points < reward.requiredPoints) {
          throw new Error('Insufficient points');
        }

        // Update customer points
        transaction.update(customerRef, {
          points: customer.points - reward.requiredPoints,
          updatedAt: new Date()
        });

        // Record redemption
        const redemptionRef = getDocument('redemptions', crypto.randomUUID());
        transaction.set(redemptionRef, {
          customerId,
          rewardId,
          points: reward.requiredPoints,
          redeemedAt: new Date()
        });
      });
    } catch (error) {
      captureError(error as Error, {
        context: 'Reward Redemption',
        customerId,
        rewardId
      });
      throw error;
    }
  }
} 