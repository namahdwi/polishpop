import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import AuthModal from '../../components/Auth/AuthModal';
import CustomerSupportModal from '../CustomerSupport/CustomerSupportModal';
import Cart from '../Cart';

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { items } = useCartStore();
  const { user, signOut } = useAuthStore();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold text-secondary">PolishPop</span>
              <span className="ml-2 text-sm font-light text-gray-400 border-l border-pink-100 pl-2 group-hover:text-pink-400 transition-colors duration-300">
                by{' '}
                <span className="font-medium italic bg-gradient-to-r from-[#FB85AC] to-[#89331F] bg-clip-text text-transparent hover:from-[#89331F] hover:to-[#FB85AC] transition-all duration-500">
                  NamahDwi
                </span>
                <span className="inline-block ml-1 animate-pulse">✨</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/account" 
                  className="text-gray-700 hover:text-pink-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setShowCart(true)}
                  className="relative text-gray-700 hover:text-pink-600"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-pink-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('signin')}
                  className="text-gray-700 hover:text-pink-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
                >
                  Sign Up
                </button>
              </>
            )}
            <button
              className="text-gray-700 hover:text-pink-600"
              onClick={() => setShowSupportModal(true)}
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </button>

            <CustomerSupportModal
              isOpen={showSupportModal}
              onClose={() => setShowSupportModal(false)}
            />
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      
      <Cart 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </header>
  );
}