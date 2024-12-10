import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { NavButton } from './NavButton';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileOptimizedLayout({ children }: MobileLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`
      min-h-screen
      ${isMobile ? 'px-4' : 'px-8'}
      ${isMobile ? 'py-4' : 'py-8'}
    `}>
      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-around items-center h-16">
            <NavButton icon="home" label="Beranda" />
            <NavButton icon="search" label="Cari" />
            <NavButton icon="cart" label="Keranjang" />
            <NavButton icon="user" label="Profil" />
          </div>
        </nav>
      )}
      
      {/* Main Content */}
      <main className={`
        ${isMobile ? 'mb-20' : ''}
        max-w-7xl
        mx-auto
      `}>
        {children}
      </main>
    </div>
  );
}

// Mobile-optimized Product Card
export function MobileProductCard({ product }: { product: any }) {
  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded-t-lg"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 truncate">
          {product.description}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm">
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
} 