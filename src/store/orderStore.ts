import { create } from 'zustand';
import { 
  collection, doc, addDoc, updateDoc, 
  Timestamp, serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { captureError } from '../utils/errorTracking';
import type { CartItem } from './cartStore';

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (items: CartItem[], shippingDetails: ShippingDetails) => Promise<string>;
  fetchOrders: (userId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export interface Order {
  processingDate: string;
  shippedDate: string;
  deliveredDate: string;
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingDetails: ShippingDetails;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,

  createOrder: async (items: CartItem[], shippingDetails: ShippingDetails) => {
    try {
      set({ loading: true, error: null });
      
      const orderData = {
        userId: auth.currentUser?.uid,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending' as OrderStatus,
        shippingDetails,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Update inventory
      await Promise.all(items.map(item => 
        updateDoc(doc(db, 'inventory', item.id), {
          quantity: increment(-item.quantity)
        })
      ));

      return orderRef.id;
    } catch (error) {
      captureError(error as Error, { context: 'Create Order' });
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      set({ orders });
    } catch (error) {
      captureError(error as Error, { context: 'Fetch Orders' });
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp()
      });
      
      // Refresh orders list
      if (auth.currentUser) {
        await get().fetchOrders(auth.currentUser.uid);
      }
    } catch (error) {
      captureError(error as Error, { context: 'Update Order Status' });
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
})); 