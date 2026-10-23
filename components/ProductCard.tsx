'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.items.some((item) => item._id === product._id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const fallbackImage =
    product.category === 'furniture'
      ? '/banners/portrait-furniture.jpg'
      : '/banners/portrait-appliances.jpg';
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || fallbackImage);

  React.useEffect(() => {
    if (product.images?.[0]) {
      setImgSrc(product.images[0]);
    }
  }, [product.images]);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0097F3] transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-2xs hover:shadow-lg hover:-translate-y-0.5">

      {/* Wishlist Button on Top Right */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Save to Wishlist"
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#0097F3] transition-all shadow-xs flex items-center justify-center active:scale-90 cursor-pointer"
        title="Add to Wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isInWishlist ? 'fill-[#0097F3] text-[#0097F3]' : 'text-slate-500'
          }`}
        />
      </button>

      <div>
        {/* Product Image Link */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer border-b border-slate-100"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
            loading="lazy"
            onError={() => setImgSrc(fallbackImage)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-3.5 space-y-1.5">
          {/* Brand */}
          <div className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#017ED0] truncate">
            {product.brand}
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0097F3] transition-colors line-clamp-2 leading-snug min-h-[34px]"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs pt-0.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-slate-900 text-[11px]">{product.rating}</span>
            <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="p-3 sm:p-3.5 pt-0 space-y-2">
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

        {/* Full-Width Add To Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full min-h-[40px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0097F3] hover:bg-[#017ED0] text-white shadow-[#0097F3]/20 hover:shadow-md'
          }`}
          aria-label={`Add ${product.name} to Cart`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;

