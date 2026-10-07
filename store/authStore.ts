'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserAddress } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  addAddress: (address: UserAddress) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateUser: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return {};
          const currentAddresses = state.user.addresses || [];
          const updated = [...currentAddresses, { ...address, _id: `addr-${Date.now()}` }];
          return {
            user: {
              ...state.user,
              addresses: updated,
            },
          };
        });
      },

      isAdmin: () => {
        return get().user?.role === 'admin';
      },
    }),
    {
      name: 'kochuvila_auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
