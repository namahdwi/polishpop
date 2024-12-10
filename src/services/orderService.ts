import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShippingDetails } from '../types/checkout';
import { Promotion } from '../types/promotion';

interface CreateOrderParams {
  userId: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  shippingDetails: ShippingDetails;
  promotion?: Promotion;
  total: number;
  discount: number;
}

export async function createOrder({
  userId,
  items,
  shippingDetails,
  promotion,
  total,
  discount
}: CreateOrderParams) {
  try {
    // Create the order
    const orderRef = await addDoc(collection(db, 'orders'), {
      userId,
      items,
      shippingDetails,
      total,
      discount,
      status: 'pending',
      createdAt: new Date(),
      paymentMethod: 'COD',
      promotionCode: promotion?.code || null
    });

    // If promotion was used, increment its usage
    if (promotion) {
      const promotionRef = doc(db, 'promotions', promotion.id);
      await updateDoc(promotionRef, {
        currentUses: promotion.currentUses + 1
      });
    }

    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
} 