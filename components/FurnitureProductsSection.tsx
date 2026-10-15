'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Hammer, Truck, Ruler } from 'lucide-react';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sample-data';
import ProductCard from './ProductCard';

interface FurnitureProductsSectionProps {
  products?: Product[];
}

export default function FurnitureProductsSection({ products }: FurnitureProductsSectionProps) {
  const [activeSubcat, setActiveSubcat] = useState<'all' | 'sofas' | 'beds' | 'dining'>('all');

  // Fallback to sample furniture products if not supplied or empty
  const allFurniture = useMemo(() => {
    const list = products && products.length > 0 ? products : SAMPLE_PRODUCTS;
    const items = list.filter((p) => p.category.toLowerCase() === 'furniture');
    return [...items].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeSubcat === 'all') return allFurniture.slice(0, 5);
    return allFurniture
      .filter((p) => p.subcategory.toLowerCase() === activeSubcat)
      .slice(0, 5);
  }, [allFurniture, activeSubcat]);

  const displayList = filteredProducts.length > 0 ? filteredProducts : allFurniture.slice(0, 5);

  return (
    <section className="py-12 sm:py-16 bg-[#FDFDFD] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header & Subcategory Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2EBF2] mb-8">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Solid Wood &amp; Teak Living</span>
              <span className="w-1 h-1 rounded-full bg-amber-600" />
              <span className="text-[11px] font-semibold text-amber-700 lowercase">heirloom quality</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Handcrafted Teak &amp; Home Furniture
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Seasoned Nilambur &amp; Malabar teak sofas, hydraulic storage beds, dining suites, and orthopaedic mattresses built to last for generations.
            </p>
          </div>

          {/* Subcategory Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveSubcat('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubcat === 'all'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Furniture
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('sofas')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubcat === 'sofas'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Living &amp; Sofas
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('beds')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubcat === 'beds'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Beds &amp; Mattresses
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('dining')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubcat === 'dining'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Dining Sets
            </button>
          </div>
        </div>

        {/* 5-Column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Craftsmanship & Guarantee Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">100% Solid Teak</p>
              <p className="text-[11px] text-slate-500">Seasoned Malabar timber</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">5-Yr Wood Warranty</p>
              <p className="text-[11px] text-slate-500">Anti-termite guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Custom Sizing</p>
              <p className="text-[11px] text-slate-500">Tailored to your floor plan</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Free Setup &amp; Delivery</p>
              <p className="text-[11px] text-slate-500">Direct to your room in Kerala</p>
            </div>
          </div>
        </div>

        {/* View All Furniture CTA */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <Link
            href="/furniture"
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#0097F3]/25 hover:shadow-xl hover:shadow-[#0097F3]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Explore Complete Furniture Collection</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-white/30 transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
