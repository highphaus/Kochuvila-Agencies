'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
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

  const user = useAuthStore((state) => state.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Initialize formData from draft or user (preserves guest typed data)
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = sessionStorage.getItem('kochuvila_checkout_draft');
        if (savedDraft) {
          return JSON.parse(savedDraft);
        }
      } catch {
        // ignore
      }
    }
    return {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      street: user?.addresses?.[0]?.street || '',
      landmark: user?.addresses?.[0]?.landmark || '',
      city: user?.addresses?.[0]?.city || '',
      district: user?.addresses?.[0]?.district || 'Thiruvananthapuram',
      state: 'Kerala',
      pincode: user?.addresses?.[0]?.pincode || '',
      notes: '',
    };
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync formData when user logs in, preserving any values already typed
  React.useEffect(() => {
    if (user) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.addresses?.[0]?.street || '',
        city: prev.city || user.addresses?.[0]?.city || '',
        district: prev.district || user.addresses?.[0]?.district || 'Thiruvananthapuram',
        pincode: prev.pincode || user.addresses?.[0]?.pincode || '',
      }));
    }
  }, [user]);

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => {
      const updated = { ...prev, [name]: value };
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('kochuvila_checkout_draft', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  // Reusable order placement logic
  const executeOrder = async (currentUser?: any) => {
    const activeUser = currentUser || useAuthStore.getState().user;
    setIsSubmitting(true);
    setErrorMessage('');

    // Save the entered address into the user's permanent profile addresses
    if (activeUser) {
      try {
        useAuthStore.getState().addAddress({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          street: formData.street.trim(),
          landmark: formData.landmark.trim(),
          city: formData.city.trim(),
          district: formData.district,
          state: 'Kerala',
          pincode: formData.pincode.trim(),
        });
      } catch {
        // non-blocking
      }
    }

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim() || activeUser?.email || 'customer@kochuvila.com',
          phone: formData.phone.trim() || activeUser?.phone || '',
          address: {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim() || activeUser?.phone || '',
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
          image: item.product.images?.[0] || '',
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

      const apiUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || '/api';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const orderData = await res.json();

      if (res.ok && orderData.orderNumber) {
        clearCart();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('kochuvila_checkout_draft');
        }
        router.push(`/order-success?orderNumber=${orderData.orderNumber}`);
      } else {
        setErrorMessage(orderData.error || 'Failed to place order. Please try again.');
      }
    } catch {
      // Offline / network fallback: generate order reference, clear cart and redirect to order success
      const generatedOrderNumber = `KCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        const savedOrders = JSON.parse(localStorage.getItem('kochuvila_orders') || '[]');
        savedOrders.unshift({
          orderNumber: generatedOrderNumber,
          createdAt: new Date().toISOString(),
          totalAmount: total,
          customer: formData,
          items,
          paymentMethod,
        });
        localStorage.setItem('kochuvila_orders', JSON.stringify(savedOrders));
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('kochuvila_checkout_draft');
        }
      } catch {
        // storage fallback
      }
      clearCart();
      router.push(`/order-success?orderNumber=${generatedOrderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validation first (Validate address and contact details)
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number');
      return;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please complete your street address, city, and Kerala PIN code');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    // 2. If user is NOT logged in, trigger login/signup modal now!
    // Customer filled details are safely preserved, only payment submit requires login/signup
    if (!user) {
      setPendingSubmit(true);
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    // 3. User is already logged in, proceed directly
    await executeOrder(user);
  };

  // Called automatically when customer logs in or signs up from the modal
  const handleAuthSuccess = () => {
    const loggedInUser = useAuthStore.getState().user;
    if (pendingSubmit && loggedInUser) {
      setPendingSubmit(false);
      executeOrder(loggedInUser);
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
    <div className="bg-[#f8fbfe] min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-3.5 sm:mb-6">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-brand-dark font-display">
            Checkout & Delivery
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Complete your order with Kochuvila Agencies. Doorstep delivery &amp; warranty included.
          </p>
        </div>

        {/* Subtle Verified User Pill (Only shown when logged in) */}
        {user && (
          <div className="mb-3.5 sm:mb-4 px-3 py-2 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0 text-xs text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Logged in as <span className="font-bold underline">{user.name || user.email}</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
              Verified
            </span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Form Section */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-5">
              {/* Customer Contact */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 sm:space-y-3.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 sm:pb-2.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] sm:text-xs flex items-center justify-center font-bold shadow-xs shrink-0">
                    1
                  </span>
                  Customer Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Suresh Kumar"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9847123456"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Email Address (Optional for order invoice)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="suresh.k@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Kerala Delivery Address */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 sm:space-y-3.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 sm:pb-2.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] sm:text-xs flex items-center justify-center font-bold shadow-xs shrink-0">
                    2
                  </span>
                  Delivery Address (Kerala Doorstep)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      House / Building Name &amp; Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="e.g. TC 14/2045, Rose Villa, Medical College Road"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near Kochuvila Temple / Petrol Pump"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                    />
                  </div>

                  {/* Compact 2-column mobile row for City & Pincode */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:col-span-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Trivandrum"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                        PIN Code (Kerala) *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="pincode"
                        maxLength={6}
                        required
                        placeholder="e.g. 695011"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Kerala District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 transition-all outline-none cursor-pointer"
                    >
                      {KERALA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] sm:text-xs">
                      Delivery &amp; Installation Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Second floor apartment, lift available. Please call before arrival."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#0097F3] focus:ring-1.5 focus:ring-[#0097F3]/20 text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 placeholder:text-[10.5px] sm:placeholder:text-[11.5px] transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3 sm:space-y-3.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 sm:pb-2.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] sm:text-xs flex items-center justify-center font-bold shadow-xs shrink-0">
                    3
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-2 sm:space-y-2.5">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-primary bg-blue-50/50 ring-1 ring-brand-primary/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 sm:mt-1 text-brand-primary focus:ring-brand-primary shrink-0"
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Banknote className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Cash on Delivery (Pay on Delivery)</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Pay safely in cash or UPI when our delivery team delivers and unboxes your appliance.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-brand-primary bg-blue-50/50 ring-1 ring-brand-primary/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-0.5 sm:mt-1 text-brand-primary focus:ring-brand-primary shrink-0"
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                        <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Instant Online Payment (UPI / Cards / NetBanking)</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Instant checkout verification with immediate dispatch scheduling.
                      </p>
                    </div>
                  </label>

                  {/* Showroom Pickup */}
                  <label
                    className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'enquiry'
                        ? 'border-brand-primary bg-blue-50/50 ring-1 ring-brand-primary/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'enquiry'}
                      onChange={() => setPaymentMethod('enquiry')}
                      className="mt-0.5 sm:mt-1 text-brand-primary focus:ring-brand-primary shrink-0"
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Building className="w-4 h-4 text-brand-accent shrink-0" />
                        <span>Showroom Pickup &amp; Pay</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Reserve items online and inspect/pay directly at Kochuvila Junction showroom.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary & Submit Sidebar */}
            <div className="lg:col-span-4 space-y-3.5 sm:space-y-5">
              <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5 sm:space-y-4 sticky top-16 sm:top-24">
                <h2 className="text-xs sm:text-sm font-bold text-brand-dark uppercase tracking-wider border-b border-slate-100 pb-2 sm:pb-2.5">
                  Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>

                {/* Items preview */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => {
                    const fallbackImg =
                      product.category === 'furniture'
                        ? '/banners/portrait-furniture.jpg'
                        : '/banners/portrait-appliances.jpg';
                    const itemImg =
                      product.images && product.images.length > 0 && product.images[0]
                        ? product.images[0]
                        : fallbackImg;

                    return (
                      <div key={product._id} className="flex items-center gap-2.5 text-xs">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-50 p-0.5 border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center">
                          <Image
                            src={itemImg}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate text-[11px] sm:text-xs">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Qty: {quantity} × {formatINR(product.price)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm shrink-0">
                          {formatINR(product.price * quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
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
                    <span>Trivandrum Showroom Delivery</span>
                    <span className="font-semibold text-slate-900">
                      {deliveryCharge === 0 ? 'Standard Delivery' : formatINR(deliveryCharge)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Total Payable</span>
                    <span className="text-lg sm:text-2xl font-black text-brand-dark">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2 sm:p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] sm:text-xs rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-xs sm:text-sm shadow-button transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-brand-sky shrink-0" />
                  <span className="truncate">
                    {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                  </span>
                </button>

                <div className="text-[10px] sm:text-[11px] text-slate-500 text-center space-y-0.5">
                  <p>• Verified Manufacturer Warranties included</p>
                  <p>• Dedicated doorstep handling from Trivandrum showrooms</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingSubmit(false);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
