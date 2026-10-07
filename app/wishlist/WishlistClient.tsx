'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight, Truck, Star, Sparkles } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';

export default function WishlistClient() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const handleMoveToCart = (product: any) => {
    addItem(product, 1);
    removeItem(product._id);
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
              <span className="font-semibold text-black">My Wishlist</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
                Saved Items
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold border border-brand-lightBlue/60">
                {items.length} {items.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-brand-border shadow-card text-center max-w-xl mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center mx-auto border border-brand-lightBlue/50">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-black font-display uppercase tracking-tight">
                Your Wishlist Is Empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Explore our catalog of genuine home appliances and authentic handcrafted solid teakwood furniture to save your favorite items.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/products?category=appliances"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl shadow-button transition-all"
              >
                Explore Appliances
              </Link>
              <Link
                href="/products?category=furniture"
                className="px-6 py-3 bg-white hover:bg-brand-lightBlueSoft text-black border border-brand-border text-xs font-bold rounded-xl transition-all"
              >
                Explore Furniture
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid (Myntra/Amazon style) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-3xl border border-brand-border hover:border-brand-primary transition-all duration-300 flex flex-col overflow-hidden shadow-card hover:shadow-cardHover relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeItem(product._id)}
                  aria-label="Remove item"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-slate-400 hover:text-red-600 hover:bg-white transition-all shadow-xs border border-slate-100"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Product Image Link */}
                <Link
                  href={`/product/${product.slug}`}
                  className="block relative aspect-square w-full bg-white p-6 flex items-center justify-center border-b border-slate-100 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-contain w-full h-full max-h-48 group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </Link>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-deepBlue block mb-1">
                      {product.brand}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-xs sm:text-sm font-bold text-black hover:text-brand-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>

                    {/* Price and Stock */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-black text-black">
                        {formatINR(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(product.mrp)}
                        </span>
                      )}
                    </div>


                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 py-2.5 px-3 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl transition-all shadow-button flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
