import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { CustomerSupportQueue } from '../../services/customerService/queueService';
import { useAuthStore } from '../../store/authStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerSupportModal({ isOpen, onClose }: Props) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const queue = CustomerSupportQueue.getInstance();
      await queue.addToQueue({
        customer: {
          name: user?.displayName || 'Guest',
          phone: user?.phoneNumber || '',
        },
        message,
        orderId: 'GENERAL'
      }, 'medium');
      
      onClose();
      alert('Your message has been sent! Our team will contact you shortly.');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-secondary mb-4">
            Contact Customer Support
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How can we help you?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border-2 border-pink-100 p-3 focus:border-[#FB85AC] focus:ring-[#FB85AC]/20"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FB85AC] text-white py-2 rounded-full hover:bg-[#ff6b99] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 