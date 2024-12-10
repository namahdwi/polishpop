import React, { useState } from 'react';
import { Loader, Gift, Truck } from 'lucide-react';
import { usePromotionStore } from '../../store/promotionStore';
import { useAuthStore } from '../../store/authStore';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function ClaimForm({ onSuccess, onClose }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { claimPromotion, loading, error } = usePromotionStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contributingToShipping: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!formData.contributingToShipping) {
        throw new Error('Please agree to pay shipping costs via COD');
      }
      await handleClaimSuccess();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };


  const handleClaimSuccess = async () => {
    if (!user) return;

    try {
      await claimPromotion(user.uid, formData);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess();
      setTimeout(() => {
        navigate('/account/orders');
      }, 2000);
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gift className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-secondary">
          Claim Your Free Nail Art Set
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-pink-50 rounded-lg">
            <input
              type="checkbox"
              id="contribute"
              checked={formData.contributingToShipping}
              onChange={(e) => setFormData(prev => ({ ...prev, contributingToShipping: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="contribute" className="text-sm text-gray-700">
              I agree to pay shipping costs via Cash on Delivery (COD)
            </label>
            <Truck className="w-4 h-4 text-primary ml-auto" />
          </div>

          {formData.contributingToShipping && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-2 text-secondary">⚠️ Important Shipping Information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Shipping fee is <span className="font-medium">Your Responsibility</span></li>
                <li>Payment is collected by courier upon delivery (COD)</li>
                <li>Please prepare exact amount for the delivery person</li>
                <li>No additional fees beyond the shipping cost</li>
              </ul>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#ff6b99] text-white py-2 rounded-lg transition-colors"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Claim Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}