'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FBFE] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#E2EBF2] gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-[#0097F3] transition-colors">Home</Link>
              <span>/</span>
              <span className="font-semibold text-slate-900">My Wishlist</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 font-display tracking-tight">
                Saved Items
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF6FC] text-[#0097F3] text-xs font-bold border border-[#0097F3]/30">
                {items.length} {items.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E2EBF2] shadow-xs text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center mx-auto border border-[#0097F3]/30">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                Your Wishlist Is Empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Explore our catalog of genuine home appliances and authentic handcrafted solid teakwood furniture to save your favorite items.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/appliances"
                className="px-5 py-2.5 bg-[#0097F3] hover:bg-[#0084D6] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Explore Appliances
              </Link>
              <Link
                href="/furniture"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-[#E2EBF2] text-xs font-bold rounded-xl transition-all"
              >
                Explore Furniture
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid (Matching compact ProductCard on catalog pages) */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {items.map((product) => {
              const fallbackImage =
                product.category === 'furniture'
                  ? '/banners/portrait-furniture.jpg'
                  : '/banners/portrait-appliances.jpg';
              const imageSrc = product.images?.[0] || fallbackImage;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0097F3] transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Discount Badge on Top Left */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-[#0097F3] text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs tracking-wider">
                        {product.discountPercentage}% OFF
                      </span>
                    </div>
                  )}

                  {/* Remove Button on Top Right */}
                  <button
                    onClick={() => removeItem(product._id)}
                    aria-label={`Remove ${product.name} from Wishlist`}
                    className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-600 transition-all shadow-xs flex items-center justify-center active:scale-90 cursor-pointer border border-slate-100"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    {/* Product Image Link */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="block relative aspect-square w-full bg-[#FAFBFD] overflow-hidden p-2.5 sm:p-3.5 flex items-center justify-center cursor-pointer border-b border-slate-100"
                    >
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                        loading="lazy"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Content */}
                    <div className="p-2.5 sm:p-3 space-y-1 sm:space-y-1.5">
                      {/* Brand */}
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#017ED0] truncate">
                        {product.brand}
                      </div>

                      {/* Product Name */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="block text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0097F3] transition-colors line-clamp-2 leading-snug min-h-[32px] sm:min-h-[34px]"
                      >
                        {product.name}
                      </Link>

                      {/* Rating (if available) */}
                      {product.rating && (
                        <div className="flex items-center gap-1.5 text-xs pt-0.5">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                          <span className="font-bold text-slate-900 text-[11px]">{product.rating}</span>
                          {product.reviewCount && (
                            <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                          )}
                        </div>
                      )}

                      {/* Trivandrum Dispatch Tag */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate pt-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#007185] shrink-0" />
                        <span>Trivandrum Dispatch</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Move to Cart Button */}
                  <div className="p-2.5 sm:p-3 pt-0 space-y-2">
                    <div className="pt-2 border-t border-slate-100 flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-black text-slate-950">
                        {formatINR(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                          {formatINR(product.mrp)}
                        </span>
                      )}
                    </div>

                    {/* Move To Cart Button */}
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full min-h-[36px] sm:min-h-[40px] py-2 px-2.5 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 bg-[#0097F3] hover:bg-[#0084D6] text-white cursor-pointer"
                      aria-label={`Move ${product.name} to Cart`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
