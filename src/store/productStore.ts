// src/store/productStore.ts
import { create } from 'zustand';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import type { NailDesign } from '../types/product';

interface ProductState {
  products: NailDesign[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Partial<NailDesign>, images: File[]) => Promise<void>;
  updateProduct: (id: string, updates: Partial<NailDesign>, newImages?: File[]) => Promise<void>;
  deleteProduct: (id: string, imageUrls: string[]) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NailDesign[];
      set({ products });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to fetch products');
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (product: Partial<NailDesign>, images: File[]) => {
    try {
      set({ loading: true, error: null });
      
      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
          const snapshot = await uploadBytes(storageRef, image);
          return getDownloadURL(snapshot.ref);
        })
      );

      // Create product document
      const newProduct = {
        ...product,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'products'), newProduct);
      await get().fetchProducts();
      toast.success('Product created successfully');
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to create product');
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: string, updates: Partial<NailDesign>, newImages?: File[]) => {
    try {
      set({ loading: true, error: null });
      
      let imageUrls = updates.images || [];

      if (newImages?.length) {
        // Upload new images
        const newImageUrls = await Promise.all(
          newImages.map(async (image) => {
            const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            return getDownloadURL(snapshot.ref);
          })
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      await updateDoc(doc(db, 'products', id), {
        ...updates,
        images: imageUrls,
        updatedAt: new Date()
      });

      await get().fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to update product');
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: string, imageUrls: string[]) => {
    try {
      set({ loading: true, error: null });

      // Delete images from storage
      await Promise.all(
        imageUrls.map(async (url) => {
          const storageRef = ref(storage, url);
          await deleteObject(storageRef);
        })
      );

      // Delete product document
      await deleteDoc(doc(db, 'products', id));
      await get().fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to delete product');
    } finally {
      set({ loading: false });
    }
  }
}));