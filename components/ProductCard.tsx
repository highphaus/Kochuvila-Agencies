'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { Product } from '@/types';
import { formatINR, generateWhatsAppEnquiryLink } from '@/lib/utils';
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

  const whatsappUrl = useMemo(() => generateWhatsAppEnquiryLink(product), [product]);

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

  const fallbackImage = product.category === 'furniture' ? '/banners/portrait-furniture.jpg' : '/banners/portrait-appliances.jpg';
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || fallbackImage);

  React.useEffect(() => {
    if (product.images?.[0]) {
      setImgSrc(product.images[0]);
    }
  }, [product.images]);

  return (
    <div className="group bg-white rounded-xl border border-[#E2EBF2] hover:border-[#0097F3] transition-all duration-300 flex flex-col overflow-hidden relative shadow-xs hover:shadow-md hover:-translate-y-0.5">
      {/* Discount Badge with 0097f3 */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-[#0097F3] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-wider">
            {product.discountPercentage}% OFF
          </span>
        </div>
      )}

      {/* Wishlist Button on Top Right */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Save to Wishlist"
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-[#000000] hover:text-[#0097F3] transition-all shadow-xs"
        title="Add to Wishlist"
      >
        <Heart
          className={`w-4 h-4 ${
            isInWishlist ? 'fill-[#0097F3] text-[#0097F3]' : 'text-[#64748B]'
          }`}
        />
      </button>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square w-full bg-[#EBF6FC]/30 overflow-hidden p-4 flex items-center justify-center cursor-pointer border-b border-[#E2EBF2]"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          loading="lazy"
          onError={() => setImgSrc(fallbackImage)}
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#017ED0] mb-0.5">
            {product.brand}
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-[#000000] group-hover:text-[#0097F3] transition-colors line-clamp-2 leading-snug mb-1.5"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-[#000000] text-[11px]">{product.rating}</span>
            <span className="text-[#94A3B8] text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-[#E2EBF2] space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-[#000000]">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-[#94A3B8] line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={handleAddToCart}
              className={`col-span-3 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-xs active:scale-95 truncate ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0097F3] hover:bg-[#017ED0] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Enquire on WhatsApp"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              className="col-span-1 flex items-center justify-center bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-all border border-[#25D366]/30 active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
