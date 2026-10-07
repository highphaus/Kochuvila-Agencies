import React from 'react';
import Link from 'next/link';
import {
  Filter,
  Search,
  ChevronRight,
  Flame,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import { fetchProducts, fetchCategories, fetchBrands } from '@/lib/api';

interface PageProps {
  searchParams: {
    category?: string;
    subcategory?: string;
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    isDeal?: string;
    sort?: string;
    page?: string;
  };
}

export const revalidate = 0;

export default async function ProductsPage({ searchParams }: PageProps) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const brand = searchParams.brand;
  const search = searchParams.search;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const rating = searchParams.rating ? Number(searchParams.rating) : undefined;
  const isDeal = searchParams.isDeal === 'true' ? true : undefined;
  const sort = searchParams.sort || 'newest';
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const [productsData, categories, brands] = await Promise.all([
    fetchProducts({
      category,
      subcategory,
      brand,
      search,
      minPrice,
      maxPrice,
      rating,
      isDeal,
      sort,
      page,
      limit: 24,
    }),
    fetchCategories(),
    fetchBrands(),
  ]);

  const { products, total, totalPages } = productsData;

  const hasActiveFilters = Boolean(
    category || subcategory || brand || search || minPrice || maxPrice || rating || isDeal
  );

  return (
    <div className="bg-[#fdfdfd] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-brand-primary">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-semibold">Catalog</span>
            {category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800 capitalize">{category}</span>
              </>
            )}
            {subcategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-primary font-bold capitalize">
                  {subcategory.replace('-', ' ')}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display capitalize">
                {search
                  ? `Search Results for "${search}"`
                  : subcategory
                  ? `${subcategory.replace('-', ' ')} Collection`
                  : category
                  ? `${category} Collection`
                  : isDeal
                  ? "🔥 Today's Special Deals & Offers"
                  : 'All Home Appliances & Furniture'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {products.length} of {total} products with doorstep delivery in Kerala
              </p>
            </div>

            {/* Sort Dropdown Link Form */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort By:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(subcategory ? { subcategory } : {}),
                    ...(brand ? { brand } : {}),
                    ...(search ? { search } : {}),
                    ...(isDeal ? { isDeal: 'true' } : {}),
                    sort: 'newest',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    sort === 'newest'
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Featured
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(subcategory ? { subcategory } : {}),
                    ...(brand ? { brand } : {}),
                    ...(search ? { search } : {}),
                    ...(isDeal ? { isDeal: 'true' } : {}),
                    sort: 'price_asc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    sort === 'price_asc'
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(subcategory ? { subcategory } : {}),
                    ...(brand ? { brand } : {}),
                    ...(search ? { search } : {}),
                    ...(isDeal ? { isDeal: 'true' } : {}),
                    sort: 'price_desc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    sort === 'price_desc'
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Price: High to Low
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(subcategory ? { subcategory } : {}),
                    ...(brand ? { brand } : {}),
                    ...(search ? { search } : {}),
                    ...(isDeal ? { isDeal: 'true' } : {}),
                    sort: 'discount',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    sort === 'discount'
                      ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Discount
                </Link>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-3 mt-3 border-t border-brand-border">
              <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
              {category && (
                <span className="inline-flex items-center gap-1 bg-[#f0f8fd] text-brand-primary border border-brand-sky/60 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Category: {category}
                </span>
              )}
              {subcategory && (
                <span className="inline-flex items-center gap-1 bg-[#f0f8fd] text-brand-primary border border-brand-sky/60 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Subcategory: {subcategory}
                </span>
              )}
              {brand && (
                <span className="inline-flex items-center gap-1 bg-[#f0f8fd] text-brand-primary border border-brand-sky/60 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Brand: {brand}
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 bg-[#f0f8fd] text-brand-primary border border-brand-sky/60 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Search: "{search}"
                </span>
              )}
              {isDeal && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-brand-primary border border-brand-sky text-xs px-2.5 py-1 rounded-full font-bold">
                  Hot Deals Only
                </span>
              )}
              <Link
                href="/products"
                className="text-xs text-brand-primary font-bold hover:underline ml-2"
              >
                Clear All Filters
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Sticky Filter & Sort Drawer Bar */}
        <MobileFilterDrawer
          categories={categories}
          brands={brands}
          activeCategory={category}
          activeSubcategory={subcategory}
          activeBrand={brand}
          activeMinPrice={minPrice}
          activeMaxPrice={maxPrice}
          activeRating={rating}
          isDeal={isDeal}
          activeSort={sort}
          totalProducts={total}
        />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Persistent Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-card space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <span className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-primary" />
                  Filter Catalog
                </span>
                {hasActiveFilters && (
                  <Link
                    href="/products"
                    className="text-xs text-brand-primary hover:underline font-semibold"
                  >
                    Reset
                  </Link>
                )}
              </div>

              {/* Deal toggle */}
              <div>
                <Link
                  href={
                    isDeal
                      ? `/products?${new URLSearchParams({
                          ...(category ? { category } : {}),
                          ...(subcategory ? { subcategory } : {}),
                          ...(brand ? { brand } : {}),
                        }).toString()}`
                      : `/products?${new URLSearchParams({
                          ...(category ? { category } : {}),
                          ...(subcategory ? { subcategory } : {}),
                          ...(brand ? { brand } : {}),
                          isDeal: 'true',
                        }).toString()}`
                  }
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                    isDeal
                      ? 'bg-blue-50 text-brand-primary border-brand-sky shadow-xs'
                      : 'bg-[#f8fbfe] text-slate-700 border-slate-200 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 fill-brand-accent text-brand-accent" />
                    Festive & Super Deals
                  </span>
                  <span className="text-[10px] bg-brand-primary text-white px-2 py-0.5 rounded-full font-bold">
                    Special Offers
                  </span>
                </Link>
              </div>

              {/* Department */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Department
                </h4>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                      !category
                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-[#f0f8fd]'
                    }`}
                  >
                    All Departments
                  </Link>
                  <Link
                    href="/products?category=appliances"
                    className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                      category === 'appliances'
                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-[#f0f8fd]'
                    }`}
                  >
                    ⚡ Home Appliances
                  </Link>
                  <Link
                    href="/products?category=furniture"
                    className={`block px-3 py-2 rounded-lg transition-colors font-medium ${
                      category === 'furniture'
                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-[#f0f8fd]'
                    }`}
                  >
                    🪑 Living & Furniture
                  </Link>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Categories
                </h4>
                <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat._id} className="space-y-1">
                      <Link
                        href={`/products?category=${cat.type}&subcategory=${cat.slug}`}
                        className={`block px-3 py-1.5 rounded-md font-medium transition-colors ${
                          subcategory === cat.slug
                            ? 'bg-[#f0f8fd] text-brand-primary font-bold'
                            : 'text-slate-600 hover:text-brand-dark hover:bg-[#f8fbfe]'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Authorized Brands
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <Link
                      key={b._id}
                      href={`/products?${new URLSearchParams({
                        ...(category ? { category } : {}),
                        ...(subcategory ? { subcategory } : {}),
                        brand: b.name,
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-lg border text-center transition-colors truncate font-semibold ${
                        brand?.toLowerCase() === b.name.toLowerCase()
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-[#f8fbfe] border-slate-200 text-slate-700 hover:border-brand-primary/40'
                      }`}
                      title={b.name}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Price Range
                </h4>
                <div className="space-y-1 text-xs font-medium">
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      maxPrice: '10000',
                    }).toString()}`}
                    className="block px-3 py-1.5 rounded text-slate-600 hover:bg-[#f0f8fd]"
                  >
                    Under ₹10,000
                  </Link>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      minPrice: '10000',
                      maxPrice: '25000',
                    }).toString()}`}
                    className="block px-3 py-1.5 rounded text-slate-600 hover:bg-[#f0f8fd]"
                  >
                    ₹10,000 - ₹25,000
                  </Link>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      minPrice: '25000',
                      maxPrice: '50000',
                    }).toString()}`}
                    className="block px-3 py-1.5 rounded text-slate-600 hover:bg-[#f0f8fd]"
                  >
                    ₹25,000 - ₹50,000
                  </Link>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      minPrice: '50000',
                    }).toString()}`}
                    className="block px-3 py-1.5 rounded text-slate-600 hover:bg-[#f0f8fd]"
                  >
                    Above ₹50,000
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-border shadow-card">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any products matching your active filters. Try clearing
                  some filters or searching with a different term.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primaryHover transition-colors shadow-button"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isActive = pNum === page;
                  return (
                    <Link
                      key={pNum}
                      href={`/products?${new URLSearchParams({
                        ...(category ? { category } : {}),
                        ...(subcategory ? { subcategory } : {}),
                        ...(brand ? { brand } : {}),
                        ...(search ? { search } : {}),
                        ...(isDeal ? { isDeal: 'true' } : {}),
                        ...(sort ? { sort } : {}),
                        page: String(pNum),
                      }).toString()}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-button'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
