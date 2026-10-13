'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, MessageCircle, Truck, Zap, Scale, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, calculateEMI, generateWhatsAppEnquiryLink } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.items.some((item) => item._id === product._id));
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const inCompare = useCompareStore((state) => state.items.some((item) => item._id === product._id));

  const emi = useMemo(() => calculateEMI(product.price, 6), [product.price]);
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

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E5E9EE] hover:border-brand-primary/60 transition-all duration-300 flex flex-col overflow-hidden relative shadow-card hover:shadow-cardHover">
      {/* Top badges: Discount & Deal tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {product.discountPercentage > 0 && (
          <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.dealTag && (
          <span className="bg-brand-lightBlueSoft text-brand-deepBlue border border-brand-lightBlue/60 text-[9px] font-black px-2 py-0.5 rounded-full shadow-2xs">
            {product.dealTag}
          </span>
        )}
      </div>

      {/* Action buttons: Wishlist & Compare */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isInWishlist
              ? 'bg-brand-lightBlueSoft text-brand-primary scale-105'
              : 'bg-white/90 text-black hover:text-brand-primary hover:bg-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-brand-primary text-brand-primary' : 'text-black'}`} />
        </button>

        <button
          onClick={handleToggleCompare}
          aria-label="Compare Product"
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            inCompare
              ? 'bg-brand-primary text-white scale-105'
              : 'bg-white/90 text-slate-600 hover:text-brand-primary hover:bg-white'
          }`}
          title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square w-full bg-white overflow-hidden p-5 flex items-center justify-center cursor-pointer border-b border-slate-100"
      >
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          loading="lazy"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Technical Specification Pill */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="text-[10px] font-black tracking-widest uppercase text-brand-deepBlue">
              {product.brand}
            </span>
            {product.energyRating && (
              <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[10px] border border-emerald-200">
                {product.energyRating}
              </span>
            )}
            {product.capacity && !product.energyRating && (
              <span className="text-slate-600 text-[10px] font-bold">
                {product.capacity}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-bold text-black group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug mb-1.5"
          >
            {product.name}
          </Link>

          {/* Rating & Kerala Delivery info */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <Truck className="w-3 h-3" />
              Free Kerala Delivery
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-black">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            {emi > 0 && (
              <p className="text-[10px] text-slate-500 mt-0.5">
                From <span className="font-bold text-slate-700">{formatINR(emi)}/mo</span> with No Cost EMI
              </p>
            )}
          </div>

          {/* Buttons: Add to Cart & WhatsApp */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              className={`col-span-3 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-button active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-primary hover:bg-brand-primaryHover text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
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
              className="col-span-1 flex items-center justify-center bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-xl transition-all border border-[#25D366]/30 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
