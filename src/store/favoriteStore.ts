import { create } from 'zustand';
import { NailDesign } from '../types';

interface FavoriteStore {
  favorites: NailDesign[];
  addFavorite: (design: NailDesign) => void;
  removeFavorite: (designId: string) => void;
  isFavorite: (designId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  addFavorite: (design) => {
    set((state) => ({
      favorites: [...state.favorites, design]
    }));
  },
  removeFavorite: (designId) => {
    set((state) => ({
      favorites: state.favorites.filter((d) => d.id !== designId)
    }));
  },
  isFavorite: (designId) => {
    return get().favorites.some((d) => d.id === designId);
  }
})); 