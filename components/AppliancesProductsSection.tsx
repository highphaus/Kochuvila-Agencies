'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Wrench, CreditCard } from 'lucide-react';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sample-data';
import ProductCard from './ProductCard';

interface AppliancesProductsSectionProps {
  products?: Product[];
}

export default function AppliancesProductsSection({ products }: AppliancesProductsSectionProps) {
  const [activeSubcat, setActiveSubcat] = useState<
    'all' | 'refrigerators' | 'televisions' | 'washing-machines' | 'air-conditioners' | 'kitchen-appliances'
  >('all');

  // Fallback to sample appliance products if not supplied or empty
  const allAppliances = useMemo(() => {
    const list = products && products.length > 0 ? products : SAMPLE_PRODUCTS;
    const items = list.filter((p) => p.category.toLowerCase() === 'appliances');
    return [...items].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeSubcat === 'all') return allAppliances.slice(0, 5);
    return allAppliances
      .filter((p) => p.subcategory.toLowerCase() === activeSubcat)
      .slice(0, 5);
  }, [allAppliances, activeSubcat]);

  const displayList = filteredProducts.length > 0 ? filteredProducts : allAppliances.slice(0, 5);

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header & Subcategory Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2EBF2] mb-8">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue border border-brand-lightBlue/60 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Authorized Brand Partner</span>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <span className="text-[11px] font-semibold text-slate-600 lowercase">official warranty</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Smart Home Appliances &amp; Electronics
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Energy-efficient 5-Star inverter refrigerators, 4K OLED Smart TVs, front-load washers, and split inverter air conditioners from world-leading brands.
            </p>
          </div>

          {/* Subcategory Filter Tabs with touch-friendly horizontal scroll */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold overflow-x-auto scrollbar-none pb-1 max-w-full flex-nowrap sm:flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSubcat('all')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'all'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              All Appliances
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('refrigerators')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'refrigerators'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              Refrigerators
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('televisions')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'televisions'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              4K Smart TVs
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('washing-machines')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'washing-machines'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              Washing Machines
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('air-conditioners')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'air-conditioners'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              Air Conditioners
            </button>
            <button
              type="button"
              onClick={() => setActiveSubcat('kitchen-appliances')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 min-h-[38px] ${
                activeSubcat === 'kitchen-appliances'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              Kitchen
            </button>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-4.5">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Authorized Dealer & Service Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Inverter Tech</p>
              <p className="text-[11px] text-slate-500">Up to 50% power savings</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Official Warranty</p>
              <p className="text-[11px] text-slate-500">Authorized brand support</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Free In-Home Demo</p>
              <p className="text-[11px] text-slate-500">Certified brand engineers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">0% Paperless EMI</p>
              <p className="text-[11px] text-slate-500">5-min instant approval</p>
            </div>
          </div>
        </div>

        {/* View All Appliances CTA */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <Link
            href="/appliances"
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#0097F3]/25 hover:shadow-xl hover:shadow-[#0097F3]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Explore Complete Appliances Collection</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-white/30 transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
