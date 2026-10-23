'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Package,
  MapPin,
  Tag,
  Headphones,
  LogOut,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Phone,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  Building,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatINR } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';
import { UserAddress } from '@/types';

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

export default function AccountClient() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'coupons' | 'support'>('orders');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Addresses State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Thiruvananthapuram');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Load fresh user data and addresses from MongoDB Atlas
  useEffect(() => {
    async function fetchFreshUser() {
      if (!token) return;
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            updateUser(data.user);
          }
        }
      } catch (err) {
        console.warn('Could not refresh user from DB:', err);
      }
    }
    fetchFreshUser();
  }, [token, updateUser]);

  // Load live orders from MongoDB Atlas
  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const allOrders = await res.json();
          if (Array.isArray(allOrders)) {
            if (user?.email) {
              const userOrders = allOrders.filter(
                (o) => o.customer?.email?.toLowerCase() === user.email.toLowerCase()
              );
              setOrders(userOrders.length > 0 ? userOrders : allOrders);
            } else {
              setOrders(allOrders);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, [user?.email]);

  // Handle Save Profile to Database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: user?.email,
          name: profileName.trim(),
          phone: profilePhone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateUser({ name: profileName.trim(), phone: profilePhone.trim() });
        setProfileSuccess('Profile details successfully saved to database!');
        setTimeout(() => setProfileSuccess(null), 4000);
      } else {
        setProfileError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError((err as Error).message);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Add Address to Database
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFullName || !newAddrPhone || !newAddrStreet || !newAddrCity || !newAddrPincode) {
      setAddressError('Please fill in all mandatory address fields.');
      return;
    }

    setAddressSaving(true);
    setAddressError(null);
    setAddressSuccess(null);

    try {
      const res = await fetch('/api/auth/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: user?.email,
          fullName: newAddrFullName.trim(),
          phone: newAddrPhone.trim(),
          street: newAddrStreet.trim(),
          landmark: newAddrLandmark.trim(),
          city: newAddrCity.trim(),
          district: newAddrDistrict,
          state: 'Kerala',
          pincode: newAddrPincode.trim(),
          isDefault: newAddrIsDefault,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateUser({ addresses: data.addresses });
        setAddressSuccess('Address saved to MongoDB Atlas database successfully!');
        setShowAddAddress(false);
        // Reset form
        setNewAddrFullName('');
        setNewAddrPhone('');
        setNewAddrStreet('');
        setNewAddrLandmark('');
        setNewAddrCity('');
        setNewAddrPincode('');
        setNewAddrIsDefault(false);
        setTimeout(() => setAddressSuccess(null), 4000);
      } else {
        setAddressError(data.error || 'Failed to save address');
      }
    } catch (err) {
      setAddressError((err as Error).message);
    } finally {
      setAddressSaving(false);
    }
  };

  // Handle Delete Address from Database
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    setDeletingAddressId(addressId);
    try {
      const res = await fetch(`/api/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateUser({ addresses: data.addresses });
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    } finally {
      setDeletingAddressId(null);
    }
  };

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

  const steps = ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 5;
    if (s.includes('ship')) return 4;
    if (s.includes('pack')) return 3;
    if (s.includes('process')) return 2;
    if (s.includes('confirm')) return 1;
    return 0;
  };

  const savedAddresses: UserAddress[] = user?.addresses || [];

  // If user is not logged in, show only the focused login/signup card
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-[#F5F7F9] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xl text-center relative overflow-hidden animate-in fade-in duration-200">
          {/* Top Brand Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0097F3] via-[#017ED0] to-[#0097F3] absolute top-0 left-0 right-0" />

          {/* Logo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center mx-auto mb-4 border border-brand-lightBlue/60 shadow-xs p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo/Kochuvila Logo.png"
              alt="Kochuvila Agencies"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-black font-display tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Sign in to track your orders in real-time, view warranty records, and manage your delivery addresses.
          </p>

          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 px-5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs sm:text-sm font-bold shadow-button transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-brand-border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Create New Account</span>
            </button>
          </div>

          {/* Quick Perks */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10.5px] sm:text-[11px] text-slate-600 font-medium">
            <div className="flex flex-col items-center">
              <Package className="w-4 h-4 mb-1 text-brand-primary" />
              <span>Live Tracking</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 mb-1 text-emerald-600" />
              <span>Kerala Warranty</span>
            </div>
            <div className="flex flex-col items-center">
              <Tag className="w-4 h-4 mb-1 text-brand-primary" />
              <span>Festival Deals</span>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F9] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <span className="font-semibold text-black">Customer Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black font-display uppercase tracking-tight">
            My Account & Orders
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-brand-border shadow-card flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center font-black text-lg sm:text-xl border border-brand-lightBlue/60 shrink-0">
                {user.name ? user.name[0].toUpperCase() : 'K'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm sm:text-base text-black truncate">
                  {user.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {user.role === 'admin' ? 'Administrator' : 'Verified Customer'}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[10.5px] sm:text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Horizontal Navigation Tabs (Visible on small screens) */}
            <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-white rounded-2xl border border-brand-border shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Addresses ({savedAddresses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Coupons</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Concierge</span>
              </button>
            </div>

            {/* Desktop Navigation Tabs (Visible on lg+) */}
            <div className="hidden lg:block bg-white rounded-3xl p-3 border border-brand-border shadow-card space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>My Orders ({orders.length})</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4" />
                  <span>Personal Details & Phone</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F5F7F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Addresses ({savedAddresses.length})</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
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
                    Order History ({orders.length})
                  </h2>
                  <span className="text-xs text-slate-500">Connected to MongoDB Database</span>
                </div>

                {ordersLoading ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Loading orders from database...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-4">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="font-bold text-black text-sm">No Orders Yet</h3>
                      <p className="text-xs text-slate-500 mt-1">Browse our home appliances and solid teakwood catalog</p>
                    </div>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-button hover:bg-brand-deepBlue transition-all"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const stepIdx = getStepIndex(order.orderStatus);
                    return (
                      <div
                        key={order._id || order.orderNumber}
                        className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
                            <span className="font-mono font-black text-black">{order.orderNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer</span>
                            <span className="font-bold text-slate-800">{order.customer?.fullName || order.customer?.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment</span>
                            <span className="font-bold text-brand-deepBlue uppercase">{order.paymentMethod || 'Online'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                            <span className="font-black text-black text-sm">{formatINR(order.totalAmount || order.subtotal)}</span>
                          </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="py-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-black uppercase tracking-wider">
                              Shipment Status:{' '}
                              <span className="text-brand-primary">{order.orderStatus || 'Confirmed'}</span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Estimated 2-3 Days across Kerala
                            </span>
                          </div>

                          <div className="relative flex items-center justify-between pt-2">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary z-0 transition-all duration-500"
                              style={{
                                width: `${(stepIdx / (steps.length - 1)) * 100}%`,
                              }}
                            />

                            {steps.map((step, idx) => {
                              const isDone = idx <= stepIdx;
                              return (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                      isDone
                                        ? 'bg-brand-primary text-white shadow-xs'
                                        : 'bg-white text-slate-400 border border-slate-300'
                                    }`}
                                  >
                                    {isDone ? <Check className="w-3 h-3 text-white stroke-[3px]" /> : idx + 1}
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

                        {/* Courier & Tracking Badge */}
                        {(order.trackingId || order.courierService) && (
                          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-brand-primary bg-white px-2 py-0.5 rounded border border-blue-200 text-[10px] uppercase inline-flex items-center gap-1">
                                <Truck className="w-3 h-3 text-brand-primary" />
                                <span>{order.courierService || 'Courier'}</span>
                              </span>
                              <span className="text-slate-600 font-medium">Tracking / AWB:</span>
                              <span className="font-mono font-bold text-black select-all">{order.trackingId || 'N/A'}</span>
                            </div>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-primary font-bold hover:underline text-[11px]"
                              >
                                Carrier Tracking Site →
                              </a>
                            )}
                          </div>
                        )}

                        {/* Order Items */}
                        {(order.items || []).map((item: any, i: number) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#F5F7F9] border border-brand-border"
                          >
                            <div className="w-16 h-16 rounded-xl bg-white p-2 border border-brand-border flex items-center justify-center shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80'}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-deepBlue">
                                {item.brand || 'Kochuvila'}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-black line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Genuine Manufacturer Warranty</span>
                              </p>
                            </div>

                            <div className="text-right sm:shrink-0">
                              <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                              <p className="text-sm font-black text-black">{formatINR(item.price)}</p>
                            </div>
                          </div>
                        ))}

                        {/* Footer Address & Actions */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <p className="text-slate-500 max-w-sm truncate text-[11px]">
                            <strong>Ship To:</strong>{' '}
                            {order.customer?.address?.street
                              ? `${order.customer.address.street}, ${order.customer.address.city}, ${order.customer.address.district} - ${order.customer.address.pincode}`
                              : 'Kochuvila Buildings, Pangode Junction, Trivandrum'}
                          </p>
                          <div className="flex gap-2">
                            <Link
                              href={`/track-order?orderId=${order.orderNumber}`}
                              className="px-4 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl transition-all shadow-button"
                            >
                              Live Track
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-black uppercase tracking-tight">
                    Personal Information
                  </h2>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                    Saved in MongoDB Atlas
                  </span>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#F5F7F9] border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:bg-white focus:border-brand-primary outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                        Email Address (Verified Account)
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={user?.email || 'customer@kochuvila.com'}
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 border border-brand-border text-[11px] sm:text-xs font-semibold text-slate-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                        Contact Phone (WhatsApp)
                      </label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 97451 11141"
                        required
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#F5F7F9] border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:bg-white focus:border-brand-primary outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                        Showroom Service Region
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Kerala (Trivandrum & Kollam Service Hubs)"
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 border border-brand-border text-[11px] sm:text-xs font-semibold text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-black shadow-button transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-black uppercase tracking-tight">
                      Saved Delivery Addresses ({savedAddresses.length})
                    </h2>
                    <p className="text-xs text-slate-500">Live delivery records stored directly in MongoDB Atlas</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold flex items-center gap-1.5 shadow-button transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {addressSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{addressSuccess}</span>
                  </div>
                )}

                {addressError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{addressError}</span>
                  </div>
                )}

                {/* ADD ADDRESS FORM */}
                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="p-6 rounded-2xl border-2 border-brand-primary/40 bg-brand-lightBlueSoft/20 space-y-4 text-xs">
                    <h3 className="font-black text-sm text-black flex items-center gap-2">
                      <Building className="w-4 h-4 text-brand-primary" />
                      Add New Kerala Delivery Address
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrFullName}
                          onChange={(e) => setNewAddrFullName(e.target.value)}
                          placeholder="e.g. Kochuvila Customer"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          Phone Number (for Courier Delivery) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder="+91 97451 11141"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          House / Building / Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          placeholder="e.g. Kochuvila Buildings, Pangode Junction"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={newAddrLandmark}
                          onChange={(e) => setNewAddrLandmark(e.target.value)}
                          placeholder="Opposite Pangode Police Station"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          placeholder="e.g. Pangode / Trivandrum"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          District (Kerala) *
                        </label>
                        <select
                          value={newAddrDistrict}
                          onChange={(e) => setNewAddrDistrict(e.target.value)}
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs font-semibold text-black focus:border-brand-primary outline-hidden"
                        >
                          {KERALA_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                          PIN Code (6 digits) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddrPincode}
                          onChange={(e) => setNewAddrPincode(e.target.value)}
                          placeholder="695609"
                          className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-brand-border text-[11px] sm:text-xs placeholder:text-[10.5px] sm:placeholder:text-[11.5px] font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="defaultAddr"
                        checked={newAddrIsDefault}
                        onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                      />
                      <label htmlFor="defaultAddr" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Set as primary default delivery address
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 rounded-xl border border-brand-border text-slate-600 text-xs font-bold hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-black shadow-button transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {addressSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Address...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Address to Database</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ADDRESSES LIST */}
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-brand-border rounded-2xl space-y-2">
                    <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">No addresses saved in database yet.</p>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="text-xs font-black text-brand-primary hover:underline"
                    >
                      + Add your first address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id || `${addr.street}-${addr.pincode}`}
                        className={`p-5 rounded-2xl border transition-all space-y-2 text-xs ${
                          addr.isDefault
                            ? 'border-brand-primary bg-brand-lightBlueSoft/30 shadow-xs'
                            : 'border-brand-border bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-black">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase">
                                Default
                              </span>
                            )}
                          </div>

                          {addr._id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr._id!)}
                              disabled={deletingAddressId === addr._id}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete address"
                            >
                              {deletingAddressId === addr._id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        <p className="text-slate-700 leading-relaxed font-medium">
                          {addr.street}
                          {addr.landmark ? `, Near ${addr.landmark}` : ''}
                          <br />
                          {addr.city}, {addr.district}, {addr.state || 'Kerala'} — PIN {addr.pincode}
                          <br />
                          <span className="text-slate-900 font-bold">Contact Phone:</span> {addr.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
                <div>
                  <h2 className="text-lg font-black text-black uppercase tracking-tight">
                    Showroom Support & Inquiries
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect directly with our master craftsmen or showroom managers
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-2xl bg-[#F5F7F9] border border-brand-border space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Head Showroom</span>
                    <h4 className="font-black text-black">Kochuvila Agencies, Pangode</h4>
                    <p className="text-slate-600">Kochuvila Buildings, Pangode Junction, Trivandrum 695609</p>
                    <a
                      href="tel:+919745111141"
                      className="inline-flex items-center gap-1.5 font-bold text-brand-primary hover:underline pt-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +91 97451 11141
                    </a>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F5F7F9] border border-brand-border space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Customer Desk</span>
                    <h4 className="font-black text-black">WhatsApp Concierge</h4>
                    <p className="text-slate-600">Quick answers on appliance warranties, custom teak dining, and deliveries</p>
                    <a
                      href="https://wa.me/919745111141"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:underline pt-1"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
