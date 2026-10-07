'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  History,
  TrendingUp,
  Tag,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS } from '@/lib/data/sample-data';
import { formatINR } from '@/lib/utils';
import { Product } from '@/types';

interface SearchAutocompleteProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const TRENDING_SEARCHES = [
  'Frost Free Refrigerator',
  'Solid Teak Sofa Set',
  '5 Star Inverter Split AC',
  'Front Load Washing Machine',
  '4K Ultra HD Smart TV',
  'King Size Storage Bed',
  'Teak Wood Dining Table 6 Seater',
];

export default function SearchAutocomplete({
  isMobile = false,
  onCloseMobile,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kochuvila_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // localStorage error fallback
    }
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    const clean = searchTerm.trim();
    if (!clean) return;
    try {
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem('kochuvila_recent_searches', JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((s) => s !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem('kochuvila_recent_searches', JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('kochuvila_recent_searches');
    } catch {
      // localStorage fallback
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching results in real time
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { products: [], categories: [], brands: [], totalMatches: 0 };
    }

    // 1. Matching Categories
    const matchedCategories = SAMPLE_CATEGORIES.filter(
      (cat) => cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)
    ).slice(0, 3);

    // 2. Matching Brands
    const matchedBrands = SAMPLE_BRANDS.filter((brand) =>
      brand.name.toLowerCase().includes(q)
    ).slice(0, 4);

    // 3. Matching Products (by name, brand, category, subcategory, or sku)
    const matchedProducts = SAMPLE_PRODUCTS.filter((prod) => {
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        (prod.subcategory && prod.subcategory.toLowerCase().includes(q)) ||
        (prod.sku && prod.sku.toLowerCase().includes(q))
      );
    });

    return {
      products: matchedProducts.slice(0, 4),
      categories: matchedCategories,
      brands: matchedBrands,
      totalMatches: matchedProducts.length,
    };
  }, [query]);

  const handleExecuteSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    saveRecentSearch(term);
    setIsOpen(false);
    onCloseMobile?.();
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(query);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isMobile ? '' : 'max-w-xl mx-auto'}`}>
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-brand-primary" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search 4K TVs, Teak Sofas, Inverter ACs, Fridges, Washers..."
          className="w-full bg-[#f4f9fd] border border-brand-border text-slate-900 text-xs sm:text-sm rounded-full pl-10 pr-24 py-2.5 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all placeholder:text-slate-400 font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-full transition-colors shadow-xs flex items-center gap-1"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-brand-border shadow-2xl p-4 z-50 animate-fade-in max-h-[80vh] overflow-y-auto">
          {/* STATE 1: Empty Query - Show Recent, Trending & Suggested Categories */}
          {!query.trim() ? (
            <div className="space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <History className="w-3.5 h-3.5 text-brand-primary" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearAllRecent}
                      className="text-slate-400 hover:text-brand-primary transition-colors text-[10px]"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleExecuteSearch(term)}
                        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7F9] hover:bg-brand-lightBlueSoft text-slate-800 hover:text-brand-deepBlue text-xs font-medium border border-brand-border cursor-pointer transition-colors"
                      >
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-400 hover:text-red-500 opacity-60 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                  Trending Searches in Kerala
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleExecuteSearch(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-brand-lightBlueSoft text-slate-700 hover:text-brand-primary text-xs font-medium border border-brand-border transition-colors text-left"
                    >
                      <Search className="w-3 h-3 text-brand-primary shrink-0" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Department Shortcuts */}
              <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Explore Showroom Departments:</span>
                <div className="flex items-center gap-3">
                  <Link
                    href="/products?category=appliances"
                    onClick={() => {
                      setIsOpen(false);
                      onCloseMobile?.();
                    }}
                    className="text-brand-primary hover:text-brand-deepBlue font-bold flex items-center gap-1"
                  >
                    Appliances <ChevronRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/products?category=furniture"
                    onClick={() => {
                      setIsOpen(false);
                      onCloseMobile?.();
                    }}
                    className="text-brand-primary hover:text-brand-deepBlue font-bold flex items-center gap-1"
                  >
                    Furniture <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: Active Query - Live Autocomplete Matches */
            <div className="space-y-4">
              {/* Category & Brand Matches Pills */}
              {(searchResults.categories.length > 0 || searchResults.brands.length > 0) && (
                <div className="space-y-2 pb-3 border-b border-brand-border">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Categories & Brands
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.type}&subcategory=${cat.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          onCloseMobile?.();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold border border-brand-lightBlue hover:bg-brand-lightBlue/30 transition-colors"
                      >
                        <Layers className="w-3 h-3 text-brand-primary" />
                        <span>Category: {cat.name}</span>
                      </Link>
                    ))}

                    {searchResults.brands.map((b) => (
                      <Link
                        key={b._id}
                        href={`/products?brand=${encodeURIComponent(b.name)}`}
                        onClick={() => {
                          setIsOpen(false);
                          onCloseMobile?.();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7F9] text-slate-800 text-xs font-bold border border-brand-border hover:bg-slate-100 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-brand-primary" />
                        <span>Brand: {b.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Matching Products ({searchResults.totalMatches})</span>
                  <span className="text-slate-400 font-normal">Click to view details</span>
                </div>

                {searchResults.products.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">No direct product matches for "{query}"</p>
                    <p className="mt-1">Try checking for spelling or search by brand (LG, Samsung, Teakwood, etc.)</p>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border/60">
                    {searchResults.products.map((prod) => (
                      <Link
                        key={prod._id}
                        href={`/product/${prod.slug}`}
                        onClick={() => {
                          saveRecentSearch(query);
                          setIsOpen(false);
                          onCloseMobile?.();
                        }}
                        className="flex items-center gap-3 py-2.5 px-2 hover:bg-brand-lightBlueSoft/60 rounded-xl transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Title and details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider">
                              {prod.brand}
                            </span>
                            {prod.discountPercentage > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                                {prod.discountPercentage}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-brand-primary transition-colors truncate">
                            {prod.name}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-brand-dark block">
                            {formatINR(prod.price)}
                          </span>
                          {prod.mrp > prod.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatINR(prod.mrp)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* View All Matching Products CTA */}
              <button
                type="button"
                onClick={() => handleExecuteSearch(query)}
                className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl transition-all shadow-button flex items-center justify-center gap-2 mt-2"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
