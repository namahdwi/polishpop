import { Calculator, Search, Palette, Truck, Star } from 'lucide-react';

const steps = [
  {
    icon: Calculator,
    title: "Find Your Size",
    description: "Use our size calculator for the perfect fit",
    detail: "95% accuracy rate"
  },
  {
    icon: Search,
    title: "Browse Designs",
    description: "Explore designs filtered by your nail size",
    detail: "100+ unique designs"
  },
  {
    icon: Palette,
    title: "Custom Creation",
    description: "We handcraft your nails within 3 days",
    detail: "Personalized attention"
  },
  {
    icon: Truck,
    title: "Track & Receive",
    description: "Monitor your order and delivery progress",
    detail: "Real-time updates"
  },
  {
    icon: Star,
    title: "Share Experience",
    description: "Rate your nails and share your style",
    detail: "Join our community"
  }
];

export default function OrderFlow() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Your Journey to Perfect Nails
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From measurement to delivery, we ensure a seamless experience for your custom nail art
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pink-200 -translate-y-1/2 hidden md:block" />
          
          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="absolute -top-3 -right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                    Step {index + 1}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-secondary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {step.description}
                    </p>
                    <span className="text-xs text-pink-600 font-medium">
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 