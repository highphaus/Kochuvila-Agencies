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
            <h2 className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-black text-black font-display uppercase tracking-tight whitespace-nowrap">
              Handcrafted Home Furniture
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Premium handcrafted living room sofas, hydraulic storage beds, dining suites, and orthopaedic mattresses built to last for generations.
            </p>
          </div>

          {/* Subcategory Filter Tabs with touch-friendly horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 max-w-full text-xs sm:text-sm font-bold flex-nowrap sm:flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSubcat('all')}
              className={`px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
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
              className={`px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
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
              className={`px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
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
              className={`px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'dining'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Dining Sets
            </button>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-4.5">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>


        {/* Desktop / Tablet: Static 4-column grid */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Master Carpentry</p>
              <p className="text-[11px] text-slate-500">Handcrafted precision</p>
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
            className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white font-bold text-xs tracking-normal shadow-md shadow-[#0097F3]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Explore Furniture</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-all duration-200">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
