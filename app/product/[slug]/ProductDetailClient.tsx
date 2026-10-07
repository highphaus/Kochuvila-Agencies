'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Star,
  Award,
  Clock,
  Sparkles,
  Phone,
  Scale,
} from 'lucide-react';
import { Product } from '@/types';
import { formatINR, calculateEMI, generateWhatsAppEnquiryLink } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<{
    text: string;
    isAvailable: boolean;
  } | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product._id));
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const inCompare = useCompareStore((state) => state.isInCompare(product._id));

  const emi = calculateEMI(product.price, 6);
  const emi12 = calculateEMI(product.price, 12);
  const whatsappUrl = generateWhatsAppEnquiryLink(product);
  const savings = Math.max(0, product.mrp - product.price);

  const handleToggleCompare = () => {
    if (inCompare) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeMessage({
        text: 'Please enter a valid 6-digit Indian PIN code.',
        isAvailable: false,
      });
      return;
    }

    // Kerala PIN codes typically start with 67, 68, or 69
    if (cleanPin.startsWith('67') || cleanPin.startsWith('68') || cleanPin.startsWith('69')) {
      setPincodeMessage({
        text: '✅ Delivery available! Free delivery within 24-48 hours with showroom installation assistance.',
        isAvailable: true,
      });
    } else {
      setPincodeMessage({
        text: '🚚 Delivery available via our Kerala extended regional logistics partner (3-5 business days).',
        isAvailable: true,
      });
    }
  };

  const variantOptions =
    product.category === 'appliances'
      ? ['Standard Edition', 'Inverter Plus (Featured)', 'Smart WiFi Enabled']
      : ['Natural Solid Teakwood', 'Dark Walnut Finish', 'Royal Honey Teak'];

  const colorSwatches =
    product.category === 'appliances'
      ? [
          { name: 'Brushed Steel', bg: 'bg-slate-300' },
          { name: 'Midnight Black', bg: 'bg-slate-900' },
          { name: 'Metallic Silver', bg: 'bg-slate-400' },
        ]
      : [
          { name: 'Kerala Teak Natural', bg: 'bg-[#9C6D37]' },
          { name: 'Deep Walnut', bg: 'bg-[#4B3621]' },
          { name: 'Warm Oak', bg: 'bg-[#C19A6B]' },
        ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Product Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main image container */}
        <div className="relative aspect-square bg-white rounded-3xl border border-brand-border p-8 flex items-center justify-center shadow-card overflow-hidden group">
          {/* Action buttons: Wishlist & Compare */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isInWishlist
                  ? 'bg-red-50 text-red-600'
                  : 'bg-white/80 text-slate-500 hover:text-brand-primary hover:bg-white'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-600' : ''}`} />
            </button>

            <button
              onClick={handleToggleCompare}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                inCompare
                  ? 'bg-brand-primary text-white scale-105'
                  : 'bg-white/80 text-slate-500 hover:text-brand-primary hover:bg-white'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            >
              <Scale className="w-5 h-5" />
            </button>
          </div>

          {/* Discount Pill */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-brand-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-button">
              {product.discountPercentage}% OFF
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain max-h-[460px] transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Thumbnail selector */}
        {product.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-xl bg-white border-2 p-1 flex items-center justify-center flex-shrink-0 transition-all ${
                  idx === selectedImageIndex
                    ? 'border-brand-primary shadow-xs'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Showroom Trust Assurances */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">100% Genuine</p>
              <p className="text-[11px] text-slate-500">Official Brand Warranty</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <Truck className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Safe Kerala Transit</p>
              <p className="text-[11px] text-slate-500">Careful doorstep delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Purchase Controls */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          {/* Brand & Category tags */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary bg-blue-50 px-2.5 py-0.5 rounded-md">
              {product.brand}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              SKU: {product.sku}
            </span>
            {product.energyRating && (
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-xs border border-emerald-200">
                {product.energyRating}
              </span>
            )}
            {product.dealTag && (
              <span className="bg-cyan-50 text-cyan-800 font-bold px-2 py-0.5 rounded text-xs border border-cyan-100">
                {product.dealTag}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-xs text-slate-600 font-medium">
              {product.reviewCount} Verified Buyer Ratings
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Stock & Ready for Dispatch
            </span>
          </div>
        </div>

        {/* Pricing block */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-border shadow-card space-y-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-brand-dark">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-slate-600 line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  You Save {formatINR(savings)} ({product.discountPercentage}% OFF)
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-600">
            Inclusive of all taxes. Free doorstep shipping in Kerala on this product.
          </p>

          {/* EMI breakdown card */}
          <div className="p-3 bg-blue-50/70 border border-brand-skyLight/70 rounded-xl text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold flex items-center gap-1 text-brand-primary">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Zero Cost EMI available
              </p>
              <p className="text-slate-600 text-[11px]">
                Pay as low as <strong>{formatINR(emi)}/month</strong> for 6 months or <strong>{formatINR(emi12)}/month</strong> for 12 months.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary bg-white px-2 py-1 rounded border border-brand-skyLight">
              0% Interest
            </span>
          </div>
        </div>

        {/* Interactive Variant Selection (Flipkart/Myntra Pattern) */}
        <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Configuration / Edition:
              </span>
              <span className="font-bold text-brand-deepBlue text-xs">
                {variantOptions[selectedVariant]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variantOptions.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedVariant(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedVariant === idx
                      ? 'border-brand-primary bg-brand-lightBlueSoft text-brand-deepBlue shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-[#FAFBFD]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Color / Finish:
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {colorSwatches[selectedColor].name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {colorSwatches.map((swatch, idx) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setSelectedColor(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedColor === idx
                      ? 'border-brand-primary bg-slate-50 ring-2 ring-brand-primary/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${swatch.bg} border border-slate-300`} />
                  <span>{swatch.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Controls & WhatsApp Enquiry */}
        <div className="space-y-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 hover:bg-slate-100 text-sm font-bold text-slate-700"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-1.5 hover:bg-slate-100 text-sm font-bold text-slate-700"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-500">
              ({product.stock} units available)
            </span>
          </div>

          {/* Main CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#f0f8fd] hover:bg-[#e1f2fc] text-brand-primary font-bold text-sm transition-all border border-brand-skyLight/70 active:scale-98 shadow-xs"
            >
              <ShoppingCart className="w-4 h-4 text-brand-primary" />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm transition-all shadow-button active:scale-98"
            >
              <Zap className="w-4 h-4 text-brand-skyLight" />
              Buy Now (Express)
            </button>
          </div>

          {/* Direct WhatsApp showroom inquiry */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-button transition-all active:scale-98"
          >
            <MessageCircle className="w-5 h-5" />
            Enquire & Order Directly on WhatsApp
          </a>
        </div>

        {/* Kerala Pincode Delivery Checker */}
        <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Check Kerala Delivery & Installation Availability</span>
          </div>

          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode (e.g. 695011)"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Check
            </button>
          </form>

          {pincodeMessage && (
            <p
              className={`text-xs p-2 rounded-lg ${
                pincodeMessage.isAvailable
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {pincodeMessage.text}
            </p>
          )}

          <div className="text-[11px] text-slate-600 space-y-1">
            <p>• {product.warranty}</p>
            <p>• {product.deliveryInfo || 'Doorstep delivery across all 14 Kerala districts.'}</p>
            <p>• 7-Day Replacement for manufacturing defects.</p>
          </div>
        </div>

        {/* Key Features List */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Key Highlights:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar (Thumb-friendly UX) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border p-3 flex items-center justify-between gap-3 shadow-elevated">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-black">{formatINR(product.price)}</span>
            {savings > 0 && (
              <span className="text-[11px] text-slate-400 line-through">{formatINR(product.mrp)}</span>
            )}
          </div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
            {product.stock > 0 ? 'In Stock • Kerala Delivery' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 rounded-xl bg-brand-lightBlueSoft text-brand-deepBlue border border-brand-lightBlue font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-brand-primary" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white font-bold text-xs shadow-button active:scale-95 transition-all flex items-center gap-1"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
