import React from 'react';
import { Ruler, Info } from 'lucide-react';
import type { NailSize } from '../../types';

const sizeGuideData: Record<NailSize, { width: string; description: string }> = {
  'XXS': { width: '11-12mm', description: 'Petite pinky nail' },
  'XS': { width: '12-13mm', description: 'Standard pinky nail' },
  'S': { width: '13-14mm', description: 'Ring finger nail' },
  'M': { width: '14-15mm', description: 'Middle finger nail' },
  'L': { width: '15-16mm', description: 'Index finger nail' },
  'XL': { width: '16-17mm', description: 'Thumb nail' }
};

export default function SizeGuide() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-secondary">Size Guide</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.entries(sizeGuideData) as [NailSize, typeof sizeGuideData[NailSize]][]).map(([size, data]) => (
          <div key={size} className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold">
              {size}
            </div>
            <div>
              <p className="font-medium text-secondary">{data.width}</p>
              <p className="text-sm text-gray-600">{data.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          For the most accurate measurement, place your nail against a ruler and measure the widest part in millimeters.
        </p>
      </div>
    </div>
  );
}