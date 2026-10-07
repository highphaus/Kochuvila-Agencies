'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ArrowUpDown, Flame, Check, RotateCcw, ChevronRight } from 'lucide-react';
import { Category, Brand } from '@/types';

interface MobileFilterDrawerProps {
  categories: Category[];
  brands: Brand[];
  activeCategory?: string;
  activeSubcategory?: string;
  activeBrand?: string;
  activeMinPrice?: number;
  activeMaxPrice?: number;
  activeRating?: number;
  isDeal?: boolean;
  activeSort?: string;
  totalProducts: number;
}

export default function MobileFilterDrawer({
  categories,
  brands,
  activeCategory,
  activeSubcategory,
  activeBrand,
  activeMinPrice,
  activeMaxPrice,
  activeRating,
  isDeal,
  activeSort = 'newest',
  totalProducts,
}: MobileFilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Draft filter state for drawer
  const [category, setCategory] = useState<string | undefined>(activeCategory);
  const [subcategory, setSubcategory] = useState<string | undefined>(activeSubcategory);
  const [brand, setBrand] = useState<string | undefined>(activeBrand);
  const [priceRange, setPriceRange] = useState<string>(
    activeMinPrice && activeMaxPrice
      ? `${activeMinPrice}-${activeMaxPrice}`
      : activeMaxPrice
      ? `0-${activeMaxPrice}`
      : activeMinPrice
      ? `${activeMinPrice}-above`
      : 'all'
  );
  const [dealOnly, setDealOnly] = useState<boolean>(Boolean(isDeal));
  const [rating, setRating] = useState<number | undefined>(activeRating);

  const activeFilterCount = [
    category,
    subcategory,
    brand,
    priceRange !== 'all',
    dealOnly,
    rating,
  ].filter(Boolean).length;

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (brand) params.set('brand', brand);
    if (dealOnly) params.set('isDeal', 'true');
    if (rating) params.set('rating', String(rating));

    if (priceRange === '0-10000') {
      params.set('maxPrice', '10000');
    } else if (priceRange === '10000-25000') {
      params.set('minPrice', '10000');
      params.set('maxPrice', '25000');
    } else if (priceRange === '25000-50000') {
      params.set('minPrice', '25000');
      params.set('maxPrice', '50000');
    } else if (priceRange === '50000-above') {
      params.set('minPrice', '50000');
    }

    if (activeSort) params.set('sort', activeSort);

    setIsOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCategory(undefined);
    setSubcategory(undefined);
    setBrand(undefined);
    setPriceRange('all');
    setDealOnly(false);
    setRating(undefined);
    setIsOpen(false);
    router.push('/products');
  };

  const handleSelectSort = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortKey);
    setIsSortOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      {/* Sticky Mobile Filter & Sort Control Bar */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-white/95 backdrop-blur-md border-b border-brand-border py-2.5 px-4 shadow-2xs mb-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F5F7F9] hover:bg-brand-lightBlueSoft border border-brand-border text-slate-800 text-xs font-bold transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-brand-primary" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsSortOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F5F7F9] hover:bg-brand-lightBlueSoft border border-brand-border text-slate-800 text-xs font-bold transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-primary" />
            <span>Sort By</span>
          </button>
        </div>
      </div>

      {/* Sort Bottom Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 animate-slide-up max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-black text-sm text-brand-dark flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-brand-primary" />
                Sort Products
              </h3>
              <button
                onClick={() => setIsSortOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { key: 'newest', label: 'Featured / Newest Arrivals' },
                { key: 'price_asc', label: 'Price: Low to High' },
                { key: 'price_desc', label: 'Price: High to Low' },
                { key: 'discount', label: 'Highest Discount / Best Offers' },
                { key: 'rating', label: 'Customer Rating: High to Low' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSelectSort(key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-semibold transition-colors ${
                    activeSort === key
                      ? 'bg-brand-lightBlueSoft text-brand-deepBlue font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{label}</span>
                  {activeSort === key && <Check className="w-4 h-4 text-brand-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-[#F8FBFE]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-primary" />
                <h3 className="font-black text-sm text-brand-dark">Filter Products</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-bold">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-brand-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              {/* Deals Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setDealOnly(!dealOnly)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border font-bold transition-all ${
                    dealOnly
                      ? 'bg-blue-50 text-brand-primary border-brand-sky'
                      : 'bg-[#F8FBFE] border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-brand-primary fill-brand-primary" />
                    Festive & Super Deals
                  </span>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      dealOnly
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'border-slate-300'
                    }`}
                  >
                    {dealOnly && <Check className="w-3 h-3" />}
                  </span>
                </button>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  Department
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: undefined, label: 'All' },
                    { id: 'appliances', label: 'Appliances' },
                    { id: 'furniture', label: 'Furniture' },
                  ].map((dept) => (
                    <button
                      key={dept.label}
                      type="button"
                      onClick={() => {
                        setCategory(dept.id);
                        setSubcategory(undefined);
                      }}
                      className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-colors ${
                        category === dept.id
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  Categories
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() =>
                        setSubcategory(subcategory === cat.slug ? undefined : cat.slug)
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        subcategory === cat.slug
                          ? 'bg-brand-lightBlueSoft text-brand-deepBlue border-brand-lightBlue'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Authorized Brands */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  Authorized Brands
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => setBrand(brand === b.name ? undefined : b.name)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold truncate transition-colors text-left flex items-center justify-between ${
                        brand === b.name
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {brand === b.name && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  Budget / Price Range
                </span>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: '0-10000', label: 'Under ₹10,000' },
                    { id: '10000-25000', label: '₹10,000 - ₹25,000' },
                    { id: '25000-50000', label: '₹25,000 - ₹50,000' },
                    { id: '50000-above', label: 'Above ₹50,000' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriceRange(p.id)}
                      className={`w-full p-2.5 rounded-xl border text-left font-semibold transition-colors flex items-center justify-between ${
                        priceRange === p.id
                          ? 'bg-brand-lightBlueSoft text-brand-deepBlue border-brand-lightBlue font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{p.label}</span>
                      {priceRange === p.id && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                  Customer Ratings
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { stars: 4, label: '4★ & Above' },
                    { stars: 3, label: '3★ & Above' },
                  ].map((r) => (
                    <button
                      key={r.stars}
                      type="button"
                      onClick={() => setRating(rating === r.stars ? undefined : r.stars)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                        rating === r.stars
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-brand-border bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-2 py-3 px-6 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold shadow-button transition-colors flex items-center justify-center gap-2"
              >
                <span>Apply Filters</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
