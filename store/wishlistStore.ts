'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const exists = get().items.some((item) => item._id === product._id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((item) => item._id !== product._id),
          }));
          return false;
        } else {
          set((state) => ({
            items: [...state.items, product],
          }));
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'kochuvila_wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
