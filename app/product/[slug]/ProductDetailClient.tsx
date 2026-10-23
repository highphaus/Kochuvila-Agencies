'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Star,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { Product } from '@/types';
import { formatINR, calculateEMI, generateWhatsAppEnquiryLink } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

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

  const emi = calculateEMI(product.price, 6);
  const emi12 = calculateEMI(product.price, 12);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${product.name} | Kochuvila Home & Living`,
      text: `Check out ${product.name} at Kochuvila Home & Living:`,
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard copy fallback
      }
    }
  };

  const hasCustomVariants = !!(product.variants && product.variants.length > 0);
  const variantOptions = hasCustomVariants
    ? product.variants!.map((v) => v.name)
    : product.category === 'appliances'
    ? ['Standard Edition', 'Inverter Plus (Featured)', 'Smart WiFi Enabled']
    : ['Natural Solid Teakwood', 'Dark Walnut Finish', 'Royal Honey Teak'];

  const currentVariant = hasCustomVariants ? product.variants![selectedVariant] : null;
  const currentPrice = currentVariant && currentVariant.price ? currentVariant.price : product.price;
  const currentMrp = currentVariant && currentVariant.mrp ? currentVariant.mrp : product.mrp;
  const isCurrentlyInStock = currentVariant ? currentVariant.inStock !== false && currentVariant.stock > 0 : (product.inStock !== false && product.stock > 0);

  const whatsappUrl = generateWhatsAppEnquiryLink(product);
  const savings = Math.max(0, currentMrp - currentPrice);

  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        price: currentPrice,
        mrp: currentMrp,
        images: currentVariant?.image ? [currentVariant.image, ...(product.images || [])] : product.images,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        ...product,
        price: currentPrice,
        mrp: currentMrp,
        images: currentVariant?.image ? [currentVariant.image, ...(product.images || [])] : product.images,
      },
      quantity
    );
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

    // Trivandrum / regional PIN check
    if (cleanPin.startsWith('695') || cleanPin.startsWith('691') || cleanPin.startsWith('69')) {
      setPincodeMessage({
        text: 'Delivery available. Direct doorstep dispatch from our Trivandrum showroom (Pangode & Kallara) with installation assistance.',
        isAvailable: true,
      });
    } else {
      setPincodeMessage({
        text: 'Showroom pickup or Trivandrum dispatch available. Please contact our Trivandrum store for delivery inquiries.',
        isAvailable: true,
      });
    }
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      {/* 1. Product Image Gallery */}
      <div className="lg:col-span-6 space-y-3.5">
        {/* Main image container */}
        <div className="relative aspect-square sm:aspect-4/3 max-h-[380px] sm:max-h-[460px] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-8 flex items-center justify-center shadow-xs overflow-hidden group">
          {/* Action Buttons on Top Right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2">
            {/* Share Button */}
            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all shadow-md active:scale-95 bg-white/90 text-slate-600 hover:text-[#0097F3] hover:bg-white cursor-pointer"
                title="Share product link"
                aria-label="Share product"
              >
                {copied ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              {copied && (
                <div className="absolute top-full mt-1.5 right-0 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-lg animate-in fade-in z-20">
                  Link copied!
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer ${
                isInWishlist
                  ? 'bg-[#EBF6FC] text-[#0097F3]'
                  : 'bg-white/90 text-slate-600 hover:text-[#0097F3] hover:bg-white'
              }`}
              title="Add to Wishlist"
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-[#0097F3] text-[#0097F3]' : ''}`} />
            </button>
          </div>

          {/* Discount Pill on Top Left */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-[#0097F3] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
              {product.discountPercentage}% OFF
            </div>
          )}

          <Image
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, 550px"
            className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105 select-none"
          />
        </div>

        {/* Thumbnail selector */}
        {product.images.length > 1 && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border-2 p-1 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  idx === selectedImageIndex
                    ? 'border-[#0097F3] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                aria-label={`View Image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}

        {/* Showroom Trust Assurances */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-2.5 sm:gap-3">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-left min-w-0">
              <p className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">100% Genuine</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Official Brand Warranty</p>
            </div>
          </div>
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-2.5 sm:gap-3">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0097F3] flex-shrink-0" />
            <div className="text-left min-w-0">
              <p className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">Trivandrum Dispatch</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Doorstep Showroom Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Details & Purchase Controls */}
      <div className="lg:col-span-6 space-y-4 sm:space-y-5">
        <div>
          {/* Brand & Category badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#0097F3] bg-[#EBF6FC] px-2.5 py-0.5 rounded-md border border-[#D6EBF8]">
              {product.brand}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
              SKU: {product.sku}
            </span>
            {product.energyRating && (
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px] sm:text-xs border border-emerald-200">
                {product.energyRating}
              </span>
            )}
            {product.capacity && (
              <span className="bg-blue-50 text-brand-primary font-semibold px-2 py-0.5 rounded text-[10px] sm:text-xs border border-blue-200">
                {product.capacity}
              </span>
            )}
            {product.dimensions && (
              <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] sm:text-xs border border-slate-200">
                {product.dimensions}
              </span>
            )}
            {product.weight && (
              <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] sm:text-xs border border-slate-200">
                {product.weight}
              </span>
            )}
            {product.dealTag && (
              <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] sm:text-xs border border-amber-200">
                {product.dealTag}
              </span>
            )}
          </div>

          <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-display leading-snug tracking-tight">
            {product.name}
          </h1>

          {/* Rating & Stock Availability */}
          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <div className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
              {product.reviewCount} Verified Ratings
            </span>
            <span className="text-slate-300">|</span>
            {isCurrentlyInStock ? (
              <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock &amp; Ready for Dispatch
              </span>
            ) : (
              <span className="text-[11px] sm:text-xs text-rose-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Currently Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Pricing block */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3">
          <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
            <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-950">
              {formatINR(currentPrice)}
            </span>
            {currentMrp > currentPrice && (
              <>
                <span className="text-xs sm:text-base text-slate-400 line-through">
                  {formatINR(currentMrp)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Save {formatINR(Math.max(0, currentMrp - currentPrice))} ({Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF)
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Inclusive of all taxes. Doorstep delivery from our Trivandrum showroom.
          </p>

          {/* EMI breakdown card */}
          <div className="p-2.5 sm:p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold flex items-center gap-1 text-[#0097F3] text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0097F3]" />
                Zero Cost EMI Available
              </p>
              <p className="text-slate-600 text-[10px] sm:text-[11px] mt-0.5">
                Pay as low as <strong>{formatINR(calculateEMI(currentPrice, 6))}/mo</strong> for 6 months or <strong>{formatINR(calculateEMI(currentPrice, 12))}/mo</strong> for 12 months.
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#0097F3] bg-white px-2 py-1 rounded border border-blue-200 self-start sm:self-center shrink-0">
              0% Interest
            </span>
          </div>
        </div>

        {/* Configuration / Variant Selection */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Edition:
              </span>
              <span className="font-bold text-[#0097F3] text-xs">
                {variantOptions[selectedVariant]}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {variantOptions.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedVariant(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedVariant === idx
                      ? 'border-[#0097F3] bg-[#EBF6FC] text-[#0097F3] shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Color / Finish:
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {colorSwatches[selectedColor].name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {colorSwatches.map((swatch, idx) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setSelectedColor(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedColor === idx
                      ? 'border-[#0097F3] bg-slate-50 ring-2 ring-[#0097F3]/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${swatch.bg} border border-slate-300 shrink-0`} />
                  <span>{swatch.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity and Primary CTAs */}
        <div className="space-y-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer text-sm"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer text-sm"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              ({product.stock} units in stock)
            </span>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 min-h-[46px] sm:min-h-[48px] py-3 px-5 rounded-2xl bg-[#EBF6FC] hover:bg-[#D9EEFA] text-[#0097F3] font-bold text-xs sm:text-sm border border-[#0097F3]/30 transition-all active:scale-98 shadow-2xs cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-[#0097F3]" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 min-h-[46px] sm:min-h-[48px] py-3 px-5 rounded-2xl bg-[#0097F3] hover:bg-[#0084D6] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#0097F3]/25 active:scale-98 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Buy Now (Express)</span>
            </button>
          </div>

          {/* Direct WhatsApp showroom inquiry */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 min-h-[46px] sm:min-h-[48px] py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 fill-current" />
            <span>Enquire &amp; Order on WhatsApp</span>
          </a>
        </div>

        {/* Pincode Delivery Checker */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-[#0097F3]" />
            <span>Check Trivandrum Delivery &amp; Installation Availability</span>
          </div>

          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode (e.g. 695609)"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0097F3]/30"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
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
            <p>• {product.deliveryInfo || 'Doorstep delivery from our Trivandrum showrooms.'}</p>
            <p>• 7-Day Replacement for manufacturing defects.</p>
          </div>
        </div>

        {/* Key Features List */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
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

      {/* 3. Sticky Mobile Purchase Bar (For smaller devices) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-lg safe-bottom">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-950">{formatINR(product.price)}</span>
            {savings > 0 && (
              <span className="text-[10px] text-slate-400 line-through">{formatINR(product.mrp)}</span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#0097F3] uppercase tracking-wider block truncate">
            {product.stock > 0 ? 'In Stock • Trivandrum Store' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#EBF6FC] text-[#0097F3] border border-[#0097F3]/40 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-[#0097F3] hover:bg-[#0084D6] text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            aria-label="Buy now"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
