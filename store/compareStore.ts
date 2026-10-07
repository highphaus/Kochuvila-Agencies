'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

interface CompareState {
  items: Product[];
  addToCompare: (product: Product) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCompare: (product) => {
        const { items } = get();
        if (items.some((item) => item._id === product._id)) {
          return { success: false, message: 'Item is already in comparison' };
        }
        if (items.length >= 4) {
          return { success: false, message: 'You can compare up to 4 items at a time' };
        }
        // If there's an existing item, warn if comparing completely different categories (e.g. bed vs fridge)
        if (items.length > 0 && items[0].category !== product.category) {
          return {
            success: false,
            message: `Please compare products from the same category (${items[0].category})`,
          };
        }
        set({ items: [...items, product] });
        return { success: true, message: 'Added to comparison' };
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      isInCompare: (productId) => {
        return get().items.some((item) => item._id === productId);
      },

      clearCompare: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'kochuvila_compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
