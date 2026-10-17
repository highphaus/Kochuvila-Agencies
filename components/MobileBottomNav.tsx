'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import SearchAutocomplete from './SearchAutocomplete';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);

  // Close search drawer when route changes
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile search modal is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Hide on admin routes, checkout, or single product pages (which have dedicated sticky purchase bars)
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/product/')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isCartActive = pathname === '/cart';
  const isAccountActive = pathname === '/account' || pathname === '/login';

  return (
    <>
      {/* Mobile Search Overlay Modal */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-fade-in">
          <div className="bg-white rounded-b-3xl shadow-2xl p-4 sm:p-5 border-b border-[#E2EBF2] safe-top flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBF2] mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0097F3]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Search Appliances &amp; Furniture
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Close Search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-1 pb-2">
              <SearchAutocomplete
                isMobile
                autoFocus
                onCloseMobile={() => setSearchOpen(false)}
              />
            </div>
          </div>

          {/* Clickable backdrop area to dismiss */}
          <div
            className="flex-1"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Persistent Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EBF2] py-1.5 px-3 shadow-lg safe-bottom">
        <nav className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition-all relative ${
              isHomeActive
                ? 'text-[#0097F3] font-bold'
                : 'text-slate-600 hover:text-black font-medium'
            }`}
          >
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
            {isHomeActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0097F3] mt-0.5" />}
          </Link>

          {/* 2. Search Button (Prominent Action) */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open Search"
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition-all relative ${
              searchOpen
                ? 'text-[#0097F3] font-bold'
                : 'text-slate-600 hover:text-[#0097F3] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-colors ${searchOpen ? 'bg-[#EBF6FC] text-[#0097F3]' : 'hover:bg-slate-100'}`}>
              <Search className={`w-5 h-5 ${searchOpen ? 'stroke-[2.5px] text-[#0097F3]' : 'stroke-2'}`} />
            </div>
            <span className="text-[10px] tracking-tight">Search</span>
            {searchOpen && <span className="w-1.5 h-1.5 rounded-full bg-[#0097F3] mt-0.5" />}
          </button>

          {/* 4. Cart */}
          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition-all relative ${
              isCartActive
                ? 'text-[#0097F3] font-bold'
                : 'text-slate-600 hover:text-black font-medium'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 ${isCartActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-[#0097F3] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Cart</span>
            {isCartActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0097F3] mt-0.5" />}
          </Link>

          {/* 5. Account */}
          <Link
            href="/account"
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition-all relative ${
              isAccountActive
                ? 'text-[#0097F3] font-bold'
                : 'text-slate-600 hover:text-black font-medium'
            }`}
          >
            <div className="relative">
              {user ? (
                <div className="w-5 h-5 rounded-full bg-[#0097F3] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              ) : (
                <User className={`w-5 h-5 ${isAccountActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {user ? 'Profile' : 'Sign In'}
            </span>
            {isAccountActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0097F3] mt-0.5" />}
          </Link>
        </nav>
      </div>
    </>
  );
}
