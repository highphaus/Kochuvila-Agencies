'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'appliances' | 'furniture'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'appliances')
      return p.category?.toLowerCase().includes('appliance') || p.category?.toLowerCase() === 'appliances';
    if (activeTab === 'furniture')
      return p.category?.toLowerCase().includes('furniture') || p.category?.toLowerCase() === 'furniture';
    return true;
  });

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Handpicked Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Featured For Your Home
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Popular picks for everyday living. Genuine brand electronics and handcrafted solid teakwood furniture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#F5F7F9] p-1 rounded-xl border border-brand-border">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                All Featured
              </button>
              <button
                onClick={() => setActiveTab('appliances')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'appliances'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Appliances
              </button>
              <button
                onClick={() => setActiveTab('furniture')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'furniture'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Furniture
              </button>
            </div>

            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-deepBlue hover:underline group"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#F5F7F9] text-brand-deepBlue border border-brand-border font-bold text-xs rounded-xl"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
