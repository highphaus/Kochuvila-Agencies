'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Scale, ArrowRight } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';

export default function CompareDrawer() {
  const pathname = usePathname();
  const items = useCompareStore((state) => state.items);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  // Don't show drawer if already on compare page or no items
  if (items.length === 0 || pathname === '/compare') {
    return null;
  }

  return (
    <div className="fixed bottom-14 md:bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-border shadow-2xl p-3 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 pl-1 pr-2 text-xs font-black uppercase tracking-wider text-brand-deepBlue shrink-0">
            <Scale className="w-4 h-4 text-brand-primary" />
            <span className="hidden sm:inline">Compare</span>
            <span>({items.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="relative w-10 h-10 rounded-xl bg-slate-50 border border-brand-border p-1 shrink-0 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => removeFromCompare(item._id)}
                  aria-label="Remove item"
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors shadow-xs"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] font-semibold text-slate-400 hover:text-black px-2 py-1 transition-colors"
          >
            Clear
          </button>

          <Link
            href="/compare"
            className="px-4 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl transition-all shadow-button flex items-center gap-1.5 active:scale-95"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
