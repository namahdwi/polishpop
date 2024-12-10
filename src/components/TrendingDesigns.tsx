import { Star } from 'lucide-react';

const trendingDesigns = [
  {
    id: '1',
    name: 'Crystal Dreams',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    price: 29.99,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Pink Paradise',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    price: 34.99,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Glitter Galaxy',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
    price: 39.99,
    rating: 5.0
  }
];

export default function TrendingDesigns() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#89331F] text-center mb-12">
          Trending Designs
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingDesigns.map((design) => (
            <div 
              key={design.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{design.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white ml-1">{design.rating}</span>
                    </div>
                  </div>
                  <span className="text-white font-semibold">${design.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}