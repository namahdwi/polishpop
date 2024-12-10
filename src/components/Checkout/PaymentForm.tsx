import { PAYMENT_METHODS } from '../../services/payments/indonesianPayments';

interface Props {
  onSubmit: (method: string) => void;
  loading: boolean;
}

export function PaymentForm({ onSubmit, loading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(formData.get('paymentMethod') as string);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id} className="flex items-center">
            <input
              id={method.id}
              name="paymentMethod"
              type="radio"
              value={method.id}
              defaultChecked={method.id === 'gopay'}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor={method.id} className="ml-3 flex items-center text-sm font-medium text-gray-700">
              <img src={method.icon} alt={method.name} className="h-6 w-6 mr-2" />
              {method.name}
            </label>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-[#ff6b99] transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Complete Order'}
      </button>
    </form>
  );
} 