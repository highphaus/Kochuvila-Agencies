'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Filter, Search, ChevronRight, SlidersHorizontal, Grid, List, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import { fetchProducts, fetchCategories, fetchBrands } from '@/lib/api';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS } from '@/lib/data/sample-data';
import { Product, Category, Brand } from '@/types';

interface ProductsPageProps {
  defaultDepartment?: 'appliances' | 'furniture';
}

export default function ProductsPage({ defaultDepartment }: ProductsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sub } = useParams<{ sub?: string }>();

  const currentDepartment = defaultDepartment || searchParams.get('category') || undefined;
  const currentSubcategory = sub || searchParams.get('subcategory') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const search = searchParams.get('search') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const isDeal = searchParams.get('isDeal') === 'true' ? true : undefined;
  const sort = searchParams.get('sort') || 'popularity';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [total, setTotal] = useState<number>(SAMPLE_PRODUCTS.length);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchProducts({
        category: currentDepartment,
        subcategory: currentSubcategory,
        brand,
        search,
        minPrice,
        maxPrice,
        rating,
        isDeal,
        sort,
        page,
        limit: 12,
      }),
      fetchCategories(),
      fetchBrands(),
    ])
      .then(([productsData, catData, brandData]) => {
        if (!isMounted) return;
        if (productsData?.products) {
          setProducts(productsData.products);
          setTotal(productsData.total);
          setTotalPages(productsData.totalPages || Math.ceil(productsData.total / 12) || 1);
        }
        if (catData?.length) setCategories(catData);
        if (brandData?.length) setBrands(brandData);
      })
      .catch((err) => {
        console.warn('API error, using sample catalog fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentDepartment, currentSubcategory, brand, search, minPrice, maxPrice, rating, isDeal, sort, page]);

  const hasActiveFilters = Boolean(
    currentSubcategory || brand || search || minPrice || maxPrice || rating || isDeal
  );

  // Department-specific Banner & Copy matching reference
  const isAppliances = currentDepartment === 'appliances';
  const isFurniture = currentDepartment === 'furniture';

  const bannerTitle = isAppliances
    ? 'Home Appliances'
    : isFurniture
    ? 'Furniture'
    : 'All Products';

  const bannerSubtitle = isAppliances
    ? 'Smart solutions for a modern home.'
    : isFurniture
    ? 'Stylish, Comfortable. Made for your home.'
    : 'Discover furniture and home appliances for everyday living.';

  const bannerImage = isAppliances
    ? '/banners/promo-appliances.jpg'
    : isFurniture
    ? '/banners/promo-furniture.jpg'
    : '/banners/hero-living.jpg';

  const filterCategories = categories.filter((c) => {
    if (isAppliances) return c.type === 'appliances';
    if (isFurniture) return c.type === 'furniture';
    return true;
  });

  const filterBrands = brands.filter((b) => {
    if (isAppliances) return b.categoryTypes?.includes('appliances');
    if (isFurniture) return b.categoryTypes?.includes('furniture');
    return true;
  });

  const priceRanges = [
    { label: '₹0 - ₹25,000', min: 0, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: '₹50,000 - ₹75,000', min: 50000, max: 75000 },
    { label: '₹75,000+', min: 75000, max: 200000 },
  ];

  const buildUrl = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === '') {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    const basePath = defaultDepartment ? `/${defaultDepartment}` : '/products';
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-16">
      {/* Category Header Banner matching Panels 2 & 3 in Reference Image */}
      <section className="relative bg-[#EBF6FC]/60 border-b border-[#9FD8F1]/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
          <div className="max-w-md space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-display">
              {bannerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              {bannerSubtitle}
            </p>
          </div>
        </div>

        {/* Right side banner background photography */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 overflow-hidden pointer-events-none hidden sm:block">
          <Image
            src={bannerImage}
            alt={bannerTitle}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EBF6FC] via-[#EBF6FC]/70 to-transparent" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation matching Reference Image */}
        <nav className="flex items-center gap-1.5 text-xs text-[#666666] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-[#0097F3] shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#999999] shrink-0" />
          <Link
            href={defaultDepartment ? `/${defaultDepartment}` : '/products'}
            className="hover:text-[#0097F3] shrink-0 font-medium capitalize text-[#1A1A1A]"
          >
            {bannerTitle}
          </Link>
          {currentSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#999999] shrink-0" />
              <span className="text-[#0097F3] font-semibold capitalize shrink-0">
                {currentSubcategory.replace('-', ' ')}
              </span>
            </>
          )}
        </nav>

        {/* Mobile Filter Drawer Trigger */}
        <MobileFilterDrawer
          categories={categories}
          brands={brands}
          activeCategory={currentDepartment}
          activeSubcategory={currentSubcategory}
          activeBrand={brand}
          activeMinPrice={minPrice}
          activeMaxPrice={maxPrice}
          activeRating={rating}
          isDeal={isDeal}
          activeSort={sort}
          totalProducts={total}
        />

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar matching Reference Layout (3.2 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white rounded-2xl p-5 border border-[#E2EBF2] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBF2]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0097F3]" />
                Filter
              </span>
              {hasActiveFilters && (
                <Link
                  href={defaultDepartment ? `/${defaultDepartment}` : '/products'}
                  className="text-xs text-[#0097F3] hover:underline font-semibold"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Category / Subcategories Checklist */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                Category
              </h4>
              <div className="space-y-1.5 text-xs text-[#444444]">
                {filterCategories.map((cat) => {
                  const isChecked = currentSubcategory === cat.slug;
                  return (
                    <Link
                      key={cat._id}
                      href={buildUrl({ subcategory: isChecked ? undefined : cat.slug, page: 1 })}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-[#EBF6FC]/50 transition-colors"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#0097F3] border-[#0097F3] text-white'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className={isChecked ? 'font-semibold text-[#0097F3]' : ''}>
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Brand Checklist */}
            <div className="space-y-2.5 pt-4 border-t border-[#E2EBF2]/60">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                Brand
              </h4>
              <div className="space-y-1.5 text-xs text-[#444444] max-h-48 overflow-y-auto pr-1">
                {filterBrands.map((b) => {
                  const isChecked = brand?.toLowerCase() === b.name.toLowerCase();
                  return (
                    <Link
                      key={b._id}
                      href={buildUrl({ brand: isChecked ? undefined : b.name, page: 1 })}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-[#EBF6FC]/50 transition-colors"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#0097F3] border-[#0097F3] text-white'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className={isChecked ? 'font-semibold text-[#0097F3]' : ''}>
                        {b.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2.5 pt-4 border-t border-[#E2EBF2]/60">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs text-[#444444]">
                {priceRanges.map((range) => {
                  const isChecked = minPrice === range.min && maxPrice === range.max;
                  return (
                    <Link
                      key={range.label}
                      href={buildUrl({
                        minPrice: isChecked ? undefined : range.min,
                        maxPrice: isChecked ? undefined : range.max,
                        page: 1,
                      })}
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-[#EBF6FC]/50 transition-colors"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#0097F3] border-[#0097F3] text-white'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className={isChecked ? 'font-semibold text-[#0097F3]' : ''}>
                        {range.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Department Specific Features Filter */}
            <div className="space-y-2.5 pt-4 border-t border-[#E2EBF2]/60">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                {isAppliances ? 'Features' : 'Material'}
              </h4>
              <div className="space-y-1.5 text-xs text-[#444444]">
                {(isAppliances
                  ? ['Inverter Technology', 'Energy Efficient', 'Wi-Fi Enabled', 'Fast Cooling', 'Steam Wash']
                  : ['Wood', 'Fabric', 'Metal', 'Leather', 'Glass']
                ).map((feat) => (
                  <label key={feat} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-[#EBF6FC]/50 cursor-pointer">
                    <span className="w-3.5 h-3.5 rounded border border-[#CCCCCC] bg-white"></span>
                    <span>{feat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area (8.8 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Toolbar matching Reference Image */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-3.5 border border-[#E2EBF2] shadow-xs">
              <span className="text-xs text-[#666666]">
                Showing <strong className="text-[#1A1A1A]">{products.length}</strong> of{' '}
                <strong className="text-[#1A1A1A]">{total}</strong> products
              </span>

              <div className="flex items-center gap-4">
                {/* Sort By Dropdown matching Reference Image */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#666666] font-medium">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('sort', e.target.value);
                      params.set('page', '1');
                      const basePath = defaultDepartment ? `/${defaultDepartment}` : '/products';
                      window.location.href = `${basePath}?${params.toString()}`;
                    }}
                    className="bg-[#EBF6FC]/30 border border-[#E2EBF2] text-xs font-semibold text-[#1A1A1A] rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center border border-[#E2EBF2] rounded-lg p-0.5 bg-[#EBF6FC]/30">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#0097F3]' : 'text-[#666666]'}`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-2xs text-[#0097F3]' : 'text-[#666666]'}`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Column Desktop Product Grid matching Reference Image */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2EBF2] p-12 text-center space-y-4">
                <p className="text-base font-bold text-[#1A1A1A] font-display">No products match your criteria</p>
                <p className="text-xs text-[#666666]">Try adjusting your filters or search keywords.</p>
                <Link
                  href={defaultDepartment ? `/${defaultDepartment}` : '/products'}
                  className="inline-block px-5 py-2.5 rounded-lg bg-[#0097F3] text-white text-xs font-semibold hover:bg-[#017ED0]"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination matching Reference Image: [1] 2 3 ... Next */}
            {totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <Link
                    key={pNum}
                    href={buildUrl({ page: pNum })}
                    className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      pNum === page
                        ? 'bg-[#0097F3] text-white shadow-xs'
                        : 'bg-white border border-[#E2EBF2] text-[#1A1A1A] hover:bg-[#EBF6FC]'
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={buildUrl({ page: page + 1 })}
                    className="px-4 h-9 rounded-lg text-xs font-semibold bg-white border border-[#E2EBF2] text-[#1A1A1A] hover:bg-[#EBF6FC] flex items-center justify-center"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
