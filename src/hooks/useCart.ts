import { useState } from 'react';
import type { NailDesign } from '../types';

interface CartItem extends NailDesign {
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (design: NailDesign) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === design.id);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === design.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...design, quantity: 1 }];
    });
  };

  const removeFromCart = (designId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== designId)
    );
  };

  const updateQuantity = (designId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === designId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  };
}