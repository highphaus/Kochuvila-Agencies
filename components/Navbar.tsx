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
        ========================================================================
        1. MOBILE PHONE HEADER (Amazon-inspired 4-row structure):
        - Row 1: Brand logo + Account/Sign-In + Wishlist + Cart with live badge
        - Row 2: Prominent Search bar with live autocomplete
        - Row 3: Compact Kerala delivery location strip
        - Row 4: Horizontal scroll category discovery shortcut rail
        ========================================================================
      */}
      <header className="block md:hidden bg-white border-b border-[#E2EBF2] shadow-2xs safe-top select-none sticky top-0 z-40">
        {/* Row 1: Top brand row */}
        <div className="flex items-center justify-between px-3 h-12 bg-white border-b border-slate-100">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 focus:outline-none">
            <div className="w-7 h-7 relative shrink-0">
              <Image
                src="/Logo/kochuvila-logo.png"
                alt="Kochuvila Agencies"
                width={28}
                height={28}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-950 leading-none">
                KOCHUVILA
              </span>
              <span className="text-[9px] font-bold text-[#0097F3] uppercase tracking-wider leading-none mt-0.5">
                Agencies
              </span>
            </div>
          </Link>

          {/* Top Row Right Actions: Wishlist + User Account/Sign In + Cart */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-1.5 text-slate-700 hover:text-[#0097F3] relative rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Sign In */}
            {user ? (
              <Link
                href="/account"
                className="p-1.5 text-slate-700 hover:text-[#0097F3] rounded-full hover:bg-slate-100 transition-colors"
                aria-label="My Account"
              >
                <User className="w-5 h-5 stroke-[2]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-2 py-1 text-[11px] font-bold text-slate-800 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                aria-label="Sign In"
              >
                Sign In
              </button>
            )}

            {/* Shopping Cart with live badge */}
            <Link
              href="/cart"
              className="p-1.5 text-slate-800 hover:text-[#0097F3] relative rounded-full hover:bg-slate-100 transition-colors flex items-center"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-0 right-0 bg-[#F59E0B] text-slate-950 text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-2xs">
                {cartItemCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Row 2: Prominent Search Bar */}
        <div className="px-3 py-1.5 bg-white">
          <SearchAutocomplete isMobile />
        </div>

        {/* Row 3: Compact Kerala Delivery Location Strip */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#EBF6FC] text-[#007185] text-[11px] font-medium border-y border-[#D6EBF8]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#007185] shrink-0" />
            <span className="truncate">Deliver to Kerala - 695609 (Showroom Dispatch)</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 shrink-0">Free Unboxing</span>
        </div>

        {/* Row 4: Category Discovery Shortcut Row */}
        <div className="bg-[#FAFBFD] px-2.5 py-2 overflow-x-auto scrollbar-none flex items-center gap-2.5">
          {MOBILE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = pathname === cat.href || pathname.startsWith(cat.href);
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center justify-center shrink-0 group focus:outline-none"
              >
                <div
                  className={`w-11 h-11 rounded-full border shadow-2xs flex items-center justify-center transition-transform active:scale-95 ${cat.bg} ${
                    isSelected ? 'ring-2 ring-[#0097F3] ring-offset-1 scale-105' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2px]" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold tracking-tight text-center truncate max-w-[56px] leading-tight ${
                    isSelected ? 'text-[#0097F3] font-bold' : 'text-slate-700'
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
