import { SEOHead } from '../SEO/Head';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { NailDesign } from '../../types';
import NailDesignCard from './NailDesignCard';
import { useCartStore } from '../../store/cartStore';

interface ProductListingProps {
  products: NailDesign[];
  category?: string;
}

export function ProductListing({ products, category }: ProductListingProps) {
  const analytics = useAnalytics();
  const { addToCart } = useCartStore();

  const seoTitle = category 
    ? `${category} Nail Art | PolishPop Indonesia`
    : 'Koleksi Nail Art Terbaru | PolishPop Indonesia';

  const seoDescription = category
    ? `Temukan koleksi ${category.toLowerCase()} nail art terbaik. Desain kuku premium dengan harga terjangkau. Pengiriman ke seluruh Indonesia.`
    : 'Koleksi nail art terlengkap dengan berbagai pilihan desain. Press on nails berkualitas tinggi dengan harga terjangkau. Pengiriman ke seluruh Indonesia.';

  const categoryKeywords = category ? [
    `${category.toLowerCase()} nail art`,
    `${category.toLowerCase()} kuku palsu`,
    `${category.toLowerCase()} press on nails`,
    `desain kuku ${category.toLowerCase()}`,
  ] : [];

  const handleAddToCart = (design: NailDesign) => {
    addToCart(design);
    analytics.track('Add to Cart', {
      productId: design.id,
      productName: design.name,
      price: design.isPromotional ? design.promotionalPrice : design.price,
      category: category || 'All'
    });
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={[
          ...categoryKeywords,
          'nail art indonesia',
          'press on nails murah',
          'kuku palsu custom',
          'nail art jakarta'
        ]}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((design) => (
          <NailDesignCard
            key={design.id}
            design={design}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No nail designs found. Please try different filters.
          </p>
        </div>
      )}
    </>
  );
} 