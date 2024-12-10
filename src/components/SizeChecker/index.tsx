import React from 'react';
import { Sparkles } from 'lucide-react';
import SizeGuide from './SizeGuide';
import SizeCalculator from './SizeCalculator';

export default function SizeChecker() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-secondary">Find Your Perfect Fit</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use our interactive size calculator to find your ideal nail size. Getting the right fit is crucial for comfort and longevity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <SizeCalculator />
          <SizeGuide />
        </div>
      </div>
    </section>
  );
}