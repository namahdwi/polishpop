import { NailDesign } from '../types';

const mockDesigns: NailDesign[] = [
  {
    id: '1',
    name: 'Classic French Tips',
    description: 'Timeless french manicure design with a modern twist',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Classic',
    styles: ['French', 'Minimalist'],
    lengths: ['Short', 'Medium'],
    isPromotional: true,
    promotionalPrice: 24.99
  },
  {
    id: '2',
    name: 'Glitter Galaxy',
    description: 'Mesmerizing holographic glitter design with cosmic vibes',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Artistic',
    styles: ['Glitter', 'Metallic'],
    lengths: ['Medium', 'Long'],
    isPromotional: false
  },
  {
    id: '3',
    name: 'Pink Paradise',
    description: 'Soft pink ombré with delicate flower accents',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Glamour',
    styles: ['Floral', 'Geometric'],
    lengths: ['Medium'],
    isPromotional: true,
    promotionalPrice: 29.99
  },
  {
    id: '4',
    name: 'Minimalist Lines',
    description: 'Clean, modern lines in neutral tones',
    price: 27.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Minimalist',
    styles: ['Geometric', 'Matte'],
    lengths: ['Short'],
    isPromotional: false
  },
  {
    id: '5',
    name: 'Summer Butterflies',
    description: 'Playful butterfly designs with pastel accents',
    price: 36.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Seasonal',
    styles: ['Floral', 'Abstract'],
    lengths: ['Medium', 'Long'],
    isPromotional: true,
    promotionalPrice: 31.99
  },
  {
    id: '6',
    name: 'Chrome Dreams',
    description: 'Ultra-reflective chrome finish with holographic effects',
    price: 42.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Glamour',
    styles: ['Metallic', 'Abstract'],
    lengths: ['Medium', 'Long'],
    isPromotional: false
  },
  {
    id: '7',
    name: 'Matte Black Magic',
    description: 'Sophisticated matte black with subtle geometric patterns',
    price: 32.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Minimalist',
    styles: ['Matte', 'Geometric'],
    lengths: ['Short', 'Medium'],
    isPromotional: false
  },
  {
    id: '8',
    name: 'Spring Blossoms',
    description: 'Delicate cherry blossoms on a pale pink base',
    price: 38.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Seasonal',
    styles: ['Floral', 'French'],
    lengths: ['Medium'],
    isPromotional: true,
    promotionalPrice: 33.99
  },
  {
    id: '9',
    name: 'Ocean Waves',
    description: 'Mesmerizing blue ombré with wave-like patterns',
    price: 35.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Artistic',
    styles: ['Abstract', 'Metallic'],
    lengths: ['Long', 'Extra Long'],
    isPromotional: false
  },
  {
    id: '10',
    name: 'Golden Hour',
    description: 'Warm golden tones with subtle shimmer',
    price: 37.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Glamour',
    styles: ['Metallic', 'Minimalist'],
    lengths: ['Medium', 'Long'],
    isPromotional: true,
    promotionalPrice: 32.99
  },
  {
    id: '11',
    name: 'Winter Frost',
    description: 'Icy blue and silver with snowflake accents',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Seasonal',
    styles: ['Glitter', 'Geometric'],
    lengths: ['Medium'],
    isPromotional: false
  },
  {
    id: '12',
    name: 'Neon Dreams',
    description: 'Bold neon accents on a dark base',
    price: 41.99,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    category: 'Artistic',
    styles: ['Abstract', 'Geometric'],
    lengths: ['Long', 'Extra Long'],
    isPromotional: true,
    promotionalPrice: 36.99
  }
];

export async function fetchNailDesigns(): Promise<NailDesign[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDesigns), 1000);
  });
}