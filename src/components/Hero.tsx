import { useState, useEffect } from 'react';
import { Sparkles, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SizeCalculatorModal from './SizeCalculator/SizeCalculatorModal';

interface DoodlePosition {
  top: string;
  left: string;
  rotate: string;
  scale: string;
}

export default function Hero() {
  const navigate = useNavigate();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [doodlePositions, setDoodlePositions] = useState<DoodlePosition[]>([]);

  useEffect(() => {
    // Generate fewer doodles (5-8 instead of 8-12)
    const numDoodles = Math.floor(Math.random() * 4) + 5;
    const positions: DoodlePosition[] = [];

    for (let i = 0; i < numDoodles; i++) {
      positions.push({
        top: `${Math.random() * 80 + 10}%`, // Keep doodles away from edges
        left: `${Math.random() * 80 + 10}%`, // Keep doodles away from edges
        rotate: `rotate(${Math.random() * 360}deg)`,
        scale: `scale(${1 + Math.random() * 0.5})`, // Make doodles slightly larger
      });
    }

    setDoodlePositions(positions);
  }, []);

  const handleBrowseClick = () => {
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      {doodlePositions.map((position, index) => (
        <div
          key={index}
          className="absolute transition-opacity duration-500"
          style={{
            top: position.top,
            left: position.left,
            transform: `${position.rotate} ${position.scale}`,
            width: '120px', // Slightly larger
            height: '120px', // Slightly larger
            backgroundImage: 'url("/patterns/nail-doodles.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 1, // Increased opacity
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 1px rgba(251, 133, 172, 0.3))', // Add subtle shadow
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#89331F] tracking-tight">
            <span className="block">Express Your Style with</span>
            <span className="block text-[#FB85AC] mt-2">Custom Nail Art</span>
          </h1>

          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600 sm:max-w-3xl">
            Discover unique designs crafted by indie artists. Your perfect nails are just a click away.
          </p>

          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="group relative w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-[#FB85AC] text-base font-medium rounded-2xl text-[#FB85AC] bg-white hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="absolute -top-3 -right-3 bg-[#FB85AC] text-white text-xs px-2 py-1 rounded-full">
                Free Tool
              </div>
              <div className="flex flex-col items-center">
                <Sparkles className="w-6 h-6 mb-1 text-[#FB85AC]" />
                <span>Calculate Your Size</span>
                <span className="text-xs text-gray-500 mt-1">
                  95% accuracy rate
                </span>
              </div>
            </button>

            <button 
              onClick={handleBrowseClick}
              className="mt-3 sm:mt-0 w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#89331F] hover:bg-[#9B4A37] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Palette className="w-5 h-5 mr-2" />
              Browse Designs
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>

      <SizeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}