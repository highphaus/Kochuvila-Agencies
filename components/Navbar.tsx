'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Phone,
  Clock,
  Menu,
  X,
  MapPin,
  User,
  Truck,
  Sparkles,
  Flame,
  ShieldCheck,
  Package,
  Scale,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { formatINR } from '@/lib/utils';
import Logo from './Logo';
import SearchAutocomplete from './SearchAutocomplete';
import AuthModal from './AuthModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);


  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs transition-all duration-200">


      {/* Main navigation area */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo with exact brand icon */}
          <Logo />

          {/* Search bar desktop with predictive autocomplete, trending, recent searches & live product previews */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6 relative">
            <SearchAutocomplete />
          </div>

          {/* Action buttons: Deals, Wishlist, Cart, Contact */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/products?isDeal=true"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold rounded-full border border-brand-lightBlue hover:bg-brand-lightBlue/30 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
              <span>Offers & Deals</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-slate-700 hover:text-brand-primary transition-colors relative"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Login & Sign Up or Authenticated User */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-lightBlueSoft border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                  title="Customer Account & Orders"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors px-1"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 hover:text-brand-primary rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 shadow-xs group"
                title="Login or Create an Account"
              >
                <User className="w-3.5 h-3.5 text-brand-primary group-hover:scale-110 transition-transform" />
                <span>Login / Sign Up</span>
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 p-1.5 sm:px-3.5 sm:py-2 bg-brand-primary text-white rounded-full hover:bg-brand-deepBlue transition-all shadow-button group"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-brand-deepBlue text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold pr-1">
                {cartSubtotal > 0 ? formatINR(cartSubtotal) : 'Cart'}
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-800 hover:text-brand-primary transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with autocomplete and touch-friendly popover */}
        <div className="mt-3 md:hidden relative">
          <SearchAutocomplete isMobile />
        </div>
      </div>

      {/* Category Navigation Bar Desktop - Shown only on non-home pages (on home page it is positioned under the Hero section) */}
      {!isHome && (
        <nav className="hidden md:block bg-[#f8fbfe] border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 overflow-x-auto py-2.5">
              <div className="flex items-center gap-6">
                <Link
                  href="/products"
                  className="hover:text-brand-primary font-bold text-brand-dark transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  All Products
                </Link>
                <Link
                  href="/products?category=appliances"
                  className="hover:text-brand-primary transition-colors"
                >
                  Home Appliances
                </Link>
                <Link
                  href="/products?category=appliances&subcategory=refrigerators"
                  className="hover:text-brand-primary transition-colors"
                >
                  Refrigerators
                </Link>
                <Link
                  href="/products?category=appliances&subcategory=washing-machines"
                  className="hover:text-brand-primary transition-colors"
                >
                  Washing Machines
                </Link>
                <Link
                  href="/products?category=appliances&subcategory=televisions"
                  className="hover:text-brand-primary transition-colors"
                >
                  Smart TVs
                </Link>
                <Link
                  href="/products?category=appliances&subcategory=air-conditioners"
                  className="hover:text-brand-primary transition-colors"
                >
                  Air Conditioners
                </Link>
                <Link
                  href="/products?category=furniture"
                  className="hover:text-brand-primary transition-colors font-bold text-slate-800"
                >
                  Furniture
                </Link>
                <Link
                  href="/products?category=furniture&subcategory=sofas"
                  className="hover:text-brand-primary transition-colors"
                >
                  Sofas & Living
                </Link>
                <Link
                  href="/products?category=furniture&subcategory=beds"
                  className="hover:text-brand-primary transition-colors"
                >
                  Beds & Mattresses
                </Link>
                <Link
                  href="/products?category=furniture&subcategory=dining"
                  className="hover:text-brand-primary transition-colors"
                >
                  Dining Sets
                </Link>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <Link
                  href="/compare"
                  className="text-slate-600 hover:text-brand-primary font-bold flex items-center gap-1 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Compare</span>
                </Link>

                <Link
                  href="/contact"
                  className="text-brand-primary hover:text-brand-primaryHover font-bold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                  Visit Showroom
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-border py-4 px-6 space-y-4 animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-2 border-b border-brand-border pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-brand-lightBlueSoft font-bold text-brand-deepBlue"
              >
                All Catalog
              </Link>
              <Link
                href="/products?isDeal=true"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-brand-lightBlueSoft text-brand-primary font-bold flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
                <span>Today's Deals</span>
              </Link>
              <Link
                href="/products?category=appliances"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 font-semibold"
              >
                All Appliances
              </Link>
              <Link
                href="/products?category=furniture"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 font-semibold"
              >
                All Furniture
              </Link>
              <Link
                href="/products?category=appliances&subcategory=refrigerators"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Refrigerators
              </Link>
              <Link
                href="/products?category=appliances&subcategory=washing-machines"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Washing Machines
              </Link>
              <Link
                href="/products?category=appliances&subcategory=televisions"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Smart TVs
              </Link>
              <Link
                href="/products?category=appliances&subcategory=air-conditioners"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Air Conditioners
              </Link>
              <Link
                href="/products?category=furniture&subcategory=sofas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Sofas & Living
              </Link>
              <Link
                href="/products?category=furniture&subcategory=beds"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-slate-50 text-slate-600"
              >
                Beds & Mattresses
              </Link>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs font-semibold">
            {/* Mobile Auth buttons */}
            {user ? (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black text-center shadow-xs hover:bg-brand-primaryHover flex items-center justify-center gap-2 mb-3"
              >
                <User className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </button>
            )}

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-800 py-1"
            >
              <User className="w-4 h-4 text-brand-primary" />
              <span>My Account & Orders</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-800 py-1"
            >
              <Heart className="w-4 h-4 text-brand-primary" />
              <span>My Wishlist ({wishlistCount})</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-800 py-1"
            >
              <Scale className="w-4 h-4 text-brand-primary" />
              <span>Compare Products</span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-700 py-1"
            >
              <Truck className="w-4 h-4 text-brand-primary" />
              Track Your Order
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-700 py-1"
            >
              <MapPin className="w-4 h-4 text-brand-primary" />
              Showroom Location & Timings
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-brand-primary font-bold py-1"
            >
              <User className="w-4 h-4 text-brand-primary" />
              Admin Portal
            </Link>
            <a
              href="tel:+919447023456"
              className="flex items-center gap-2 text-brand-deepBlue font-bold py-1"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>Showroom Helpline: +91 94470 23456</span>
            </a>
          </div>
        </div>
      )}

      {/* Interactive Login & Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}
