import { useState } from 'react';
import { X, Ruler, CheckCircle, AlertCircle, Info } from 'lucide-react';
import handImage from '/images/hand-measurement.png';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Measurements {
  width: string;
  length: string;
}

// Size chart based on nail measurements (in mm)
const SIZE_CHART = {
  XS: { width: { min: 8, max: 11.9 }, length: { min: 10, max: 14.9 } },
  S: { width: { min: 12, max: 13.9 }, length: { min: 15, max: 17.9 } },
  M: { width: { min: 14, max: 15.9 }, length: { min: 18, max: 20.9 } },
  L: { width: { min: 16, max: 17.9 }, length: { min: 21, max: 23.9 } },
  XL: { width: { min: 18, max: 20 }, length: { min: 24, max: 26 } }
};

export default function SizeCalculatorModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState<Measurements>({
    width: '',
    length: '',
  });
  const [result, setResult] = useState<{
    size: string;
    confidence: number;
    alternativeSize?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    width?: string;
    length?: string;
  }>({});

  // Reset all states when modal is closed
  const handleClose = () => {
    setStep(1);
    setMeasurements({ width: '', length: '' });
    setResult(null);
    setErrors({});
    onClose();
  };

  const validateMeasurements = (measurements: Measurements) => {
    const errors: { width?: string; length?: string } = {};
    const width = parseFloat(measurements.width);
    const length = parseFloat(measurements.length);

    if (width < 8 || width > 20) {
      errors.width = 'Width should be between 8mm and 20mm';
    }
    if (length < 10 || length > 26) {
      errors.length = 'Length should be between 10mm and 26mm';
    }

    return errors;
  };

  const calculateSize = (measurements: Measurements) => {
    const width = parseFloat(measurements.width);
    const length = parseFloat(measurements.length);
    
    // Initialize variables for best match
    let bestMatch = {
      size: '',
      confidence: 0,
      alternativeSize: undefined as string | undefined
    };

    // Calculate fit score for each size
    Object.entries(SIZE_CHART).forEach(([size, ranges]) => {
      const widthScore = calculateFitScore(width, ranges.width.min, ranges.width.max);
      const lengthScore = calculateFitScore(length, ranges.length.min, ranges.length.max);
      const totalScore = (widthScore + lengthScore) / 2;

      if (totalScore > bestMatch.confidence) {
        // If we already had a best match, it becomes the alternative
        if (bestMatch.size) {
          bestMatch.alternativeSize = bestMatch.size;
        }
        bestMatch = {
          size,
          confidence: totalScore,
          alternativeSize: bestMatch.alternativeSize
        };
      }
    });

    return bestMatch;
  };

  const calculateFitScore = (value: number, min: number, max: number) => {
    // Perfect fit if within range
    if (value >= min && value <= max) {
      const rangeMiddle = (max + min) / 2;
      // Higher score if closer to middle of range
      return 1 - Math.abs(value - rangeMiddle) / (max - min);
    }
    
    // Partial score if outside range but close
    const closestBound = value < min ? min : max;
    const distance = Math.abs(value - closestBound);
    if (distance <= 1) { // Within 1mm of range
      return 0.8 - (distance * 0.3);
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate measurements
    const validationErrors = validateMeasurements(measurements);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Calculate size
    const sizeResult = calculateSize(measurements);
    setResult(sizeResult);
    setStep(3);
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Perfect Match';
    if (confidence >= 0.7) return 'Good Match';
    return 'Approximate Match';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Nail Size Calculator
              </h2>
              <p className="mt-2 text-gray-600">
                Get your perfect fit in 3 easy steps
              </p>
            </div>

            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 relative ${
                    s < step ? 'text-green-600' : s === step ? 'text-pink-600' : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      s < step ? 'border-green-600 bg-green-50' :
                      s === step ? 'border-pink-600 bg-pink-50' :
                      'border-gray-300'
                    }`}>
                      {s < step ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        s
                      )}
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-center">
                    {s === 1 ? 'Prepare' : s === 2 ? 'Measure' : 'Results'}
                  </div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Before you start</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Make sure you have a ruler or measuring tape ready. For the most accurate results, measure your nails when they're clean and dry.
                    </p>
                  </div>
                </div>
                <img
                  src={handImage}
                  alt="How to measure your nails"
                  className="w-full rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  I'm Ready to Measure
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nail Width (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={measurements.width}
                        onChange={(e) => {
                          setMeasurements(prev => ({ ...prev, width: e.target.value }));
                          setErrors(prev => ({ ...prev, width: undefined }));
                        }}
                        className={`w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500 pl-10 ${
                          errors.width ? 'border-red-300' : ''
                        }`}
                        placeholder="13.5"
                      />
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.width && (
                      <p className="mt-1 text-sm text-red-600">{errors.width}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nail Length (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={measurements.length}
                        onChange={(e) => setMeasurements(prev => ({ ...prev, length: e.target.value }))}
                        className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500 pl-10"
                        placeholder="15.0"
                      />
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Measurement Tips:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Measure the widest part of your nail</li>
                        <li>• Keep the ruler flat against your nail</li>
                        <li>• Round to the nearest 0.5mm</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Calculate My Size
                </button>
              </form>
            )}

            {step === 3 && result && (
              <div className="text-center space-y-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">
                    Your Recommended Size
                  </h3>
                  <div className="text-5xl font-bold text-green-600 mt-2">
                    {result.size}
                  </div>
                  <div className={`mt-2 text-sm ${getConfidenceColor(result.confidence)}`}>
                    {getConfidenceLabel(result.confidence)}
                  </div>
                  {result.alternativeSize && (
                    <p className="mt-2 text-sm text-gray-600">
                      You might also fit: {result.alternativeSize}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium text-blue-900">Personalized Tips:</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-2">
                    {result.confidence < 0.9 && (
                      <li>• Consider ordering both {result.size} and {result.alternativeSize} to find your perfect fit</li>
                    )}
                    <li>• If between sizes, we recommend trying {result.size} first</li>
                    <li>• Each set includes size adjustments if needed</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    // Add logic to redirect to shop with selected size
                    onClose();
                  }}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Shop {result.size} Size Nails
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 