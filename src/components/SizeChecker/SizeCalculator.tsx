import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { NailSize } from '../../types';

interface SizeResult {
  size: NailSize;
  confidence: number;
}

export default function SizeCalculator() {
  const [width, setWidth] = useState<string>('');
  const [result, setResult] = useState<SizeResult | null>(null);

  const calculateSize = (widthInMm: number): SizeResult => {
    if (widthInMm <= 12) return { size: 'XXS', confidence: 95 };
    if (widthInMm <= 13) return { size: 'XS', confidence: 90 };
    if (widthInMm <= 14) return { size: 'S', confidence: 90 };
    if (widthInMm <= 15) return { size: 'M', confidence: 95 };
    if (widthInMm <= 16) return { size: 'L', confidence: 90 };
    return { size: 'XL', confidence: 95 };
  };

  const handleCalculate = () => {
    const widthNum = parseFloat(width);
    if (!isNaN(widthNum) && widthNum > 0) {
      setResult(calculateSize(widthNum));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-secondary mb-6">Calculate Your Size</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
            Nail Width (mm)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter width in mm"
              step="0.1"
              min="0"
            />
            <button
              onClick={handleCalculate}
              className="flex-shrink-0 bg-primary hover:bg-[#ff6b99] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">
                  Your recommended size: <span className="font-bold">{result.size}</span>
                </p>
                <p className="text-sm text-green-600">
                  {result.confidence}% confidence in this recommendation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}