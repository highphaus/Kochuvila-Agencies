'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  CheckCircle2,
  Bookmark,
  Plus,
  RotateCcw,
  Check,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sample-data';

const RECOMMENDED_ADDONS: Product[] = SAMPLE_PRODUCTS.slice(3, 6);


export default function CartPage() {
  const router = useRouter();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const {
    items,
    savedItems,
    addItem,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
    clearCart,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getMrpTotal,
    getSavings,
    getDeliveryCharge,
    getTotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const mrpTotal = getMrpTotal();
  const savings = getSavings();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();
  const itemCount = getItemCount();


  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidating(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const apiUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || '/api';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: subtotal }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.valid) {
        applyCoupon(
          {
            _id: `cpn-${Date.now()}`,
            code: couponInput.trim().toUpperCase(),
            discountPercentage: 0,
            maxDiscountAmount: data.discount,
            minOrderAmount: 0,
            validUntil: '2026-12-31',
            isActive: true,
          },
          data.discount
        );
        setCouponSuccess(data.message);
        setCouponInput('');
        return;
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        return;
      }
    } catch {
      // Local fallback verification for offline / instantaneous performance
      const codeUpper = couponInput.trim().toUpperCase();
      const LOCAL_COUPONS: Record<string, { minSpend: number; discount: number; name: string }> = {
        KOCHU10: { minSpend: 25000, discount: Math.min(3000, Math.round(subtotal * 0.1)), name: '10% Teak & Living Discount' },
        WELCOME500: { minSpend: 2999, discount: 500, name: 'First Order Welcome Voucher' },
        FESTIVAL5: { minSpend: 40000, discount: 5000, name: 'Festive Appliance Bonanza' },
        KOCHUVILA1000: { minSpend: 15000, discount: 1000, name: 'Showroom Welcome Coupon' },
        FESTIVE2500: { minSpend: 30000, discount: 2500, name: 'Kerala Festive Mega Discount' },
        HOME500: { minSpend: 5000, discount: 500, name: 'Home Essentials Voucher' },
      };

      const matched = LOCAL_COUPONS[codeUpper];
      if (matched) {
        if (subtotal < matched.minSpend) {
          setCouponError(`Minimum cart value of ${formatINR(matched.minSpend)} required for coupon ${codeUpper}`);
        } else {
          applyCoupon(
            {
              _id: `cpn-${Date.now()}`,
              code: codeUpper,
              discountPercentage: 0,
              maxDiscountAmount: matched.discount,
              minOrderAmount: matched.minSpend,
              validUntil: '2026-12-31',
              isActive: true,
            },
            matched.discount
          );
          setCouponSuccess(`Applied! ${matched.name}: Saved ${formatINR(matched.discount)}`);
          setCouponInput('');
        }
      } else {
        setCouponError('Invalid coupon code. Try WELCOME500 or KOCHUVILA1000');
      }
    } finally {
      setIsValidating(false);
    }
  };

  // WhatsApp Order formatted text
  const generateWhatsAppCartLink = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919745111141';
    let text = `Hello Kochuvila Agencies,\n\nI would like to place an order for the following items in my cart:\n\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} | Price: ${formatINR(
        item.product.price * item.quantity
      )}\n`;
    });
    text += `\n*Total Amount:* ${formatINR(total)}`;
    if (coupon) {
      text += `\n(Applied Coupon: ${coupon.code} - Saved ${formatINR(couponDiscount)})`;
    }
    text += `\n\nPlease confirm product availability and doorstep delivery in Kerala.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="bg-[#f8fbfe] min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 border border-brand-border shadow-card space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-brand-dark font-display">
                Your Shopping Cart is Empty
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Explore our showroom selection of top-tier home appliances and solid wood furniture crafted for Kerala homes.
              </p>
            </div>
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fbfe] min-h-screen pt-6 sm:pt-8 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-brand-dark font-display truncate">
              Shopping Cart <span className="text-xs sm:text-lg font-bold text-slate-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
              Review your selected appliances and furniture before checkout.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer shrink-0 whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-rose-200/60 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Trivandrum Showroom Dispatch Information Strip */}
        {items.length > 0 && (
          <div className="mb-4 sm:mb-6 p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-border shadow-xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">Showroom Dispatch from Trivandrum</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Careful doorstep delivery &amp; unboxing from Pangode &amp; Kallara showrooms.</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider shrink-0">
              Trivandrum Store
            </span>
          </div>
        )}

        {/* Main Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {items.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {items.map(({ product, quantity }) => {
                  const fallbackImage =
                    product.category === 'furniture'
                      ? '/banners/portrait-furniture.jpg'
                      : '/banners/portrait-appliances.jpg';
                  const itemImg =
                    product.images && product.images.length > 0 && product.images[0]
                      ? product.images[0]
                      : fallbackImage;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
                    >
                      {/* Top Row: Thumbnail + Product Details */}
                      <div className="flex items-start gap-3">
                        {/* Product Thumbnail */}
                        <Link
                          href={`/product/${product.slug}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-slate-100 relative overflow-hidden group"
                        >
                          <Image
                            src={itemImg}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#0097F3] mb-0.5">
                            <span className="truncate">{product.brand}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 capitalize truncate">{product.category}</span>
                          </div>

                          <Link
                            href={`/product/${product.slug}`}
                            className="block text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0097F3] transition-colors line-clamp-2 leading-snug"
                          >
                            {product.name}
                          </Link>

                          {/* Price & Savings */}
                          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 flex-wrap">
                            <span className="text-sm sm:text-base font-black text-slate-950">
                              {formatINR(product.price)}
                            </span>
                            {product.mrp > product.price && (
                              <>
                                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                                  {formatINR(product.mrp)}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                                  Save {formatINR(product.mrp - product.price)}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Delivery assurance */}
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-medium mt-1 truncate">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">In Stock • Kerala Free Delivery</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Row: Quantity + Save + Remove (Buy Now button removed) */}
                      <div className="flex items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-slate-100">
                        {/* Left: Quantity Selector */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product._id, quantity - 1)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-200/70 active:scale-95 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="min-w-[26px] px-1 text-center text-xs font-bold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product._id, quantity + 1)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-200/70 active:scale-95 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Right: Save for Later + Delete */}
                        <div className="flex items-center gap-2">
                          {/* Save for Later */}
                          <button
                            type="button"
                            onClick={() => saveForLater(product._id)}
                            className="text-[11px] sm:text-xs text-slate-600 hover:text-[#0097F3] font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
                            title="Save for Later"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            <span className="hidden xs:inline">Save for Later</span>
                            <span className="xs:hidden">Save</span>
                          </button>

                          {/* Delete / Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(product._id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-brand-border text-center text-xs text-slate-500">
                <p className="font-semibold text-slate-700">No active items in cart.</p>
                <Link href="/products" className="text-brand-primary font-bold hover:underline mt-1 inline-block">
                  Browse Catalog →
                </Link>
              </div>
            )}

            {/* Save for Later Section (Flipkart / Amazon Pattern) */}
            {savedItems.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-brand-border shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <h3 className="font-bold text-xs sm:text-sm text-brand-dark flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-brand-primary" />
                    <span>Saved for Later ({savedItems.length})</span>
                  </h3>
                </div>

                <div className="divide-y divide-brand-border">
                  {savedItems.map(({ product }) => (
                    <div
                      key={product._id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 p-1 flex-shrink-0 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={
                              product.images && product.images.length > 0 && product.images[0]
                                ? product.images[0]
                                : product.category === 'furniture'
                                ? '/banners/portrait-furniture.jpg'
                                : '/banners/portrait-appliances.jpg'
                            }
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider">
                            {product.brand}
                          </span>
                          <Link
                            href={`/product/${product.slug}`}
                            className="block text-xs font-bold text-slate-900 truncate hover:text-brand-primary"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-brand-dark">
                              {formatINR(product.price)}
                            </span>
                            {product.mrp > product.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatINR(product.mrp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => moveToCart(product._id)}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deepBlue transition-colors shadow-xs"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeSavedItem(product._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Showroom Cross-Sells */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-brand-border shadow-card space-y-4">
              <div className="border-b border-brand-border pb-3">
                <h3 className="font-bold text-xs sm:text-sm text-brand-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>Frequently Added with Appliances &amp; Furniture</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                  Protective stands, digital stabilizers, and authentic organic care recommended by our technicians.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                {RECOMMENDED_ADDONS.map((addon) => {
                  const isAlreadyInCart = items.some((i) => i.product._id === addon._id);
                  return (
                    <div
                      key={addon._id}
                      className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-brand-border flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="aspect-square bg-white rounded-xl p-2 flex items-center justify-center border border-slate-200 relative">
                          <Image
                            src={addon.images[0]}
                            alt={addon.name}
                            fill
                            sizes="120px"
                            className="object-contain p-1"
                          />
                        </div>

                        <div>
                          <span className="text-[9px] font-black uppercase text-brand-primary tracking-wider">
                            {addon.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {addon.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs font-black text-brand-dark">
                              {formatINR(addon.price)}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatINR(addon.mrp)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => addItem(addon, 1)}
                        disabled={isAlreadyInCart}
                        className={`mt-3 w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isAlreadyInCart
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary shadow-xs'
                        }`}
                      >
                        {isAlreadyInCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cart Summary & Coupon Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-brand-border shadow-card space-y-5 sm:space-y-6 sticky top-24">
              <h2 className="text-base font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Have a promotional coupon?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-900">{coupon.code}</span>
                      <span className="text-emerald-700">(-{formatINR(couponDiscount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. KOCHU10, WELCOME500"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 uppercase font-bold"
                      />
                      <button
                        type="submit"
                        disabled={isValidating}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isValidating ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-700 font-medium">{couponSuccess}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-brand-border">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span className="font-semibold text-slate-800">{formatINR(mrpTotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Showroom Retail Savings</span>
                  <span className="font-semibold">-{formatINR(savings)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Trivandrum Showroom Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryCharge === 0 ? 'Calculated at checkout' : formatINR(deliveryCharge)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="text-sm font-bold">Final Total Amount</span>
                  <span className="text-xl font-black text-brand-dark">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => router.push('/checkout')}
                  disabled={items.length === 0}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm shadow-button transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {items.length > 0 && (
                  <a
                    href={generateWhatsAppCartLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>Order Entire Cart on WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Security info */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Genuine Products • Brand Warranty • Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar (Flipkart/Amazon style) */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3 safe-bottom">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Total Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 leading-none">{formatINR(total)}</span>
              {savings > 0 && (
                <span className="text-[10px] text-emerald-600 font-bold truncate">Save {formatINR(savings)}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="flex-1 max-w-[200px] min-h-[42px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0097F3] hover:bg-[#017ED0] text-white font-bold text-xs shadow-md shadow-[#0097F3]/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
