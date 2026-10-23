'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Tag, ShoppingCart, Check, Star, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

interface TodaysDealsSectionProps {
  products: Product[];
}

export default function TodaysDealsSection({ products }: TodaysDealsSectionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Filter products that have genuine discount data, sorted by highest discount
  const dealProducts = useMemo(() => {
    return products
      .filter((p) => p.discountPercentage > 0 && p.mrp > p.price)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 8);
  }, [products]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 bg-white border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Header: Amazon-style Deals Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Tag className="w-3.5 h-3.5 fill-rose-600/20" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Today's Deals &amp; Offers
            </h2>
            <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider">
              Limited Time
            </span>
          </div>

          <Link
            href="/products"
            className="text-xs font-semibold text-[#0097F3] hover:text-[#017ED0] flex items-center gap-1 group shrink-0"
          >
            <span>See all deals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Scroll Rail on Mobile / Multi-column on Tablet+ */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x">
          {dealProducts.map((product) => {
            const isAdded = !!addedIds[product._id];
            const fallbackImage =
              product.category === 'furniture'
                ? '/banners/portrait-furniture.jpg'
                : '/banners/portrait-appliances.jpg';

            return (
              <div
                key={product._id}
                className="w-[170px] xs:w-[190px] sm:w-auto shrink-0 snap-start bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0097F3] transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image with Deal Badge */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="block relative aspect-square w-full bg-slate-100 overflow-hidden border-b border-slate-100"
                  >
                    <Image
                      src={product.images?.[0] || fallbackImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 180px, 220px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                  </Link>

                  {/* Card Content */}
                  <div className="p-2.5 space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#017ED0] block truncate">
                      {product.brand}
                    </span>

                    <Link
                      href={`/product/${product.slug}`}
                      className="block text-xs font-semibold text-slate-900 group-hover:text-[#0097F3] line-clamp-2 leading-tight min-h-[30px]"
                    >
                      {product.name}
                    </Link>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-sm font-black text-slate-900">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatINR(product.mrp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Action */}
                <div className="p-2.5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label={`Add ${product.name} to Cart`}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95 min-h-[34px] cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
