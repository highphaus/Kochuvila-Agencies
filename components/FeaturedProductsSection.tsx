'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState<'best_sellers' | 'new_arrivals' | 'top_rated'>('best_sellers');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'best_sellers') return p.isFeatured || p.rating >= 4.7;
    if (activeTab === 'new_arrivals') return p.stock > 0;
    if (activeTab === 'top_rated') return p.rating >= 4.8;
    return true;
  }).slice(0, 5);

  const displayList = filteredProducts.length >= 4 ? filteredProducts : products.slice(0, 5);

  return (
    <section className="py-10 sm:py-14 bg-[#FDFDFD] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 border-b border-[#E2EBF2] pb-4">
          <div className="flex flex-wrap items-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] font-display">
              Featured Products
            </h2>

            {/* Tabs: Best Sellers | New Arrivals | Top Rated in 0097f3 */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('best_sellers')}
                className={`py-1 transition-colors relative ${
                  activeTab === 'best_sellers'
                    ? 'text-[#0097F3] font-bold'
                    : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                Best Sellers
                {activeTab === 'best_sellers' && (
                  <span className="absolute -bottom-[17px] left-0 w-full h-[2.5px] bg-[#0097F3] rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('new_arrivals')}
                className={`py-1 transition-colors relative ${
                  activeTab === 'new_arrivals'
                    ? 'text-[#0097F3] font-bold'
                    : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                New Arrivals
                {activeTab === 'new_arrivals' && (
                  <span className="absolute -bottom-[17px] left-0 w-full h-[2.5px] bg-[#0097F3] rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('top_rated')}
                className={`py-1 transition-colors relative ${
                  activeTab === 'top_rated'
                    ? 'text-[#0097F3] font-bold'
                    : 'text-[#64748B] hover:text-[#000000]'
                }`}
              >
                Top Rated
                {activeTab === 'top_rated' && (
                  <span className="absolute -bottom-[17px] left-0 w-full h-[2.5px] bg-[#0097F3] rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Explore More Products Showcase Button */}
        <div className="mt-8 sm:mt-12 pt-4 flex flex-col items-center justify-center text-center space-y-3">
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#0097F3]/25 hover:shadow-xl hover:shadow-[#0097F3]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Explore More Products</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-white/30 transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
          <p className="text-xs text-[#64748B] font-medium max-w-md">
            Browse our complete collection of 500+ premium home appliances &amp; handcrafted teak furniture with official Kerala warranty.
          </p>
        </div>
      </div>
    </section>
  );
}
