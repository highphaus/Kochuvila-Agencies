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
  ExternalLink,
  Clock,
  Sparkles,
  ChevronRight,
  ShoppingBag,
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

function formatDate(dateString?: string): string {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

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
        setProfileSuccess('Profile details successfully saved!');
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
        setAddressSuccess('Delivery address saved successfully!');
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
      tag: 'Teak Furniture',
      desc: 'Applicable on all handcrafted solid teakwood living, bedroom and dining furniture.',
      minSpend: 'Min. Order ₹25,000',
    },
    {
      code: 'FESTIVAL5',
      discount: '₹5,000 FLAT OFF',
      tag: 'Festive Mega Offer',
      desc: 'Mega festive savings on Double-Door Fridges, Inverter ACs, and 65-inch 4K TVs.',
      minSpend: 'Min. Order ₹40,000',
    },
    {
      code: 'WELCOME500',
      discount: '₹500 OFF',
      tag: 'Welcome Voucher',
      desc: 'Instant first-order discount on kitchen chimneys, mixer grinders & small appliances.',
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

  // ----------------------------------------------------
  // LOGGED-OUT STATE
  // ----------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-[82vh] bg-[#F8FAFC] flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-xl text-center relative overflow-hidden animate-in fade-in duration-200">
          {/* Top Brand Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-[#017ED0] to-brand-primary absolute top-0 left-0 right-0" />

          {/* Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center mx-auto mb-5 border border-brand-lightBlue/60 shadow-xs p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo/Kochuvila Logo.png"
              alt="Kochuvila Agencies"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
            Track your appliance & furniture shipments live across Kerala, view invoices, and manage your delivery addresses.
          </p>

          <div className="mt-6 sm:mt-7 space-y-3">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-sm font-bold shadow-button transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <span>Sign In to Customer Portal</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Create New Account</span>
            </button>
          </div>

          {/* Perks Grid */}
          <div className="mt-7 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2.5 text-center text-xs text-slate-600 font-medium">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5 text-brand-primary">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[11px] sm:text-xs text-slate-800">Live Tracking</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1.5 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[11px] sm:text-xs text-slate-800">Warranty Pass</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-1.5 text-amber-600">
                <Tag className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[11px] sm:text-xs text-slate-800">VIP Offers</span>
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

  // ----------------------------------------------------
  // LOGGED-IN CUSTOMER PORTAL
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-5 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Page Heading */}
        <div className="mb-5 sm:mb-7 pb-4 sm:pb-5 border-b border-slate-200/80">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-800">Customer Portal</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-display tracking-tight">
                My Account & Orders
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Welcome back, <strong className="text-slate-800 font-bold">{user.name || 'Valued Customer'}</strong> · Manage your deliveries & personal preferences
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{user.role === 'admin' ? 'Administrator' : 'Verified Member'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Profile Card & Navigation Tabs               */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-card">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-deepBlue text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm shrink-0">
                  {user.name ? user.name.trim()[0].toUpperCase() : 'K'}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                    {user.name || 'Kochuvila Customer'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{user.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Quick Row: Status & Logout Button */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Kerala Service Hub
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/70 transition-all cursor-pointer"
                  title="Log out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Horizontal Navigation Tabs (Visible on < lg) */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth snap-x snap-mandatory">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Orders</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'orders' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Addresses</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'addresses' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {savedAddresses.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className={`snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeTab === 'coupons'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>Coupons</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('support')}
                  className={`snap-start flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeTab === 'support'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Headphones className="w-4 h-4 shrink-0" />
                  <span>Concierge</span>
                </button>
              </div>
            </div>

            {/* Desktop Navigation Sidebar (Visible on lg+) */}
            <div className="hidden lg:block bg-white rounded-3xl p-3 border border-slate-200/90 shadow-card space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <span>My Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    activeTab === 'orders' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {orders.length}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'profile' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span>Personal Details & Phone</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Delivery Addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    activeTab === 'addresses' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {savedAddresses.length}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Tag className="w-4 h-4" />
                  </div>
                  <span>Coupons & Offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    VIP
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'support' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span>Showroom Concierge</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Quick Showroom Contact Card */}
            <div className="hidden lg:block bg-linear-to-br from-brand-lightBlueSoft/60 to-white rounded-3xl p-5 border border-brand-lightBlue/50 text-xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Showroom Hotline</span>
              </span>
              <p className="font-bold text-slate-900 text-sm">
                Kochuvila Agencies, Pangode
              </p>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                Open Mon-Sun 9:00 AM - 8:30 PM. For instant order queries, speak to our delivery manager.
              </p>
              <a
                href="tel:+919745111141"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-deepBlue hover:underline pt-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 97451 11141</span>
              </a>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Active Tab Content Area                     */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ------------------------------------------------------- */}
            {/* TAB 1: ORDERS & SHIPMENT TRACKING                       */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'orders' && (
              <div className="space-y-5 sm:space-y-6">
                
                {/* Orders Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                      Order History ({orders.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time shipment tracking for your appliances and furniture orders
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-deepBlue hover:underline"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/90 shadow-card space-y-3">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                    <p className="text-sm font-bold text-slate-700">Loading your orders...</p>
                    <p className="text-xs text-slate-400">Fetching live tracking status from server</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/90 shadow-card space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="max-w-sm mx-auto">
                      <h3 className="font-black text-slate-900 text-base sm:text-lg">No Orders Placed Yet</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        Explore our premium Kerala home appliances, kitchen chimneys, smart TVs, and solid teakwood living sets.
                      </p>
                    </div>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-xs sm:text-sm shadow-button hover:bg-brand-deepBlue transition-all active:scale-98"
                    >
                      <Package className="w-4 h-4" />
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const stepIdx = getStepIndex(order.orderStatus);
                    return (
                      <div
                        key={order._id || order.orderNumber}
                        className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/90 shadow-card space-y-5 transition-all"
                      >
                        {/* Order Meta Bar - Responsive 4-Column Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70">
                          <div>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Order ID
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-black text-slate-900 break-all">
                              {order.orderNumber}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Date
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Payment
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-brand-deepBlue uppercase">
                              {order.paymentMethod || 'Online'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Total Amount
                            </span>
                            <span className="text-sm sm:text-base font-black text-slate-900">
                              {formatINR(order.totalAmount || order.subtotal)}
                            </span>
                          </div>
                        </div>

                        {/* Shipment Status & Progress Stepper */}
                        <div className="space-y-3 py-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Status:
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-blue-50 text-brand-primary border border-blue-200/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                                {order.orderStatus || 'Confirmed'}
                              </span>
                            </div>

                            <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200/80 self-start sm:self-auto">
                              Estimated 2-3 Days Delivery Across Kerala
                            </span>
                          </div>

                          {/* Desktop Stepper (Visible on sm+) */}
                          <div className="hidden sm:block relative pt-3 pb-1">
                            <div className="relative flex items-center justify-between">
                              <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                              <div
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-1 bg-brand-primary z-0 transition-all duration-500"
                                style={{
                                  width: `calc(${(stepIdx / (steps.length - 1)) * 100}% - 24px)`,
                                }}
                              />

                              {steps.map((step, idx) => {
                                const isDone = idx <= stepIdx;
                                return (
                                  <div key={step} className="relative z-10 flex flex-col items-center">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                        isDone
                                          ? 'bg-brand-primary text-white shadow-xs'
                                          : 'bg-white text-slate-400 border border-slate-300'
                                      }`}
                                    >
                                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : idx + 1}
                                    </div>
                                    <span
                                      className={`text-[11px] mt-1.5 font-bold tracking-tight text-center ${
                                        isDone ? 'text-slate-900' : 'text-slate-400'
                                      }`}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mobile Stepper Summary (Visible on < sm) */}
                          <div className="sm:hidden bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600">
                                Step {stepIdx + 1} of {steps.length}: <strong className="text-slate-900">{steps[stepIdx]}</strong>
                              </span>
                              <span className="text-brand-primary font-black">
                                {Math.round(((stepIdx + 1) / steps.length) * 100)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-primary transition-all duration-500 rounded-full"
                                style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-semibold">
                              <span>Placed</span>
                              <span>Shipped</span>
                              <span>Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Courier & Tracking Badge (if available) */}
                        {(order.trackingId || order.courierService) && (
                          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-brand-primary bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] uppercase inline-flex items-center gap-1.5 shadow-2xs">
                                <Truck className="w-3.5 h-3.5 text-brand-primary" />
                                <span>{order.courierService || 'Courier Partner'}</span>
                              </span>
                              <span className="text-slate-600 font-medium">Tracking / AWB:</span>
                              <span className="font-mono font-bold text-slate-900 select-all bg-white/70 px-2 py-0.5 rounded border border-blue-100">
                                {order.trackingId || 'In Transit'}
                              </span>
                            </div>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand-primary font-bold hover:underline text-xs"
                              >
                                <span>Carrier Live Portal</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Order Items List */}
                        <div className="space-y-2.5">
                          {(order.items || []).map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:border-slate-300 transition-colors"
                            >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-2 border border-slate-200/80 flex items-center justify-center shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80'}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-brand-deepBlue block">
                                  {item.brand || 'Kochuvila Exclusive'}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 sm:line-clamp-2">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Genuine Kerala Warranty</span>
                                </p>
                              </div>

                              <div className="text-right shrink-0 pl-2">
                                <span className="text-xs font-semibold text-slate-500 block">
                                  Qty: {item.quantity}
                                </span>
                                <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                                  {formatINR(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer: Shipping Destination & Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-1.5 text-slate-600 max-w-md">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="line-clamp-2 text-xs text-slate-600 font-medium">
                              <strong className="text-slate-800 font-bold">Delivering To:</strong>{' '}
                              {order.customer?.address?.street
                                ? `${order.customer.address.street}, ${order.customer.address.city}, ${order.customer.address.district} - ${order.customer.address.pincode}`
                                : 'Kochuvila Buildings, Pangode Junction, Trivandrum 695609'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-stretch sm:self-auto">
                            <Link
                              href={`/track-order?orderId=${order.orderNumber}`}
                              className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl transition-all shadow-button text-center text-xs active:scale-98"
                            >
                              Live Tracking Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* TAB 2: PROFILE INFORMATION                              */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                      Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Update your primary contact details used for delivery coordination
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200/80 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Synchronized Account</span>
                  </span>
                </div>

                {profileSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        placeholder="e.g. Rahul Nair"
                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-primary outline-hidden transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Email Address (Verified)
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={user?.email || 'customer@kochuvila.com'}
                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-600 cursor-not-allowed select-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 97451 11141"
                        required
                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-primary outline-hidden transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Showroom Service Region
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Kerala (Trivandrum & Kollam Service Hubs)"
                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-sm font-black shadow-button transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* TAB 3: SAVED DELIVERY ADDRESSES                         */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                      Delivery Addresses ({savedAddresses.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage delivery destinations across Kerala for fast doorstep dispatch
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-button transition-all cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddAddress ? 'Close Form' : 'Add New Address'}</span>
                  </button>
                </div>

                {addressSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{addressSuccess}</span>
                  </div>
                )}

                {addressError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{addressError}</span>
                  </div>
                )}

                {/* ADD ADDRESS FORM */}
                {showAddAddress && (
                  <form
                    onSubmit={handleAddAddress}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-brand-primary/30 bg-brand-lightBlueSoft/30 space-y-4 animate-in fade-in"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-brand-primary/20">
                      <Building className="w-4 h-4 text-brand-primary shrink-0" />
                      <h3 className="font-black text-sm sm:text-base text-slate-900">
                        Add New Kerala Delivery Address
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Recipient Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrFullName}
                          onChange={(e) => setNewAddrFullName(e.target.value)}
                          placeholder="e.g. Sreejith V"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Delivery Contact Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder="+91 97451 11141"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          House / Building / Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          placeholder="e.g. Kochuvila Buildings, Pangode Junction"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={newAddrLandmark}
                          onChange={(e) => setNewAddrLandmark(e.target.value)}
                          placeholder="Near Pangode Police Station"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          placeholder="e.g. Pangode / Kallara"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Kerala District *
                        </label>
                        <select
                          value={newAddrDistrict}
                          onChange={(e) => setNewAddrDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        >
                          {KERALA_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          PIN Code (6 digits) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddrPincode}
                          onChange={(e) => setNewAddrPincode(e.target.value)}
                          placeholder="695609"
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 focus:border-brand-primary outline-hidden shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <input
                        type="checkbox"
                        id="defaultAddr"
                        checked={newAddrIsDefault}
                        onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <label htmlFor="defaultAddr" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                        Set as primary default delivery destination
                      </label>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs sm:text-sm font-black shadow-button transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
                      >
                        {addressSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving Address...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Delivery Address</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* SAVED ADDRESSES GRID */}
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">No Addresses Saved Yet</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add your residence or business address in Kerala for seamless one-click checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add your first delivery address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id || `${addr.street}-${addr.pincode}`}
                        className={`p-5 rounded-2xl border transition-all space-y-3 relative flex flex-col justify-between ${
                          addr.isDefault
                            ? 'border-brand-primary/80 bg-brand-lightBlueSoft/30 shadow-xs ring-1 ring-brand-primary/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm sm:text-base text-slate-900">
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>

                            {addr._id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr._id!)}
                                disabled={deletingAddressId === addr._id}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                                title="Remove address"
                              >
                                {deletingAddressId === addr._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                            {addr.street}
                            {addr.landmark ? `, Near ${addr.landmark}` : ''}
                            <br />
                            {addr.city}, {addr.district}, {addr.state || 'Kerala'} — PIN {addr.pincode}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-500 font-semibold flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{addr.phone}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* TAB 4: COUPONS & VIP SAVINGS                            */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Exclusive Festival & VIP Coupons
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Apply these verified discount codes at checkout for instant order deductions
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-5 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] hover:border-brand-primary/60 transition-all space-y-3.5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-lightBlueSoft text-brand-primary border border-brand-lightBlue/60">
                            {c.tag}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Verified
                          </span>
                        </div>

                        <div className="mt-2.5">
                          <span className="text-xl sm:text-2xl font-black text-brand-deepBlue font-display tracking-tight">
                            {c.discount}
                          </span>
                          <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed">
                            {c.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-black text-xs text-slate-900 tracking-wider">
                            {c.code}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCoupon(c.code)}
                            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-deepBlue transition-colors cursor-pointer"
                          >
                            {copiedCode === c.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <span className="text-[10.5px] text-slate-500 font-semibold block">
                          {c.minSpend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* TAB 5: SHOWROOM CONCIERGE & SUPPORT                     */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Showroom Concierge & Order Assistance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect directly with our master craftsmen or showroom managers for fast support
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Head Showroom Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center mb-3">
                        <Building className="w-5 h-5" />
                      </div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                        Flagship Showroom
                      </span>
                      <h4 className="font-black text-base text-slate-900 mt-0.5">
                        Kochuvila Agencies, Pangode
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Kochuvila Buildings, Pangode Junction, Trivandrum, Kerala 695609
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Open 7 Days: 9:00 AM – 8:30 PM</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60">
                      <a
                        href="tel:+919745111141"
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white font-bold text-xs flex items-center justify-center gap-2 shadow-button transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call +91 97451 11141</span>
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp VIP Concierge */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 block">
                        VIP Priority Chat
                      </span>
                      <h4 className="font-black text-base text-slate-900 mt-0.5">
                        WhatsApp Concierge Desk
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Direct assistance for custom teak furniture orders, warranty certificates, and instant delivery updates.
                      </p>
                      <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Average response under 5 minutes</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-200/60">
                      <a
                        href="https://wa.me/919745111141?text=Hello%20Kochuvila%20Agencies%2C%20I%20have%20an%20inquiry%20regarding%20my%20account%20and%20orders."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
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
