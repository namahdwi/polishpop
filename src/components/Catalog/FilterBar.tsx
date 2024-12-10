import { Filter, X, Search, Sparkles } from 'lucide-react';
import { CATEGORIES, STYLES, LENGTHS } from '../../types';

interface Props {
  selectedCategory: string;
  selectedStyle: string;
  selectedLength: string;
  onCategoryChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onLengthChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  selectedCategory,
  selectedStyle,
  selectedLength,
  onCategoryChange,
  onStyleChange,
  onLengthChange,
  searchQuery,
  onSearchChange
}: Props) {
  const onClearFilters = () => {
    onCategoryChange('');
    onStyleChange('');
    onLengthChange('');
    onSearchChange('');
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-pink-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#FB85AC]" />
          <h3 className="font-semibold text-[#89331F]">Find Your Perfect Style</h3>
        </div>
        {(selectedCategory || selectedStyle || selectedLength || searchQuery) && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FB85AC] transition-all transform hover:scale-105"
          >
            <X className="w-4 h-4" />
            Start Fresh
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="✨ Search your dream design..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-pink-100 focus:border-[#FB85AC] focus:ring-[#FB85AC]/20 placeholder-gray-400 transition-all duration-300 hover:border-pink-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-300 group-hover:text-[#FB85AC] transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-600 mb-2 group-hover:text-[#FB85AC] transition-colors">
            Category
            <Sparkles className="w-4 h-4 inline-block ml-1 text-pink-300 group-hover:text-[#FB85AC]" />
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border-2 border-pink-100 py-2.5 pl-4 pr-10 focus:border-[#FB85AC] focus:ring-[#FB85AC]/20 hover:border-pink-200 transition-all duration-300 appearance-none bg-white cursor-pointer"
          >
            <option value="">Show me everything ✨</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category} 💅
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[38px] pointer-events-none text-pink-300 group-hover:text-[#FB85AC] transition-colors">
            ▼
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-600 mb-2 group-hover:text-[#FB85AC] transition-colors">
            Style
            <Sparkles className="w-4 h-4 inline-block ml-1 text-pink-300 group-hover:text-[#FB85AC]" />
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => onStyleChange(e.target.value)}
            className="w-full rounded-xl border-2 border-pink-100 py-2.5 pl-4 pr-10 focus:border-[#FB85AC] focus:ring-[#FB85AC]/20 hover:border-pink-200 transition-all duration-300 appearance-none bg-white cursor-pointer"
          >
            <option value="">Any style works ✨</option>
            {STYLES.map((style) => (
              <option key={style} value={style}>
                {style} 💖
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[38px] pointer-events-none text-pink-300 group-hover:text-[#FB85AC] transition-colors">
            ▼
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-600 mb-2 group-hover:text-[#FB85AC] transition-colors">
            Length
            <Sparkles className="w-4 h-4 inline-block ml-1 text-pink-300 group-hover:text-[#FB85AC]" />
          </label>
          <select
            value={selectedLength}
            onChange={(e) => onLengthChange(e.target.value)}
            className="w-full rounded-xl border-2 border-pink-100 py-2.5 pl-4 pr-10 focus:border-[#FB85AC] focus:ring-[#FB85AC]/20 hover:border-pink-200 transition-all duration-300 appearance-none bg-white cursor-pointer"
          >
            <option value="">Any length ✨</option>
            {LENGTHS.map((length) => (
              <option key={length} value={length}>
                {length} ✌️
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-[38px] pointer-events-none text-pink-300 group-hover:text-[#FB85AC] transition-colors">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}