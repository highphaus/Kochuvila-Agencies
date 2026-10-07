'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  MessageCircle,
  Bookmark,
  Plus,
  RotateCcw,
  Check,
} from 'lucide-react';
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

  const freeDeliveryThreshold = 2000;
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidating(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: subtotal }),
      });
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
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  // WhatsApp Order formatted text
  const generateWhatsAppCartLink = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919447000000';
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
    <div className="bg-[#f8fbfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display">
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your selected appliances and furniture before checkout.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Free delivery progress strip */}
        {items.length > 0 && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-brand-border shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-4 h-4 text-brand-primary" />
                {freeDeliveryRemaining === 0 ? (
                  <strong className="text-emerald-700 font-bold">
                    🎉 Congratulations! You have unlocked FREE Doorstep Delivery across Kerala!
                  </strong>
                ) : (
                  <span>
                    Add <strong>{formatINR(freeDeliveryRemaining)}</strong> more to get{' '}
                    <strong className="text-brand-primary">FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-slate-500">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-border shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
                  >
                    {/* Product Thumbnail */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-primary mb-1">
                        <span>{product.brand}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 capitalize">{product.category}</span>
                      </div>

                      <Link
                        href={`/product/${product.slug}`}
                        className="block text-sm font-bold text-slate-900 hover:text-brand-primary transition-colors truncate"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-brand-dark">
                          {formatINR(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatINR(product.mrp)}
                          </span>
                        )}
                      </div>

                      {/* Delivery assurance */}
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Stock • Kerala Free Doorstep Delivery</span>
                      </div>
                    </div>

                    {/* Actions: Quantity, Save for Later & Remove */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => saveForLater(product._id)}
                          className="text-xs text-brand-primary hover:text-brand-deepBlue font-semibold flex items-center gap-1"
                          title="Save for Later"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>

                        <button
                          onClick={() => removeItem(product._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
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
                        <div className="w-16 h-16 rounded-xl bg-slate-50 p-1.5 flex-shrink-0 border border-slate-200 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain"
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
            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
              <div className="border-b border-brand-border pb-3">
                <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>Frequently Added with Appliances & Furniture</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Protective stands, digital stabilizers, and authentic organic care recommended by our technicians.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RECOMMENDED_ADDONS.map((addon) => {
                  const isAlreadyInCart = items.some((i) => i.product._id === addon._id);
                  return (
                    <div
                      key={addon._id}
                      className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-brand-border flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="aspect-square bg-white rounded-xl p-2 flex items-center justify-center border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={addon.images[0]}
                            alt={addon.name}
                            className="w-full h-full object-contain"
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
            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6 sticky top-24">
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
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryCharge)
                    )}
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm shadow-button transition-all active:scale-98 disabled:opacity-50"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {items.length > 0 && (
                  <a
                    href={generateWhatsAppCartLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order Entire Cart on WhatsApp
                  </a>
                )}
              </div>

              {/* Security info */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Genuine Products • Authorized Warranty • Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
