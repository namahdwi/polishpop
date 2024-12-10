import { Heart, ShoppingCart } from 'lucide-react';
import type { NailDesign } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useFavoriteStore } from '../../store/favoriteStore';
import toast from 'react-hot-toast';

interface Props {
  design: NailDesign;
  onAddToCart: (design: NailDesign) => void;
}

export default function NailDesignCard({ design, onAddToCart }: Props) {
  const { user } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
  const isFavorited = isFavorite(design.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }
    onAddToCart(design);
    toast.success('Added to cart!');
  };

  const handleFavoriteClick = () => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    if (isFavorited) {
      removeFavorite(design.id);
    } else {
      addFavorite(design);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">

      <div className="aspect-w-1 aspect-h-1">
        <img
          src={design.imageUrl}
          alt={design.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 p-2 ${isFavorited ? 'bg-pink-100' : 'bg-white/80'
          } backdrop-blur-sm rounded-full hover:bg-pink-50 transition-all duration-300`}
      >
        <Heart
          className={`w-5 h-5 ${isFavorited ? 'text-[#FB85AC] fill-current' : 'text-primary'
            }`}
        />
      </button>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-secondary mb-1">{design.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{design.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {design.styles.map((style) => (
            <span key={style} className="px-2 py-1 text-xs bg-pink-50 text-primary rounded-full">
              {style}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-baseline">
            {design.promotionalPrice && (
              <>
                <span className="text-xl font-bold text-red-500">
                  ${design.promotionalPrice}
                </span>
                <span className="text-xs line-through text-gray-400 ml-2">
                  ${design.price}
                </span>
              </>
            )}
            {!design.promotionalPrice && (
              <span className="text-xl font-bold text-secondary">
                ${design.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full hover:bg-[#ff6b99] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}