import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import ProductReviews from '@/components/ProductReviews';

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product Not Found | Kochuvila Agencies' };
  }
  return {
    title: `${product.name} | Kochuvila Agencies Kerala`,
    description: `${product.brand} - ${product.description.slice(0, 150)}... Buy with authorized warranty & Kerala delivery.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedData = await fetchProducts({
    category: product.category,
    limit: 4,
  });

  const relatedProducts = relatedData.products.filter((p) => p._id !== product._id).slice(0, 4);

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-brand-primary">
            Catalog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-brand-primary capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/products?category=${product.category}&subcategory=${product.subcategory}`}
            className="hover:text-brand-primary capitalize"
          >
            {product.subcategory.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-sm">
            {product.name}
          </span>
        </nav>

        {/* Client Interactive Area */}
        <ProductDetailClient product={product} />

        {/* Technical Specifications Section */}
        <section className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-card">
          <div className="border-b border-brand-border pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark font-display">
              Detailed Specifications & Information
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Complete technical parameters, dimensions, and warranty terms for {product.name}.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                {product.description}
              </p>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-6">
                {product.specifications.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-blue-50 py-1.5 px-3 rounded-lg inline-block">
                      {group.groupName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 border border-brand-border rounded-2xl p-4 text-xs">
                      {group.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex justify-between py-2 border-b border-slate-100 last:border-b-0"
                        >
                          <span className="font-semibold text-slate-500">{item.key}</span>
                          <span className="font-bold text-slate-900 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Frequently Bought Together (Amazon Bundle Pattern) */}
        <FrequentlyBoughtTogether currentProduct={product} />

        {/* Customer Reviews & Rating Distribution (Amazon/Flipkart Pattern) */}
        <ProductReviews
          productName={product.name}
          initialRating={product.rating}
          initialCount={product.reviewCount}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Recommended For You
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-dark font-display mt-0.5">
                  Similar {product.category === 'appliances' ? 'Appliances' : 'Furniture'}
                </h3>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Browse category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
