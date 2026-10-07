'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ShoppingCart, Star, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Truck, Scale } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';

export default function CompareClient() {
  const items = useCompareStore((state) => state.items);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-brand-border gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-brand-primary">Home</Link>
              <span>/</span>
              <span className="font-semibold text-black">Product Comparison</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
                Compare Specifications
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold border border-brand-lightBlue/60">
                {items.length} of 4 Max
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Comparison</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Compare State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-brand-border shadow-card text-center max-w-xl mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center mx-auto border border-brand-lightBlue/50">
              <Scale className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-black font-display uppercase tracking-tight">
                No Products to Compare
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Add up to 4 appliances or furniture pieces from our catalog to compare side-by-side technical specs, prices, and warranties.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/products?category=appliances"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl shadow-button transition-all"
              >
                Browse Appliances
              </Link>
              <Link
                href="/products?category=furniture"
                className="px-6 py-3 bg-white hover:bg-brand-lightBlueSoft text-black border border-brand-border text-xs font-bold rounded-xl transition-all"
              >
                Browse Furniture
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Matrix Table (Flipkart & Croma style) */
          <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {/* Row: Product Header Cards */}
                  <tr className="border-b border-brand-border bg-[#FAFBFD]">
                    <td className="p-4 sm:p-6 w-48 sm:w-64 font-bold text-xs uppercase tracking-wider text-slate-400">
                      Product
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 min-w-[240px] max-w-[280px] align-top relative">
                        <button
                          onClick={() => removeFromCompare(prod._id)}
                          aria-label="Remove from comparison"
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-36 h-36 mx-auto mb-3 bg-white rounded-2xl p-3 border border-brand-border/60 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <span className="text-[10px] font-black uppercase text-brand-deepBlue block">
                          {prod.brand}
                        </span>
                        <Link
                          href={`/product/${prod.slug}`}
                          className="text-xs font-bold text-black hover:text-brand-primary transition-colors line-clamp-2 mt-0.5"
                        >
                          {prod.name}
                        </Link>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-base font-black text-black">
                            {formatINR(prod.price)}
                          </span>
                          {prod.mrp > prod.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatINR(prod.mrp)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="mt-3 w-full py-2 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl transition-all shadow-button flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Rating */}
                  <tr className="border-b border-brand-border">
                    <td className="p-4 sm:p-6 font-bold text-xs text-slate-600 uppercase tracking-wider bg-slate-50/50">
                      Customer Rating
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 text-xs">
                        <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                          <span>{prod.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-white" />
                        </div>
                        <span className="text-slate-400 ml-2 text-[11px]">
                          ({prod.reviewCount} reviews)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Energy Rating / Capacity */}
                  <tr className="border-b border-brand-border">
                    <td className="p-4 sm:p-6 font-bold text-xs text-slate-600 uppercase tracking-wider bg-slate-50/50">
                      Rating / Capacity
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 text-xs font-semibold text-slate-800">
                        {prod.energyRating ? `${prod.energyRating} Star Rating` : prod.capacity || 'Standard Size'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Warranty */}
                  <tr className="border-b border-brand-border">
                    <td className="p-4 sm:p-6 font-bold text-xs text-slate-600 uppercase tracking-wider bg-slate-50/50">
                      Manufacturer Warranty
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 text-xs text-slate-700">
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{prod.warranty || '1 Year Comprehensive Manufacturer Warranty'}</span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Delivery Info */}
                  <tr className="border-b border-brand-border">
                    <td className="p-4 sm:p-6 font-bold text-xs text-slate-600 uppercase tracking-wider bg-slate-50/50">
                      Kerala Delivery
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 text-xs text-slate-700">
                        <span className="flex items-center gap-1 text-brand-deepBlue font-semibold">
                          <Truck className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                          <span>All 14 Districts • Free Unboxing</span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Key Features */}
                  <tr>
                    <td className="p-4 sm:p-6 font-bold text-xs text-slate-600 uppercase tracking-wider bg-slate-50/50">
                      Key Highlights
                    </td>
                    {items.map((prod) => (
                      <td key={prod._id} className="p-4 sm:p-6 text-xs space-y-1 text-slate-700 align-top">
                        {prod.features && prod.features.length > 0 ? (
                          <ul className="space-y-1">
                            {prod.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400">Standard manufacturer specifications.</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
