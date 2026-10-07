'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'appliances' | 'furniture'>('all');

  const displayedCategories = categories.filter((c) => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  return (
    <section className="py-8 sm:py-12 bg-[#F5F7F9]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
              Shop By Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Genuine home electronics and handcrafted teakwood furniture designed for Kerala households.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-brand-border shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setActiveTab('appliances')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'appliances'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Appliances
            </button>
            <button
              onClick={() => setActiveTab('furniture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'furniture'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Furniture
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {displayedCategories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat.type}&subcategory=${cat.slug}`}
              className="group bg-white rounded-2xl p-3.5 border border-brand-border hover:border-brand-primary transition-all duration-200 flex flex-col items-center text-center shadow-card hover:shadow-cardHover"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F5F7F9] p-2 flex items-center justify-center mb-2.5 overflow-hidden border border-brand-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-xs sm:text-sm text-black group-hover:text-brand-primary transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="mt-1 text-[11px] font-semibold text-brand-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
