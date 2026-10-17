'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
  Package,
  LogOut,
  ChevronDown,
  ShieldCheck,
  MapPin,
  Phone,
  Zap,
  Armchair,
  Snowflake,
  Tv,
  WashingMachine,
  Wind,
  Bed,
  Utensils,
  Award,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';
import SearchAutocomplete from './SearchAutocomplete';
import AuthModal from './AuthModal';

// Mobile Amazon-style Category Discovery (Section 4)
const MOBILE_CATEGORIES = [
  {
    name: 'Appliances',
    href: '/appliances',
    icon: Zap,
    bg: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    name: 'Furniture',
    href: '/furniture',
    icon: Armchair,
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    name: 'Refrigerators',
    href: '/appliances?category=refrigerators',
    icon: Snowflake,
    bg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    name: 'Televisions',
    href: '/appliances?category=tvs',
    icon: Tv,
    bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    name: 'Washing Machines',
    href: '/appliances?category=washing-machines',
    icon: WashingMachine,
    bg: 'bg-sky-50 text-sky-600 border-sky-200',
  },
  {
    name: 'Air Conditioners',
    href: '/appliances?category=air-conditioners',
    icon: Wind,
    bg: 'bg-teal-50 text-teal-600 border-teal-200',
  },
  {
    name: 'Kitchen',
    href: '/appliances?category=kitchen-appliances',
    icon: Zap,
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    name: 'Sofas',
    href: '/furniture?category=living-room',
    icon: Armchair,
    bg: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    name: 'Beds & Mattresses',
    href: '/furniture?category=bedroom',
    icon: Bed,
    bg: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  {
    name: 'Tables & Chairs',
    href: '/furniture?category=dining',
    icon: Utensils,
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    name: 'Brands',
    href: '/brands',
    icon: Award,
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 
      {/* 
        ========================================================================
        1. FLIPKART-STYLE MOBILE HEADER (For smaller devices):
        - Flipkart signature blue top bar with official Kochuvila logo
        - Integrated white search bar with clean autocomplete
        - Trivandrum showroom location strip
        - Flipkart's iconic circular category tray with real icons & labels
        ========================================================================
      */}
      <header className="block md:hidden bg-[#0097F3] shadow-md safe-top select-none sticky top-0 z-40">
        {/* Top Brand Bar & Search Row */}
        <div className="px-3 pt-2.5 pb-2">
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Brand Title (Text only, no logo, no explore plus) */}
            <Link href="/" className="flex items-center group">
              <span className="font-extrabold text-white text-lg tracking-tight font-display leading-none">
                KOCHUVILA
              </span>
            </Link>

            {/* Helpline / Showroom Call */}
            <a
              href="tel:+919745111141"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold border border-white/20 active:scale-95 transition-transform"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Call Showroom</span>
            </a>
          </div>

          {/* Flipkart-style White Search Box */}
          <div className="relative">
            <SearchAutocomplete isMobile={true} />
          </div>
        </div>

        {/* Compact Trivandrum Showroom Location Strip */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0086D9] text-white/95 text-[11px] font-medium border-t border-white/10">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Deliver to Trivandrum 695609 (Showroom Dispatch)</span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 shrink-0">Showroom Store</span>
        </div>

        {/* Flipkart's Iconic Circular Category Tray */}
        <div className="bg-white border-b border-slate-200/90 px-2 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-3">
          {MOBILE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = pathname === cat.href || (cat.href !== '/' && pathname.startsWith(cat.href));
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center gap-1 shrink-0 group active:scale-95 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center p-2.5 transition-all shadow-2xs border ${
                    isSelected
                      ? 'bg-[#EBF6FC] border-[#0097F3] ring-2 ring-[#0097F3]/30 text-[#0097F3]'
                      : `${cat.bg} hover:border-[#0097F3]`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold text-center leading-tight truncate max-w-[62px] ${
                    isSelected ? 'text-[#0097F3]' : 'text-slate-800'
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* 
        ========================================================================
        2. DESKTOP / TABLET HEADER (Hidden on mobile phones, shown on md+):
        - Full enterprise mega-menu desktop navbar
        ========================================================================
      */}
      <header className="hidden md:block sticky top-0 z-50 bg-[#FDFDFD]/95 backdrop-blur-md shadow-2xs transition-all duration-200 border-b border-[#E2EBF2]/80 safe-top">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10" ref={searchContainerRef}>
          <div className="flex items-center justify-between h-16 md:h-20 gap-4 lg:gap-6">
            {/* 1. Brand Logo */}
            <div className="flex-shrink-0">
              <Logo isLight={false} />
            </div>

            {/* 2. Desktop Search Input Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <SearchAutocomplete />
            </div>

            {/* 3. Action Icons: Helpline -> Wishlist -> Cart -> Profile */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Showroom Helpline */}
              <a
                href="tel:+919745111141"
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-colors text-xs font-semibold"
              >
                <Phone className="w-4 h-4 text-[#0097F3]" />
                <span>+91 97451 11141</span>
              </a>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                title="My Wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                title="Shopping Cart"
                aria-label={`Shopping Cart with ${cartItemCount} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account / Profile / Sign In */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#EBF6FC] transition-colors min-w-[44px] min-h-[44px] justify-center active:scale-95"
                    title="Account Menu"
                    aria-label="Account Menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0097F3] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-slate-800 hover:text-[#0097F3] bg-slate-50 hover:bg-[#EBF6FC] border border-[#E2EBF2] transition-all text-xs font-bold shadow-2xs min-h-[44px] active:scale-95"
                    title="Sign In / Register"
                    aria-label="Sign In"
                  >
                    <User className="w-4 h-4 text-[#0097F3]" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Desktop User Dropdown Menu */}
                {user && userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#E2EBF2] py-2 z-50 text-xs animate-fade-in">
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
