import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AuthModal from '../Auth/AuthModal';
import ClaimForm from './ClaimForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromotionModal({ isOpen, onClose }: Props) {
  const { user } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  if (claimed) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="absolute right-4 top-4">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-12">
              <div className="animate-bounce-slow mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-secondary mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                Your free nail art set has been claimed. We'll send you an email with tracking information once it ships.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => setShowAuth(false)}
        mode="signup"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
          {user ? (
            <ClaimForm
              onSuccess={() => setClaimed(true)}
              onClose={onClose}
            />
          ) : (
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Sign Up to Claim Your Free Set
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to claim your free nail art set and get exclusive access to future promotions.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="w-full bg-primary hover:bg-[#ff6b99] text-white py-2 rounded-lg transition-colors"
              >
                Sign Up Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}