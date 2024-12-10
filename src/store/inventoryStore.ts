import { create } from 'zustand';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { captureError } from '../utils/errorTracking';

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryState {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  updateStock: (itemId: string, newStock: number) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [],
  loading: false,
  error: null,

  fetchInventory: async () => {
    try {
      set({ loading: true, error: null });
      const snapshot = await getDocs(collection(db, 'inventory'));
      const inventory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[];
      
      set({ inventory });
    } catch (error) {
      captureError(error as Error, { context: 'Fetch Inventory' });
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateStock: async (itemId: string, newStock: number) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, 'inventory', itemId), {
        stock: newStock,
        updatedAt: new Date()
      });
      await useInventoryStore.getState().fetchInventory();
    } catch (error) {
      captureError(error as Error, { context: 'Update Stock' });
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
})); 