'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  coupon: Coupon | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon, discountAmount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getMrpTotal: () => number;
  getSavings: () => number;
  getDeliveryCharge: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      coupon: null,
      couponDiscount: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product._id === product._id
          );
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = Math.min(
              product.stock,
              updatedItems[existingIndex].quantity + quantity
            );
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems };
          } else {
            return {
              items: [
                ...state.items,
                { product, quantity: Math.min(product.stock, quantity) },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId
              ? {
                  ...item,
                  quantity: Math.min(item.product.stock, quantity),
                }
              : item
          ),
        }));
      },

      saveForLater: (productId) => {
        set((state) => {
          const itemToSave = state.items.find((i) => i.product._id === productId);
          if (!itemToSave) return state;
          return {
            items: state.items.filter((i) => i.product._id !== productId),
            savedItems: [...state.savedItems.filter((i) => i.product._id !== productId), itemToSave],
          };
        });
      },

      moveToCart: (productId) => {
        set((state) => {
          const itemToMove = state.savedItems.find((i) => i.product._id === productId);
          if (!itemToMove) return state;
          return {
            savedItems: state.savedItems.filter((i) => i.product._id !== productId),
            items: [...state.items.filter((i) => i.product._id !== productId), itemToMove],
          };
        });
      },

      removeSavedItem: (productId) => {
        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.product._id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null, couponDiscount: 0 });
      },


      applyCoupon: (coupon, discountAmount) => {
        set({ coupon, couponDiscount: discountAmount });
      },

      removeCoupon: () => {
        set({ coupon: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getMrpTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.mrp * item.quantity,
          0
        );
      },

      getSavings: () => {
        const mrpTotal = get().getMrpTotal();
        const subtotal = get().getSubtotal();
        const couponDisc = get().couponDiscount;
        return Math.max(0, mrpTotal - subtotal + couponDisc);
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free delivery on orders above ₹2000
        return subtotal >= 2000 ? 0 : 150;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryCharge();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal - discount + delivery);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'kochuvila_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
