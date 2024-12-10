import { useState, useEffect } from 'react';
import { fetchNailDesigns } from '../../services/catalogService';
import FilterBar from './FilterBar';
import LoadingSpinner from '../LoadingSpinner';
import { NailDesign } from '../../types';
import { ProductListing } from './ProductListing';

export default function Catalog() {
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLength, setSelectedLength] = useState('');

  useEffect(() => {
    loadDesigns();
  }, []);

  async function loadDesigns() {
    try {
      setLoading(true);
      const data = await fetchNailDesigns();
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data received from server');
      }
      setDesigns(data);
    } catch (error) {
      console.error('Error loading designs:', error);
      setError(error instanceof Error ? error.message : 'Failed to load designs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || design.category === selectedCategory;
    const matchesStyle = !selectedStyle || design.styles.includes(selectedStyle);
    const matchesLength = !selectedLength || design.lengths.includes(selectedLength);
    
    return matchesSearch && matchesCategory && matchesStyle && matchesLength;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <section id="catalog-section" className="py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Browse Our Designs</h2>
          <p className="mt-4 text-lg text-gray-600">Find the perfect style for your nails</p>
        </div>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          selectedStyle={selectedStyle}
          selectedLength={selectedLength}
          onCategoryChange={setSelectedCategory}
          onStyleChange={setSelectedStyle}
          onLengthChange={setSelectedLength}
        />

        <ProductListing 
          products={filteredDesigns}
          category={selectedCategory}
        />
      </div>
    </section>
  );
}