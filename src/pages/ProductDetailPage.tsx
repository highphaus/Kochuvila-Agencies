import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import ProductDetailClient from '@/app/product/[slug]/ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import ProductReviews from '@/components/ProductReviews';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sample-data';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug ? decodeURIComponent(slug).trim() : '';
  const [product, setProduct] = useState<Product | null>(() => {
    if (!cleanSlug) return null;
    return (
      SAMPLE_PRODUCTS.find(
        (p) =>
          p.slug.toLowerCase() === cleanSlug.toLowerCase() ||
          p._id.toLowerCase() === cleanSlug.toLowerCase()
      ) || null
    );
  });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(!product);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Kochuvila Home & Living`;
    }
  }, [product]);

  useEffect(() => {
    if (!cleanSlug) return;
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchProductBySlug(cleanSlug)
      .then((p) => {
        if (!isMounted) return;
        if (p) {
          setProduct(p);
          fetchProducts({ category: p.category, limit: 10 })
            .then((data) => {
              if (isMounted) {
                setRelatedProducts(data.products.filter((item) => item._id !== p._id).slice(0, 8));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.warn('Could not fetch product detail:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-brand-border shadow-card">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested product could not be found or is temporarily unavailable.
        </p>
        <Link
          href="/products"
          className="inline-flex px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fbfe] min-h-screen pt-4 sm:pt-6 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-brand-primary shrink-0 whitespace-nowrap text-slate-500">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href="/products" className="hover:text-brand-primary shrink-0 whitespace-nowrap text-slate-500">
            Catalog
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-brand-primary capitalize shrink-0 whitespace-nowrap text-slate-700"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link
            href={`/products?category=${product.category}&subcategory=${product.subcategory}`}
            className="hover:text-brand-primary capitalize shrink-0 whitespace-nowrap text-slate-700"
          >
            {product.subcategory.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-brand-dark font-semibold shrink-0 whitespace-nowrap">
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

        {/* Related Products - Horizontal swipeable without buttons */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Recommended For You
                </span>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-brand-dark font-display mt-0.5">
                  Similar {product.category === 'appliances' ? 'Appliances' : 'Furniture'}
                </h3>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Browse category →
              </Link>
            </div>

            {/* Horizontal swipeable track for all devices, smooth swipe */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 will-change-scroll -mx-3 px-3 sm:mx-0 sm:px-0">
              {relatedProducts.map((p) => (
                <div
                  key={p._id}
                  className="w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
