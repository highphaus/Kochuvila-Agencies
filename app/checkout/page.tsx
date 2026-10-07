'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';
import { PaymentMethod } from '@/types';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    coupon,
    couponDiscount,
    getSubtotal,
    getDeliveryCharge,
    getTotal,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    landmark: '',
    city: '',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number');
      return;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please complete your street, city, and Kerala PIN code');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim() || 'customer@kochuvila.com',
          phone: formData.phone.trim(),
          address: {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            street: formData.street.trim(),
            landmark: formData.landmark.trim(),
            city: formData.city.trim(),
            district: formData.district,
            state: 'Kerala',
            pincode: formData.pincode.trim(),
          },
        },
        items: items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          brand: item.product.brand,
          price: item.product.price,
          mrp: item.product.mrp,
          quantity: item.quantity,
          sku: item.product.sku,
        })),
        subtotal,
        discount: couponDiscount,
        couponCode: coupon?.code,
        deliveryCharge,
        totalAmount: total,
        paymentMethod,
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
        notes: formData.notes,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await res.json();

      if (res.ok && orderData.orderNumber) {
        clearCart();
        router.push(`/order-success?orderNumber=${orderData.orderNumber}`);
      } else {
        setErrorMessage(orderData.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error placing order. Please try again or order on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#f8fbfe] min-h-screen py-16 text-center">
        <p className="text-sm text-slate-600 mb-4">Your cart is currently empty.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-xl shadow-button transition-all"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display">
            Checkout & Delivery Information
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your order with Kochuvila Agencies. Warranty included.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-8 space-y-6">
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    1
                  </span>
                  Customer Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Suresh Kumar"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9847123456"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address (Optional for order invoice)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="suresh.k@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>
              </div>

              {/* Kerala Delivery Address */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    2
                  </span>
                  Delivery Address in Kerala
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      House / Building Name & Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="e.g. TC 14/2045, Rose Villa, Medical College Road"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near Kochuvila Temple / Petrol Pump"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Thiruvananthapuram"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kerala District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 bg-white"
                    >
                      {KERALA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pincode (Kerala) *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      placeholder="e.g. 695011"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery & Installation Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Second floor apartment, lift available. Please call before arrival."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    3
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-primary bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-brand-primary" />
                        Cash on Delivery (Pay on Delivery)
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Pay safely in cash or UPI when our delivery team delivers and unboxes your appliance.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-brand-primary bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        Instant Online Payment (UPI / Google Pay / NetBanking)
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Instant checkout verification with immediate dispatch scheduling.
                      </p>
                    </div>
                  </label>

                  {/* Showroom Pickup */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'enquiry'
                        ? 'border-brand-primary bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'enquiry'}
                      onChange={() => setPaymentMethod('enquiry')}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-brand-accent" />
                        Showroom Pickup & Pay
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Reserve items online and inspect/pay directly at Kochuvila Junction showroom.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary & Submit Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6 sticky top-24">
                <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
                  Summary ({items.length} items)
                </h2>

                {/* Items preview */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-3 text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-slate-500">
                          Qty: {quantity} × {formatINR(product.price)}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatINR(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-brand-border">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">-{formatINR(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-slate-900">
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatINR(deliveryCharge)
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Payable</span>
                    <span className="text-2xl font-black text-brand-dark">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {errorMessage}
                  </div>
                )}

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm shadow-button transition-all active:scale-98 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-brand-sky" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                </button>

                <div className="text-[11px] text-slate-500 text-center space-y-1">
                  <p>• Verified Manufacturer Warranties included</p>
                  <p>• Dedicated doorstep handling across Kerala</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
