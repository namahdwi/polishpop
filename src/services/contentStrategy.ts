interface ContentStrategy {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
}

export const indonesianContentStrategy: Record<string, ContentStrategy> = {
  ramadan: {
    title: 'Koleksi Nail Art Lebaran',
    description: 'Tampil cantik di hari raya dengan nail art eksklusif',
    keywords: [
      'nail art lebaran',
      'kuku lebaran',
      'nail art idul fitri',
      'press on nails lebaran'
    ],
    hashtags: [
      '#PolishPopLebaran',
      '#KukuCantik',
      '#PolishPopIndonesia',
      '#MainailsLebaran'
    ]
  },
  wedding: {
    title: 'Nail Art Pengantin',
    description: 'Koleksi nail art spesial untuk hari pernikahan',
    keywords: [
      'nail art pengantin',
      'kuku pengantin',
      'wedding nails indonesia',
      'nail art akad nikah'
    ],
    hashtags: [
      '#PolishPopPengantin',
      '#WeddingNails',
      '#PengantinIndonesia',
      '#MainailsWedding'
    ]
  }
};

export function getLocalizedContent(category: string, city: string): ContentStrategy {
  const baseStrategy = indonesianContentStrategy[category];
  
  return {
    ...baseStrategy,
    title: `${baseStrategy.title} di ${city}`,
    keywords: [
      ...baseStrategy.keywords,
      `nail art ${city.toLowerCase()}`,
      `kuku palsu ${city.toLowerCase()}`,
      `press on nails ${city.toLowerCase()}`
    ],
    hashtags: [
      ...baseStrategy.hashtags,
      `#PolishPop${city}`,
      `#Mainails${city}`
    ]
  };
} 