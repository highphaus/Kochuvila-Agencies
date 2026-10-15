'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Package,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';
import SearchAutocomplete from './SearchAutocomplete';
import AuthModal from './AuthModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle escape key to close search or dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FDFDFD] shadow-2xs transition-all duration-200 border-b border-[#E2EBF2]/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6" ref={searchContainerRef}>
          {/* Main Single-Line Navbar Row across all devices */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
            {/* 1. Brand Logo */}
            <div className="flex-shrink-0">
              <Logo isLight={false} />
            </div>

            {/* 2. Desktop Search Input Bar (centered, hidden on mobile < md) */}
            <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8">
              <SearchAutocomplete />
            </div>

            {/* 3. Action Icons: Search -> Cart -> Wishlist -> Profile (Profile shifted to right side) */}
            <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
              {/* 1. Search Icon Trigger button (on smaller devices < md) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center md:hidden ${
                  isSearchOpen
                    ? 'text-[#0097F3] bg-[#EBF6FC] shadow-2xs'
                    : 'text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC]'
                }`}
                title={isSearchOpen ? 'Close Search' : 'Search Products'}
                aria-label={isSearchOpen ? 'Close Search' : 'Search Products'}
              >
                {isSearchOpen ? (
                  <X className="w-5 h-5 text-[#0097F3]" />
                ) : (
                  <Search className="w-5 h-5 text-[#1E293B]" />
                )}
              </button>

              {/* 2. Cart Icon with Live Count */}
              <Link
                href="/cart"
                className="p-2 sm:p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 relative cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* 3. Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 sm:p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 relative cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                title="My Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* 4. Account Dropdown / Profile / Sign In (On the right side) */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 p-1 sm:p-1.5 rounded-full hover:bg-[#EBF6FC] transition-colors cursor-pointer min-w-[38px] min-h-[38px] justify-center"
                    title="Account Menu"
                    aria-label="Account Menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0097F3] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:block" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-slate-800 hover:text-[#0097F3] bg-slate-50 hover:bg-[#EBF6FC] border border-[#E2EBF2] transition-all duration-200 cursor-pointer text-xs sm:text-sm font-bold shadow-2xs min-h-[38px]"
                    title="Sign In / Register"
                    aria-label="Sign In"
                  >
                    <User className="w-4 h-4 text-[#0097F3]" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}

                {/* User Dropdown Menu */}
                {user && userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2EBF2] py-2 z-50 text-xs animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#E2EBF2]">
                      <p className="font-bold text-[#000000] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#1E293B] hover:bg-[#EBF6FC] hover:text-[#0097F3] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#0097F3]" />
                      <span>My Profile &amp; Addresses</span>
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#1E293B] hover:bg-[#EBF6FC] hover:text-[#0097F3] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#0097F3]" />
                      <span>Order History</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#1E293B] hover:bg-[#EBF6FC] hover:text-[#0097F3] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#0097F3]" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[#0097F3] font-semibold hover:bg-[#EBF6FC] transition-colors border-t border-[#E2EBF2]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#0097F3]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left transition-colors border-t border-[#E2EBF2] cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Mobile Search Box (only visible when search icon in navbar is tapped) */}
          {isSearchOpen && (
            <div className="block md:hidden pb-3 pt-1 border-t border-[#E2EBF2]/80 animate-fade-in">
              <SearchAutocomplete
                isMobile
                autoFocus
                onCloseMobile={() => setIsSearchOpen(false)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
