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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close mobile drawer and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Clean MNC Navigation Links available in slide-out menu
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Furniture', href: '/furniture' },
    { label: 'Our Brands', href: '/brands' },
    { label: 'All Products', href: '/products' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FDFDFD] border-b border-[#E2EBF2] shadow-xs transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* 1. Brand Logo */}
            <Logo isLight={false} />

            {/* 2. Right Action Icons (Search, User, Wishlist, Cart, Menu) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Toggle Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  searchOpen
                    ? 'text-[#0097F3] bg-[#EBF6FC]'
                    : 'text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC]'
                }`}
                aria-label="Search products"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#EBF6FC] transition-colors cursor-pointer"
                    title="Account Menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0097F3] text-white flex items-center justify-center text-xs font-bold shadow-xs">
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
                    className="p-2 sm:p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 cursor-pointer"
                    title="Sign In / Register"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}

                {/* User Dropdown Menu */}
                {user && userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2EBF2] py-2 z-50 text-xs">
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
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left transition-colors border-t border-[#E2EBF2] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 sm:p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 relative cursor-pointer"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Live Count */}
              <Link
                href="/cart"
                className="p-2 sm:p-2.5 rounded-full text-[#1E293B] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 relative cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-[#0097F3] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              </Link>

              {/* Menu Toggle Button (MNC Style) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[#000000] hover:text-[#0097F3] hover:bg-[#EBF6FC] transition-all duration-200 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">Menu</span>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Expandable Search Input */}
          {searchOpen && (
            <div className="pb-4 pt-1 animate-fade-in">
              <div className="relative max-w-2xl mx-auto bg-white rounded-2xl p-2 border border-[#E2EBF2] shadow-xl">
                <SearchAutocomplete autoFocus />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FDFDFD] shadow-2xl flex flex-col z-50 animate-fade-in border-l border-[#E2EBF2]">
            <div className="p-4 border-b border-[#E2EBF2] flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#64748B] hover:text-[#0097F3] rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search Bar inside menu */}
            <div className="p-4 border-b border-[#E2EBF2] bg-[#EBF6FC]/60">
              <SearchAutocomplete isMobile />
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#017ED0] px-3 mb-2">
                Navigation
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#EBF6FC] text-[#0097F3] font-bold'
                      : 'text-[#1E293B] hover:bg-[#EBF6FC]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Drawer Footer Auth */}
            <div className="p-4 border-t border-[#E2EBF2] bg-[#FDFDFD]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0097F3] text-white flex items-center justify-center font-bold text-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#000000]">{user.name}</p>
                      <p className="text-[10px] text-[#64748B]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#0097F3] text-white text-xs font-bold hover:bg-[#017ED0] transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
