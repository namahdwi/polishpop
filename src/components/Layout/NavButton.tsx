import { Home, Search, ShoppingCart, User } from 'lucide-react';

interface NavButtonProps {
  icon: 'home' | 'search' | 'cart' | 'user';
  label: string;
}

export function NavButton({ icon, label }: NavButtonProps) {
  const Icon = {
    home: Home,
    search: Search,
    cart: ShoppingCart,
    user: User
  }[icon];

  return (
    <button className="flex flex-col items-center justify-center w-full">
      <Icon className="w-6 h-6 text-gray-600" />
      <span className="mt-1 text-xs text-gray-600">{label}</span>
    </button>
  );
} 