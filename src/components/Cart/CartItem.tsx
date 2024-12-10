// @ts-ignore
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { NailDesign } from '../../types';

interface Props {
  item: NailDesign & { quantity: number };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-medium text-secondary">{item.name}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {item.styles.map((style) => (
            <span key={style} className="px-2 py-0.5 text-xs bg-pink-50 text-primary rounded-full">
              {style}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-medium text-secondary">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="mt-1 text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
}