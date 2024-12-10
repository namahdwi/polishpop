export default function OrderConfirmation() {
  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-4">
        Thank you for your purchase. We'll send you an email with your order details.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#ff6b99] transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
} 