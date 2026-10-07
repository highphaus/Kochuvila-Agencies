'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MapPin,
  Tag,
  Headphones,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Phone,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatINR } from '@/lib/utils';

export default function AccountClient() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'coupons' | 'support'>('orders');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Demo order history with authentic Kerala tracking
  const demoOrders = [
    {
      id: 'KCH-2026-9041',
      date: 'October 1, 2026',
      total: 79990,
      paymentMethod: '0% EMI (Bajaj Finserv)',
      status: 'Shipped',
      currentStep: 4, // 1: Ordered, 2: Confirmed, 3: Packed, 4: Shipped, 5: Out for Delivery, 6: Delivered
      estimatedDelivery: 'Tomorrow, Oct 3 by 5:00 PM',
      deliveryAddress: 'TC 14/2045, Rose Nagar, Medical College P.O., Thiruvananthapuram, Kerala - 695011',
      items: [
        {
          name: 'LG 655L Frost-Free Inverter Side-by-Side Refrigerator',
          brand: 'LG',
          price: 79990,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
          warranty: '10 Years on Smart Inverter Compressor',
        },
      ],
    },
    {
      id: 'KCH-2026-8820',
      date: 'September 18, 2026',
      total: 46500,
      paymentMethod: 'UPI / NetBanking',
      status: 'Delivered',
      currentStep: 6,
      estimatedDelivery: 'Delivered on Sep 20, 2026',
      deliveryAddress: 'Kochuvila Junction, Main Commercial Road, Kollam, Kerala - 691506',
      items: [
        {
          name: 'Royal Heritage Solid Teak 3-Seater Chesterfield Sofa',
          brand: 'Royal Teak',
          price: 46500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
          warranty: 'Lifetime Solid Teakwood Warranty',
        },
      ],
    },
  ];

  const coupons = [
    {
      code: 'KOCHU10',
      discount: '10% OFF',
      desc: 'Applicable on all solid teakwood living & bedroom furniture.',
      minSpend: 'Min. Order ₹25,000',
    },
    {
      code: 'FESTIVAL5',
      discount: '₹5,000 FLAT OFF',
      desc: 'Mega festive savings on Double-Door Fridges and 4K TVs.',
      minSpend: 'Min. Order ₹40,000',
    },
    {
      code: 'WELCOME500',
      discount: '₹500 OFF',
      desc: 'First order discount on kitchen & home appliances.',
      minSpend: 'Min. Order ₹2,999',
    },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="min-h-screen bg-[#F5F7F9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="mb-6 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <span className="font-semibold text-black">Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
            My Account & Orders
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center font-black text-xl border border-brand-lightBlue/60">
                {user?.name ? user.name[0].toUpperCase() : 'K'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-base text-black truncate">
                  {user?.name || 'Valued Kerala Customer'}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || 'customer@kochuvilaagencies.com'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Customer
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl p-3 border border-brand-border shadow-card space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>My Orders ({demoOrders.length})</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Personal Details</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'coupons'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4" />
                  <span>Coupons & Offers</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'support'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4" />
                  <span>Showroom Concierge</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-black uppercase tracking-tight">
                    Order History ({demoOrders.length})
                  </h2>
                  <span className="text-xs text-slate-500">Live Status Tracker</span>
                </div>

                {demoOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
                        <span className="font-mono font-black text-black">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Date</span>
                        <span className="font-bold text-slate-800">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment</span>
                        <span className="font-bold text-brand-deepBlue">{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                        <span className="font-black text-black text-sm">{formatINR(order.total)}</span>
                      </div>
                    </div>

                    {/* Status Timeline (Ordered -> Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered) */}
                    <div className="py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-black uppercase tracking-wider">
                          Shipment Status: <span className="text-brand-primary">{order.status}</span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {order.estimatedDelivery}
                        </span>
                      </div>

                      <div className="relative flex items-center justify-between pt-2">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary z-0 transition-all duration-500"
                          style={{
                            width: `${((order.currentStep - 1) / (steps.length - 1)) * 100}%`,
                          }}
                        />

                        {/* Step Nodes */}
                        {steps.map((step, idx) => {
                          const isDone = idx + 1 <= order.currentStep;
                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                  isDone
                                    ? 'bg-brand-primary text-white shadow-xs'
                                    : 'bg-white text-slate-400 border border-slate-300'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] mt-1 hidden sm:block font-bold tracking-tight ${
                                  isDone ? 'text-black' : 'text-slate-400'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Item */}
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#F5F7F9] border border-brand-border"
                      >
                        <div className="w-16 h-16 rounded-xl bg-white p-2 border border-brand-border flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-deepBlue">
                            {item.brand}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-black line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                            🛡️ {item.warranty}
                          </p>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                          <p className="text-sm font-black text-black">{formatINR(item.price)}</p>
                        </div>
                      </div>
                    ))}

                    {/* Footer Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <p className="text-slate-500 max-w-sm truncate text-[11px]">
                        <strong>Ship To:</strong> {order.deliveryAddress}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/track-order?orderId=${order.id}`}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl transition-all shadow-button"
                        >
                          Live Track
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || 'Valued Kerala Customer'}
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || 'customer@kochuvilaagencies.com'}
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      Contact Phone (WhatsApp)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="+91 98471 23456"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      Primary Language
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="English / Malayalam"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Saved Delivery Addresses (Kerala)
                </h2>

                <div className="p-5 rounded-2xl border border-brand-primary bg-brand-lightBlueSoft/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-black">Home Address (Primary)</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase">
                      Default
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    TC 14/2045, Rose Nagar, Medical College P.O.,<br />
                    Thiruvananthapuram, Kerala — PIN 695011<br />
                    Phone: +91 98471 23456
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Available Festival Coupons
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-5 rounded-2xl border border-brand-border bg-[#F5F7F9] hover:border-brand-primary transition-all space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg text-brand-deepBlue font-display">
                          {c.discount}
                        </span>
                        <button
                          onClick={() => handleCopyCoupon(c.code)}
                          className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
                        >
                          {copiedCode === c.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="px-3 py-1.5 rounded-lg bg-white border border-brand-border font-mono font-black text-xs text-black inline-block">
                        {c.code}
                      </div>

                      <p className="text-xs text-slate-600 font-normal">
                        {c.desc}
                      </p>

                      <span className="text-[10px] text-slate-400 font-semibold block border-t border-slate-200 pt-2">
                        {c.minSpend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SUPPORT */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Showroom Concierge & Support
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need help with an order, scheduling unboxing, or seeking expert advice on refrigerator capacities and solid teakwood finishes? Our dedicated Kerala retail team is available 7 days a week.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <a
                    href="tel:+919447023456"
                    className="p-5 rounded-2xl border border-brand-border bg-[#F5F7F9] hover:bg-brand-lightBlueSoft/40 transition-all flex items-center gap-3 text-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-black text-black block">Call Showroom Helpline</span>
                      <span className="text-slate-500 font-medium">+91 94470 23456 (9:30 AM - 8:30 PM)</span>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919447000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl border border-brand-border bg-[#F5F7F9] hover:bg-emerald-50 transition-all flex items-center gap-3 text-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-black text-black block">WhatsApp Concierge</span>
                      <span className="text-slate-500 font-medium">Instant replies for order queries</span>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
