import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NailDesign } from '../types';

interface CartItem extends NailDesign {
  quantity: number;
  addedAt: number;
}

interface CartStore {
  items: CartItem[];
  cart: CartItem[];
  total: number;
  clearCart: () => void;
  validateCart: () => boolean;
  error?: string;
}


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cart: [],
      total: 0,
      error: undefined,

      validateCart: () => {
        const state = get();
        return Array.isArray(state.items) && Array.isArray(state.cart);
      },

      clearCart: () => set({ 
        items: [], 
        total: 0, 
        cart: [],
        error: undefined
      }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        cart: state.cart
      }),
      // Validate stored data on hydration
      onRehydrateStorage: () => (state) => {
        if (state && !state.validateCart()) {
          state.clearCart();
          state.error = 'Cart data was invalid and has been reset';
        }
      }
    }
  )
);