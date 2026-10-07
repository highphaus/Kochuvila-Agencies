'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  Eye,
  LogOut,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Product, Order, Category, Brand } from '@/types';
import { formatINR } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface AdminDashboardClientProps {
  initialProducts: Product[];
  initialOrders: Order[];
  initialCategories: Category[];
  initialBrands: Brand[];
}

export default function AdminDashboardClient({
  initialProducts,
  initialOrders,
  initialCategories,
  initialBrands,
}: AdminDashboardClientProps) {
  const { user, token, setAuth, logout } = useAuthStore();

  // Authentication State
  const [emailInput, setEmailInput] = useState('admin@kochuvila.com');
  const [passwordInput, setPasswordInput] = useState('KochuvilaAdmin@2026');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'system'>('orders');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'LG',
    category: 'appliances',
    subcategory: 'refrigerators',
    mrp: 50000,
    price: 39990,
    stock: 10,
    description: '',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAuth(data.user, data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Failed to sign in. Please verify connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        setStatusMessage(`Order ${orderId} updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteProduct = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully seeded ${data.counts.products} products and ${data.counts.categories} categories!`);
        window.location.reload();
      }
    } catch (err) {
      alert('Error triggering database seed');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          images: [newProduct.image],
        }),
      });
      const created = await res.json();
      if (res.ok) {
        setProducts([created, ...products]);
        setShowAddProductModal(false);
        setStatusMessage(`Product "${created.name}" created successfully!`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      alert('Error creating product');
    }
  };

  // If not authenticated as admin, display Login Gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-[#f8fbfe] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-brand-border shadow-elevated space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-brand-dark font-display">
              Kochuvila Admin Portal
            </h1>
            <p className="text-xs text-slate-500">
              Sign in with your showroom manager credentials to manage catalog, orders, and pricing.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-xl shadow-button transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In to Portal'}
            </button>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Pre-configured Manager Access:</p>
              <p>Email: <code className="text-brand-primary">admin@kochuvila.com</code></p>
              <p>Password: <code className="text-brand-primary">KochuvilaAdmin@2026</code></p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders =
    orderStatusFilter === 'All'
      ? orders
      : orders.filter((o) => o.orderStatus === orderStatusFilter);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchProductQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top bar with Admin profile and Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              Store Management Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display">
              Kochuvila Agencies Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600">
              Logged in as <strong className="text-slate-900">{user.name}</strong>
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Products</p>
              <p className="text-2xl font-black text-brand-dark mt-1">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-brand-primary rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Orders Received</p>
              <p className="text-2xl font-black text-brand-dark mt-1">{orders.length}</p>
            </div>
            <div className="p-3 bg-cyan-50 text-brand-accent rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Order Value</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{formatINR(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Stock Alerts</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{lowStockCount} items</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-brand-border text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'system'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Database & Seed Tools
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-slate-500 font-semibold">Filter by Status:</span>
                {['All', 'Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-brand-primary text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-brand-border uppercase text-[11px] font-bold text-stone-600">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer & Kerala Destination</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status & Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          No orders found matching status "{orderStatusFilter}".
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-stone-900">
                            {ord.orderNumber}
                            <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-stone-900">{ord.customer.fullName}</p>
                            <p className="text-stone-500 text-[11px]">{ord.customer.phone}</p>
                            <p className="text-stone-500 text-[11px] truncate max-w-xs">
                              {ord.customer.address.city}, {ord.customer.address.district}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-stone-800">
                              {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate max-w-xs">
                              {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                            </p>
                          </td>
                          <td className="py-4 px-4 font-black text-brand-dark text-sm">
                            {formatINR(ord.totalAmount)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  ord.orderNumber,
                                  e.target.value as Order['orderStatus']
                                )
                              }
                              className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search products by title or brand..."
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-xl shadow-button transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Appliance / Furniture
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-brand-border uppercase text-[11px] font-bold text-slate-600">
                    <tr>
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Brand</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / MRP</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-sm">
                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.brand}</td>
                        <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                          {p.category} / {p.subcategory}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-slate-900">{formatINR(p.price)}</span>
                          {p.mrp > p.price && (
                            <span className="text-[11px] text-slate-400 line-through ml-1.5">
                              {formatINR(p.mrp)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stock > 3
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <a
                            href={`/product/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-100 inline-block"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.slug)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: System & Seeding */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Catalog & Database Synchronization
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Populate MongoDB with the full retail collection (all 30+ appliances and furniture models with specs and prices).
              </p>
            </div>

            <div className="p-4 bg-blue-50/40 rounded-2xl border border-brand-border space-y-3 text-xs text-slate-700">
              <h4 className="font-bold text-brand-dark">Catalog Contents Ready for Synchronization:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• 30+ Appliances & Furniture Items (Refrigerators, Washers, 4K TVs, Split ACs, Sofas, Teak Beds, Dining)</li>
                <li>• 10 Official Brand Partners (LG, Samsung, Whirlpool, Godrej, Sony, Bosch, Nilkamal, Prestige)</li>
                <li>• 8 Core Categories with Subcategories</li>
                <li>• Promotional Coupon Codes (<code>FESTIVE2500</code>, <code>WELCOME500</code>, <code>KERALA10</code>)</li>
              </ul>
            </div>

            <div>
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Synchronizing...' : 'Run Database Seed & Synchronize'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-brand-dark">Add New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    placeholder="e.g. Whirlpool 265L 3-Star Double Door Refrigerator"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="appliances">Appliances</option>
                      <option value="furniture">Furniture</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.mrp}
                      onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-xl shadow-button"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
