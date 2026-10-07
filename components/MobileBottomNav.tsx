'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());

  // Hide on admin routes or checkout to keep checkout distraction-free
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home, isActive: pathname === '/' },
    {
      label: 'Shop',
      href: '/products',
      icon: Grid,
      isActive: pathname.startsWith('/products') && pathname !== '/wishlist' && pathname !== '/account',
    },
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      badge: wishlistCount,
      isActive: pathname === '/wishlist',
    },
    {
      label: 'Account',
      href: '/account',
      icon: User,
      isActive: pathname === '/account',
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: cartCount,
      isActive: pathname === '/cart',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-brand-border py-2 px-4 shadow-elevated safe-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all relative ${
                active
                  ? 'text-brand-primary font-bold'
                  : 'text-slate-600 hover:text-black font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-brand-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
