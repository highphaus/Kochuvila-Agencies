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
  Image as ImageIcon,
  Users,
  Tag,
  Shield,
  ShieldCheck,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  X,
  Sliders,
  DollarSign,
  Percent,
  Star,
  MessageSquare,
  FileText,
  Zap,
  Award,
  CheckSquare,
} from 'lucide-react';
import { Product, Order, Category, Brand, Coupon, User, ProductVariant, ProductReview, SpecificationGroup, SpecificationItem } from '@/types';
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
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews' | 'coupons' | 'users'>('orders');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Search & Filter States
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [searchReviewQuery, setSearchReviewQuery] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');

  // Status & Feedback Messages
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Product Modal State (Add or Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productModalError, setProductModalError] = useState('');

  // Product Form Fields (Full Customization)
  const [productModalTab, setProductModalTab] = useState<
    'basics' | 'pricing' | 'specs' | 'specification_groups' | 'gallery' | 'variants' | 'description'
  >('basics');
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBrand, setFormBrand] = useState('LG');
  const [formCategory, setFormCategory] = useState('appliances');
  const [formSubcategory, setFormSubcategory] = useState('refrigerators');
  const [formPrice, setFormPrice] = useState<number>(39990);
  const [formMrp, setFormMrp] = useState<number>(49990);
  const [formStock, setFormStock] = useState<number>(10);
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formSku, setFormSku] = useState('');
  const [formEnergyRating, setFormEnergyRating] = useState('5 Star');
  const [formCapacity, setFormCapacity] = useState('');
  const [formWarranty, setFormWarranty] = useState('1 Year Manufacturer Warranty');
  const [formDimensions, setFormDimensions] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formDeliveryInfo, setFormDeliveryInfo] = useState('Fast Doorstep Delivery Across Kerala (24-48 hrs)');
  const [formTags, setFormTags] = useState('kerala, appliances, inverter');
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  const [formIsDeal, setFormIsDeal] = useState<boolean>(false);
  const [formDealTag, setFormDealTag] = useState('');
  const [formIsPublished, setFormIsPublished] = useState<boolean>(true);
  const [formRating, setFormRating] = useState<number>(5.0);
  const [formReviewCount, setFormReviewCount] = useState<number>(0);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formSpecifications, setFormSpecifications] = useState<SpecificationGroup[]>([]);
  
  // More Images for one product (gallery)
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants for one product
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  // Review Modal State (Add or Edit)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewModalError, setReviewModalError] = useState('');
  const [formReviewProductId, setFormReviewProductId] = useState('');
  const [formReviewProductName, setFormReviewProductName] = useState('');
  const [formReviewUserName, setFormReviewUserName] = useState('');
  const [formReviewUserEmail, setFormReviewUserEmail] = useState('');
  const [formReviewRating, setFormReviewRating] = useState<number>(5);
  const [formReviewHeadline, setFormReviewHeadline] = useState('');
  const [formReviewComment, setFormReviewComment] = useState('');
  const [formReviewVerified, setFormReviewVerified] = useState<boolean>(true);

  // Tracking & Courier Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [courierServiceInput, setCourierServiceInput] = useState('Delhivery');
  const [customCourierInput, setCustomCourierInput] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [trackingStatusInput, setTrackingStatusInput] = useState<Order['orderStatus']>('Shipped');
  const [trackingNotesInput, setTrackingNotesInput] = useState('');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  // Coupon Modal State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(10000);
  const [couponMaxCap, setCouponMaxCap] = useState<number>(5000);
  const [couponDescription, setCouponDescription] = useState('');
  const [couponSaving, setCouponSaving] = useState(false);

  const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || '/api';

  // Load reviews from MongoDB
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_URL}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Could not load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load coupons from MongoDB
  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch(`${API_URL}/coupons`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Could not load coupons:', err);
    } finally {
      setCouponsLoading(false);
    }
  };

  // Load users from MongoDB
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      }
    } catch (err) {
      console.warn('Could not load users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCoupons();
      fetchUsers();
      fetchReviews();
    }
  }, [user]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 0 || p.inStock === false).length;

  // 1. ADMIN LOGIN
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
        if (data.user?.role !== 'admin') {
          setLoginError('Access denied: This portal is reserved for Kochuvila Administrators.');
          return;
        }
        setAuth(data.user, data.token);
      } else {
        setLoginError(data.error || 'Invalid administrator credentials');
      }
    } catch {
      setLoginError('Failed to sign in. Please verify connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. ORDER STATUS UPDATE
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
    } catch {
      alert('Failed to update status');
    }
  };

  // 2b. TRACKING & COURIER DISPATCH HANDLERS
  const handleOpenTrackingModal = (order: Order) => {
    setTrackingModalOrder(order);
    const existingCourier = order.courierService || 'Delhivery';
    const knownCouriers = ['Delhivery', 'Blue Dart', 'DTDC', 'India Post / Speed Post', 'Kochuvila Express (Own Fleet)'];
    if (knownCouriers.includes(existingCourier)) {
      setCourierServiceInput(existingCourier);
      setCustomCourierInput('');
    } else if (existingCourier) {
      setCourierServiceInput('Other');
      setCustomCourierInput(existingCourier);
    } else {
      setCourierServiceInput('Delhivery');
      setCustomCourierInput('');
    }
    setTrackingIdInput(order.trackingId || '');
    setTrackingUrlInput(order.trackingUrl || '');
    setTrackingStatusInput(
      order.orderStatus === 'Order Placed' || order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Packed'
        ? 'Shipped'
        : order.orderStatus
    );
    setTrackingNotesInput('');
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    setIsUpdatingTracking(true);

    const finalCourier =
      courierServiceInput === 'Other' ? customCourierInput.trim() : courierServiceInput.trim();

    try {
      const res = await fetch(`${API_URL}/orders/${trackingModalOrder.orderNumber || trackingModalOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: trackingStatusInput,
          courierService: finalCourier,
          trackingId: trackingIdInput.trim(),
          trackingUrl: trackingUrlInput.trim() || undefined,
          notes:
            trackingNotesInput.trim() ||
            (finalCourier && trackingIdInput.trim()
              ? `Dispatched via ${finalCourier} (AWB: ${trackingIdInput.trim()})`
              : undefined),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id || o.orderNumber === updated.orderNumber ? updated : o))
        );
        setStatusMessage(`Tracking info for order ${trackingModalOrder.orderNumber} saved successfully!`);
        setTrackingModalOrder(null);
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert('Failed to save tracking details');
      }
    } catch {
      alert('Network error while saving tracking details');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  // 3. QUICK STOCK TOGGLE (IN STOCK <-> OUT OF STOCK)
  const handleToggleStock = async (product: Product) => {
    const nextInStock = product.inStock === false || product.stock <= 0 ? true : false;
    const nextStock = nextInStock ? (product.stock > 0 ? product.stock : 10) : 0;

    try {
      const res = await fetch(`${API_URL}/products/${product.slug}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: nextInStock, stock: nextStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, inStock: nextInStock, stock: nextStock } : p))
        );
        setStatusMessage(`Stock status for "${product.name}" updated to: ${nextInStock ? 'In Stock' : 'Out of Stock'}`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch {
      alert('Failed to update stock status');
    }
  };

  // 4. DELETE PRODUCT
  const handleDeleteProduct = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this product from the database?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setStatusMessage('Product removed from database');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch {
      alert('Failed to delete product');
    }
  };

  // 5. OPEN ADD / EDIT PRODUCT MODAL (FULL CUSTOMIZATION)
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductModalTab('basics');
    setFormName('');
    setFormSlug('');
    setFormBrand('LG');
    setFormCategory('appliances');
    setFormSubcategory('refrigerators');
    setFormPrice(39990);
    setFormMrp(49990);
    setFormStock(10);
    setFormInStock(true);
    setFormSku(`SKU-${Date.now().toString().slice(-6)}`);
    setFormEnergyRating('5 Star');
    setFormCapacity('655 Litres');
    setFormWarranty('1 Year Comprehensive + 10 Years on Compressor');
    setFormDimensions('');
    setFormWeight('');
    setFormDeliveryInfo('Fast Doorstep Delivery Across Kerala (24-48 hrs)');
    setFormTags('kerala, appliances, inverter, warranty');
    setFormIsFeatured(false);
    setFormIsDeal(false);
    setFormDealTag('Special Offer');
    setFormIsPublished(true);
    setFormRating(5.0);
    setFormReviewCount(0);
    setFormDescription('');
    setFormFeatures('');
    setFormSpecifications([
      {
        groupName: 'General Specifications',
        items: [
          { key: 'Model Name', value: '2026 Inverter Edition' },
          { key: 'Colour / Finish', value: 'Shiny Steel Finish' },
        ],
      },
    ]);
    setFormImages([
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80',
    ]);
    setNewImageUrl('');
    setFormVariants([]);
    setProductModalError('');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p._id);
    setProductModalTab('basics');
    setFormName(p.name);
    setFormSlug(p.slug || '');
    setFormBrand(p.brand || 'LG');
    setFormCategory(p.category || 'appliances');
    setFormSubcategory(p.subcategory || '');
    setFormPrice(p.price || 0);
    setFormMrp(p.mrp || p.price || 0);
    setFormStock(p.stock !== undefined ? p.stock : 10);
    setFormInStock(p.inStock !== false && p.stock > 0);
    setFormSku(p.sku || '');
    setFormEnergyRating(p.energyRating || '5 Star');
    setFormCapacity(p.capacity || '');
    setFormWarranty(p.warranty || '1 Year Manufacturer Warranty');
    setFormDimensions(p.dimensions || '');
    setFormWeight(p.weight || '');
    setFormDeliveryInfo(p.deliveryInfo || 'Fast Doorstep Delivery Across Kerala (24-48 hrs)');
    setFormTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
    setFormIsFeatured(!!p.isFeatured);
    setFormIsDeal(!!p.isDeal);
    setFormDealTag(p.dealTag || '');
    setFormIsPublished(p.isPublished !== false);
    setFormRating(p.rating || 5.0);
    setFormReviewCount(p.reviewCount || 0);
    setFormDescription(p.description || '');
    setFormFeatures(Array.isArray(p.features) ? p.features.join('\n') : '');
    setFormSpecifications(p.specifications && p.specifications.length > 0 ? JSON.parse(JSON.stringify(p.specifications)) : []);
    setFormImages(p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80']);
    setNewImageUrl('');
    setFormVariants(p.variants ? JSON.parse(JSON.stringify(p.variants)) : []);
    setProductModalError('');
    setShowProductModal(true);
  };

  // 6. SAVE PRODUCT (ADD OR EDIT WITH COMPLETE CUSTOMIZATION)
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      setProductModalError('Product Title and Selling Price are required.');
      return;
    }

    setProductSaving(true);
    setProductModalError('');

    const cleanImages = formImages.filter((img) => img.trim().length > 0);
    if (cleanImages.length === 0) {
      cleanImages.push('https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80');
    }

    const payload: Partial<Product> = {
      _id: editingProductId || undefined,
      name: formName.trim(),
      slug: formSlug.trim() || undefined,
      brand: formBrand.trim(),
      category: formCategory,
      subcategory: formSubcategory.trim(),
      price: Number(formPrice),
      mrp: Number(formMrp),
      stock: Number(formStock),
      inStock: formInStock,
      sku: formSku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      energyRating: formEnergyRating.trim() || undefined,
      capacity: formCapacity.trim() || undefined,
      warranty: formWarranty.trim(),
      dimensions: formDimensions.trim() || undefined,
      weight: formWeight.trim() || undefined,
      deliveryInfo: formDeliveryInfo.trim() || undefined,
      tags: formTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
      isFeatured: formIsFeatured,
      isDeal: formIsDeal,
      dealTag: formDealTag.trim() || undefined,
      isPublished: formIsPublished,
      rating: Number(formRating),
      reviewCount: Number(formReviewCount),
      description: formDescription.trim(),
      features: formFeatures.split('\n').map((f) => f.trim()).filter((f) => f.length > 0),
      specifications: formSpecifications,
      images: cleanImages,
      variants: formVariants,
    };

    try {
      const url = editingProductId ? `${API_URL}/products/${editingProductId}` : `${API_URL}/products`;
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const savedProduct = await res.json();
      if (res.ok) {
        if (editingProductId) {
          setProducts((prev) => prev.map((p) => (p._id === editingProductId ? savedProduct : p)));
          setStatusMessage(`Product "${savedProduct.name}" updated successfully in database!`);
        } else {
          setProducts((prev) => [savedProduct, ...prev]);
          setStatusMessage(`New product "${savedProduct.name}" created and saved to database!`);
        }
        setShowProductModal(false);
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        setProductModalError(savedProduct.error || 'Failed to save product');
      }
    } catch (err) {
      setProductModalError((err as Error).message);
    } finally {
      setProductSaving(false);
    }
  };

  // Image helpers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (formImages.length <= 1) {
      alert('A product must contain at least one primary image.');
      return;
    }
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Variant helpers
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      _id: `var-${Date.now()}`,
      name: formCategory === 'furniture' ? 'Dark Teak Polish (3-Seater)' : '55 Inch 4K UHD',
      sku: `${formSku || 'SKU'}-V${formVariants.length + 1}`,
      price: formPrice,
      mrp: formMrp,
      stock: 5,
      inStock: true,
      image: formImages[0] || '',
    };
    setFormVariants((prev) => [...prev, newVariant]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setFormVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Specification Group Helpers
  const handleAddSpecGroup = () => {
    const newGroup: SpecificationGroup = {
      groupName: 'New Specification Group',
      items: [{ key: 'Property', value: 'Detail' }],
    };
    setFormSpecifications((prev) => [...prev, newGroup]);
  };

  const handleUpdateSpecGroupName = (groupIndex: number, newName: string) => {
    setFormSpecifications((prev) => {
      const copy = [...prev];
      copy[groupIndex] = { ...copy[groupIndex], groupName: newName };
      return copy;
    });
  };

  const handleRemoveSpecGroup = (groupIndex: number) => {
    setFormSpecifications((prev) => prev.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddSpecItem = (groupIndex: number) => {
    setFormSpecifications((prev) => {
      const copy = [...prev];
      copy[groupIndex] = {
        ...copy[groupIndex],
        items: [...copy[groupIndex].items, { key: '', value: '' }],
      };
      return copy;
    });
  };

  const handleUpdateSpecItem = (
    groupIndex: number,
    itemIndex: number,
    field: 'key' | 'value',
    val: string
  ) => {
    setFormSpecifications((prev) => {
      const copy = [...prev];
      const itemsCopy = [...copy[groupIndex].items];
      itemsCopy[itemIndex] = { ...itemsCopy[itemIndex], [field]: val };
      copy[groupIndex] = { ...copy[groupIndex], items: itemsCopy };
      return copy;
    });
  };

  const handleRemoveSpecItem = (groupIndex: number, itemIndex: number) => {
    setFormSpecifications((prev) => {
      const copy = [...prev];
      copy[groupIndex] = {
        ...copy[groupIndex],
        items: copy[groupIndex].items.filter((_, idx) => idx !== itemIndex),
      };
      return copy;
    });
  };

  // 7. COUPON CREATION & MANAGEMENT
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponSaving(true);
    try {
      const payload: Partial<Coupon> = {
        code: couponCode.trim().toUpperCase(),
        discountType: couponType,
        discountPercentage: couponType === 'percentage' ? Number(couponValue) : 0,
        discountAmount: couponType === 'flat' ? Number(couponValue) : 0,
        minOrderAmount: Number(couponMinOrder),
        maxDiscountAmount: Number(couponMaxCap),
        description: couponDescription.trim() || `${couponValue}${couponType === 'percentage' ? '%' : '₹'} off on orders over ₹${couponMinOrder}`,
        isActive: true,
      };

      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons((prev) => [data.coupon, ...prev.filter((c) => c.code !== data.coupon.code)]);
        setShowCouponModal(false);
        setCouponCode('');
        setCouponDescription('');
        setStatusMessage(`Offer coupon ${data.coupon.code} created and saved in database!`);
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch {
      alert('Error saving coupon');
    } finally {
      setCouponSaving(false);
    }
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    const nextState = !coupon.isActive;
    try {
      const res = await fetch(`${API_URL}/coupons/${coupon._id || coupon.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id || c.code === coupon.code ? { ...c, isActive: nextState } : c))
        );
        setStatusMessage(`Coupon ${coupon.code} is now ${nextState ? 'Active' : 'Inactive'}`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch {
      alert('Failed to update coupon');
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}" permanently from database?`)) return;
    try {
      const res = await fetch(`${API_URL}/coupons/${id || code}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id && c.code !== code));
        setStatusMessage(`Coupon ${code} deleted from database`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch {
      alert('Failed to delete coupon');
    }
  };

  // 8. USER ROLE UPDATE (CUSTOMER <-> ADMIN)
  const handleUpdateUserRole = async (userId: string, newRole: 'customer' | 'admin') => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setStatusMessage(`User role successfully changed to ${newRole.toUpperCase()} in database!`);
        setTimeout(() => setStatusMessage(''), 3500);
      } else {
        alert(data.error || 'Failed to update user role');
      }
    } catch {
      alert('Error updating user role');
    }
  };

  // 9. REVIEW ACTIONS (ADD, EDIT, DELETE)
  const handleOpenAddReview = () => {
    setEditingReviewId(null);
    const defaultProd = products[0];
    setFormReviewProductId(defaultProd?._id || 'prod-app-01');
    setFormReviewProductName(defaultProd?.name || 'Selected Item');
    setFormReviewUserName('');
    setFormReviewUserEmail('');
    setFormReviewRating(5);
    setFormReviewHeadline('');
    setFormReviewComment('');
    setFormReviewVerified(true);
    setReviewModalError('');
    setShowReviewModal(true);
  };

  const handleOpenEditReview = (rev: ProductReview) => {
    setEditingReviewId(rev._id);
    setFormReviewProductId(rev.productId);
    setFormReviewProductName(rev.productName || '');
    setFormReviewUserName(rev.userName);
    setFormReviewUserEmail(rev.userEmail || '');
    setFormReviewRating(rev.rating);
    setFormReviewHeadline(rev.headline);
    setFormReviewComment(rev.comment);
    setFormReviewVerified(rev.verifiedPurchase !== false);
    setReviewModalError('');
    setShowReviewModal(true);
  };

  const handleSaveReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReviewUserName.trim() || !formReviewComment.trim()) {
      setReviewModalError('Reviewer Name and Review Comment are required.');
      return;
    }

    setReviewSaving(true);
    setReviewModalError('');

    const matchedProd = products.find((p) => p._id === formReviewProductId || p.slug === formReviewProductId);
    const finalProdName = formReviewProductName || matchedProd?.name || 'Selected Kerala Retail Item';

    const payload = {
      _id: editingReviewId || undefined,
      productId: formReviewProductId,
      productName: finalProdName,
      userName: formReviewUserName.trim(),
      userEmail: formReviewUserEmail.trim(),
      rating: Number(formReviewRating),
      headline: formReviewHeadline.trim() || 'Verified Customer Review',
      comment: formReviewComment.trim(),
      verifiedPurchase: formReviewVerified,
    };

    try {
      const url = editingReviewId ? `${API_URL}/reviews/${editingReviewId}` : `${API_URL}/reviews`;
      const method = editingReviewId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();
      if (res.ok) {
        if (editingReviewId) {
          setReviewsList((prev) => prev.map((r) => (r._id === editingReviewId ? saved : r)));
          setStatusMessage(`Review by "${saved.userName}" updated successfully in database!`);
        } else {
          setReviewsList((prev) => [saved, ...prev]);
          setStatusMessage(`New customer review by "${saved.userName}" added to database!`);
        }
        setShowReviewModal(false);
        setTimeout(() => setStatusMessage(''), 3500);
      } else {
        setReviewModalError(saved.error || 'Failed to save review');
      }
    } catch (err) {
      setReviewModalError((err as Error).message);
    } finally {
      setReviewSaving(false);
    }
  };

  const handleDeleteReview = async (id: string, reviewerName: string) => {
    if (!confirm(`Are you sure you want to delete the review by "${reviewerName}" from the database?`)) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviewsList((prev) => prev.filter((r) => r._id !== id));
        setStatusMessage(`Review by "${reviewerName}" deleted successfully`);
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert('Failed to delete review');
      }
    } catch {
      alert('Error deleting review');
    }
  };

  // ── UNATHENTICATED ADMIN LOGIN GATE ──
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-brand-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center mx-auto border border-brand-lightBlue/60">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-black font-display uppercase tracking-tight">
              Kochuvila Admin Portal
            </h2>
            <p className="text-xs text-slate-500">
              Enter authorized administrator credentials to manage products, orders, stock & user roles.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black focus:bg-white focus:border-brand-primary outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7F9] border border-brand-border font-semibold text-black focus:bg-white focus:border-brand-primary outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-deepBlue text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-button transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-black">Pre-configured Admin Access:</p>
            <p>Email: <code className="text-brand-primary font-bold font-mono">admin@kochuvila.com</code></p>
            <p>Password: <code className="text-brand-primary font-bold font-mono">KochuvilaAdmin@2026</code></p>
          </div>
        </div>
      </div>
    );
  }

  // ── FILTERED DATA ──
  const filteredOrders =
    orderStatusFilter === 'All'
      ? orders
      : orders.filter((o) => o.orderStatus === orderStatusFilter);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchProductQuery.toLowerCase()));

    const matchesCategory =
      productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();

    const isProductInStock = p.inStock !== false && p.stock > 0;
    const matchesStock =
      productStockFilter === 'all' ||
      (productStockFilter === 'instock' && isProductInStock) ||
      (productStockFilter === 'outofstock' && !isProductInStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchUserQuery))
  );

  const filteredReviews = reviewsList.filter((r) => {
    const q = searchReviewQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.userName.toLowerCase().includes(q) ||
      (r.productName && r.productName.toLowerCase().includes(q)) ||
      r.headline.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    const matchesRating =
      reviewRatingFilter === 'all' || r.rating === Number(reviewRatingFilter);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Bar with Admin Profile & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                MongoDB Atlas Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight mt-1">
              Kochuvila Admin Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-black">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-brand-border text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-bold shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Products</p>
              <p className="text-xl sm:text-2xl font-black text-black mt-0.5">{products.length}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-blue-50 text-brand-primary rounded-xl">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Orders</p>
              <p className="text-xl sm:text-2xl font-black text-black mt-0.5">{orders.length}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-cyan-50 text-cyan-600 rounded-xl">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Revenue</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">{formatINR(totalRevenue)}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Reviews</p>
              <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{reviewsList.length}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Users / Roles</p>
              <p className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5">{usersList.length}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-700 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-brand-border text-xs font-bold overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Reviews ({reviewsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'coupons'
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offers & Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-brand-primary text-brand-primary font-black'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Roles ({usersList.length})</span>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-black text-black uppercase tracking-tight">
                Order Processing & Kerala Shipment Status
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border bg-[#F5F7F9] font-semibold text-black outline-hidden"
                >
                  <option value="All">All Orders ({orders.length})</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer & Phone</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Courier & Tracking ID</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o._id || o.orderNumber} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-black block">{o.orderNumber}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-black block">{o.customer?.fullName || 'Customer'}</span>
                        <span className="text-[11px] text-slate-500">{o.customer?.phone}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                          {o.customer?.address?.city}, {o.customer?.address?.district}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {o.items?.length || 1} item(s)
                        <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                          {o.items?.[0]?.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-black">{formatINR(o.totalAmount || o.subtotal)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{o.paymentMethod}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-brand-primary border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>

                      {/* Courier & Tracking ID */}
                      <td className="py-3.5 px-4">
                        {o.trackingId ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-brand-primary text-[10px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                <span>{o.courierService || 'Courier'}</span>
                              </span>
                              <span className="font-mono font-bold text-slate-800 text-[11px]">
                                {o.trackingId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              {o.trackingUrl && (
                                <a
                                  href={o.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-primary font-bold hover:underline inline-flex items-center gap-0.5"
                                >
                                  <span>Track Package</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenTrackingModal(o)}
                                className="text-slate-500 hover:text-brand-primary font-semibold hover:underline"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenTrackingModal(o)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 hover:border-brand-primary text-slate-600 hover:text-brand-primary bg-slate-50 font-bold text-[11px] transition-colors"
                          >
                            <Truck className="w-3 h-3 text-slate-400" />
                            <span>+ Add Tracking</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-y-1.5">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.orderNumber, e.target.value as any)}
                          className="px-2.5 py-1.5 rounded-xl border border-brand-border bg-white text-xs font-bold text-slate-800 shadow-xs outline-hidden"
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
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenTrackingModal(o)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-brand-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <Truck className="w-3 h-3" />
                            <span>{o.trackingId ? 'Update Courier' : 'Dispatch / Tracking'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: PRODUCTS & STOCK MANAGEMENT */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products by title, brand, SKU..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F7F9] border border-brand-border text-xs font-semibold text-black placeholder:text-slate-400 outline-hidden"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-brand-border bg-[#F5F7F9] text-xs font-bold text-slate-700 outline-hidden"
                  >
                    <option value="all">All Departments</option>
                    <option value="appliances">Appliances</option>
                    <option value="furniture">Teakwood Furniture</option>
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-brand-border bg-[#F5F7F9] text-xs font-bold text-slate-700 outline-hidden"
                  >
                    <option value="all">All Stock Statuses</option>
                    <option value="instock">In Stock Only</option>
                    <option value="outofstock">Out of Stock Only</option>
                  </select>
                </div>

                {/* Prominent Add Product Button */}
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-black shadow-button transition-all flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                      <th className="py-3 px-4">Product & Images</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Pricing</th>
                      <th className="py-3 px-4">Variants</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isItemInStock = p.inStock !== false && p.stock > 0;
                      return (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-white p-1 border border-brand-border shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80'}
                                alt={p.name}
                                className="w-full h-full object-contain"
                              />
                              {p.images && p.images.length > 1 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-brand-deepBlue text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white">
                                  +{p.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-sm">
                              <p className="font-bold text-black truncate">{p.name}</p>
                              <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-800">{p.brand}</td>

                          <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                            {p.category} / {p.subcategory}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-black">{formatINR(p.price)}</span>
                            {p.mrp > p.price && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5 block">
                                {formatINR(p.mrp)}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {p.variants && p.variants.length > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                                {p.variants.length} Variants
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Stock Status with quick toggle */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p)}
                              title="Click to toggle Stock Status"
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all shadow-2xs flex items-center gap-1.5 ${
                                isItemInStock
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isItemInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{isItemInStock ? `In Stock (${p.stock})` : 'Out of Stock'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-colors"
                              title="Edit Product, Images & Variants"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <a
                              href={`/product/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-100 inline-block"
                              title="View Product on live website"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p._id, p.slug)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                              title="Delete from database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: OFFERS & COUPONS */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Promotional Coupons & Festival Discounts
                </h2>
                <p className="text-xs text-slate-500">
                  Manage live coupon codes saved in MongoDB Atlas and available at checkout
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-black shadow-button transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {couponsLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary mb-2" />
                Loading coupons from database...
              </div>
            ) : coupons.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-brand-border rounded-2xl">
                No coupons found in database. Create your first promotional code above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c._id || c.code}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      c.isActive
                        ? 'bg-white border-brand-border hover:border-brand-primary shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-black bg-brand-lightBlueSoft/60 px-3 py-1 rounded-lg border border-brand-lightBlue/60">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleCouponActive(c)}
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border transition-all ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div>
                      <span className="text-xl font-black text-brand-deepBlue font-display">
                        {c.discountType === 'flat' || c.discountAmount
                          ? `₹${c.discountAmount} FLAT OFF`
                          : `${c.discountPercentage}% OFF`}
                      </span>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>Min Order: ₹{(c.minOrderAmount || 0).toLocaleString('en-IN')}</span>
                      <span>Max Cap: ₹{(c.maxDiscountAmount || 5000).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c._id, c.code)}
                        className="text-xs text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: USER ROLES MANAGEMENT */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  User Roles & Access Permissions
                </h2>
                <p className="text-xs text-slate-500">
                  Manage registered accounts in MongoDB Atlas and assign Administrator privileges
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F7F9] border border-brand-border text-xs font-semibold text-black placeholder:text-slate-400 outline-hidden"
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary mb-2" />
                Loading users from database...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Saved Addresses</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4 text-right">Assign Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const isAdmin = u.role === 'admin';
                      return (
                        <tr key={u._id || u.email} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center font-black text-xs border border-brand-lightBlue/60 shrink-0">
                              {u.name ? u.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-black">{u.name}</p>
                              <p className="text-[11px] text-slate-500">{u.email}</p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {u.phone || 'Not provided'}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {u.addresses?.length || 0} address(es)
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isAdmin
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                              <span>{u.role}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u._id, e.target.value as any)}
                              className="px-3 py-1.5 rounded-xl border border-brand-border bg-white text-xs font-bold text-slate-800 shadow-xs outline-hidden"
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB: CUSTOMER REVIEWS MANAGEMENT */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  Customer Ratings & Reviews Management
                </h2>
                <p className="text-xs text-slate-500">
                  Manage live customer reviews, star ratings, and feedback stored in MongoDB Atlas
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddReview}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-black shadow-button transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer Review</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reviews by reviewer, product, headline..."
                  value={searchReviewQuery}
                  onChange={(e) => setSearchReviewQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F7F9] border border-brand-border text-xs font-semibold text-black placeholder:text-slate-400 outline-hidden"
                />
              </div>

              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-border bg-[#F5F7F9] text-xs font-bold text-slate-700 outline-hidden"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars Only</option>
                <option value="4">4 Stars Only</option>
                <option value="3">3 Stars Only</option>
                <option value="2">2 Stars Only</option>
                <option value="1">1 Star Only</option>
              </select>
            </div>

            {reviewsLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary mb-2" />
                Loading customer reviews from database...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-brand-border rounded-2xl">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No customer reviews found matching your search. Click &quot;Add Customer Review&quot; above to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Reviewer</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Headline & Feedback</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-black max-w-xs truncate">
                            {rev.productName || rev.productId}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {rev.productId}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{rev.userName}</p>
                          {rev.userEmail && <p className="text-[10px] text-slate-400">{rev.userEmail}</p>}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-100 text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-black ml-1 text-slate-700">{rev.rating}.0</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-bold text-black truncate">{rev.headline}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{rev.comment}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          {rev.verifiedPurchase ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verified Buyer</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                              Public
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditReview(rev)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-colors"
                            title="Edit Review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id, rev.userName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* MODAL: FULLY CUSTOMIZABLE PRODUCT CONTROL CENTER */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full border border-brand-border shadow-2xl flex flex-col my-6 max-h-[92vh] overflow-hidden">
              {/* Modal Top Header */}
              <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center font-black">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black uppercase tracking-tight">
                      {editingProductId ? 'Edit Product (Full Customization)' : 'Add New Product (Full Customization)'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configure comprehensive catalog metadata, multi-image gallery, specs & variants in MongoDB Atlas
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="px-6 border-b border-brand-border bg-white flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setProductModalTab('basics')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'basics'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>1. Basics & Identity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('pricing')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'pricing'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>2. Pricing & Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('specs')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'specs'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>3. Specs & Dimensions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('specification_groups')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'specification_groups'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>4. Spec Groups ({formSpecifications.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('gallery')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'gallery'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>5. Photos ({formImages.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('variants')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'variants'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>6. Variants ({formVariants.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductModalTab('description')}
                  className={`py-3 px-3.5 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                    productModalTab === 'description'
                      ? 'border-brand-primary text-brand-primary font-black'
                      : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>7. Description & Highlights</span>
                </button>
              </div>

              {/* Modal Body / Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {productModalError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{productModalError}</span>
                  </div>
                )}

                <form id="fullCustomizeProductForm" onSubmit={handleSaveProductSubmit} className="space-y-6 text-xs">
                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 1: BASICS & IDENTITY */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'basics' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Product Full Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => {
                            setFormName(e.target.value);
                            if (!editingProductId && !formSlug) {
                              setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                          placeholder="e.g. LG 655L Frost-Free Inverter Side-by-Side Refrigerator"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Custom URL Slug (leave empty for automatic)
                          </label>
                          <input
                            type="text"
                            value={formSlug}
                            onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-slate-800 focus:border-brand-primary outline-hidden"
                            placeholder="e.g. lg-655l-frost-free-refrigerator"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Used in URL: /product/{formSlug || 'auto-generated'}</p>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit) *</label>
                          <input
                            type="text"
                            required
                            value={formSku}
                            onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-black focus:border-brand-primary outline-hidden"
                            placeholder="e.g. LG-REF-655-SBS"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Brand Partner *</label>
                          <input
                            type="text"
                            required
                            value={formBrand}
                            onChange={(e) => setFormBrand(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                            placeholder="e.g. LG, Sony, Royal Teak"
                          />
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {['LG', 'Sony', 'Samsung', 'Whirlpool', 'Bosch', 'Royal Teak'].map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setFormBrand(b)}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                                  formBrand === b ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Store Department *</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black bg-white focus:border-brand-primary outline-hidden"
                          >
                            <option value="appliances">Appliances</option>
                            <option value="furniture">Solid Teak Furniture</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Subcategory *</label>
                          <input
                            type="text"
                            required
                            value={formSubcategory}
                            onChange={(e) => setFormSubcategory(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                            placeholder="e.g. refrigerators, sofas, televisions"
                          />
                        </div>
                      </div>

                      {/* Store Visibility */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border flex items-center justify-between">
                        <div>
                          <span className="font-bold text-black block">Publish on Live Website</span>
                          <span className="text-[11px] text-slate-500">
                            {formIsPublished
                              ? 'Product is currently published and visible to all customers across Kerala.'
                              : 'Product is hidden as a draft; only administrators can view it.'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormIsPublished(!formIsPublished)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                            formIsPublished ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{formIsPublished ? 'Published' : 'Draft / Hidden'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 2: PRICING, STOCK & OFFERS */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'pricing' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-black text-sm focus:border-brand-primary outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">MRP Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={formMrp}
                            onChange={(e) => setFormMrp(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-slate-700 text-sm focus:border-brand-primary outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Discount Calculation</label>
                          <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-black text-emerald-700 flex items-center justify-between">
                            <span>
                              {formMrp > formPrice
                                ? `${Math.round(((formMrp - formPrice) / formMrp) * 100)}% Discount`
                                : 'No Discount'}
                            </span>
                            {formMrp > formPrice && (
                              <span className="text-[10px] text-slate-500 font-normal">
                                Save {formatINR(formMrp - formPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inventory & Out-of-Stock Switch */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Stock Quantity (Units) *</label>
                          <input
                            type="number"
                            required
                            value={formStock}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormStock(val);
                              if (val <= 0) setFormInStock(false);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Availability Status</label>
                          <button
                            type="button"
                            onClick={() => setFormInStock(!formInStock)}
                            className={`w-full py-2 px-3 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 border ${
                              formInStock
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-rose-50 text-rose-700 border-rose-300'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${formInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{formInStock ? `In Stock (${formStock} Units)` : 'Marked Out of Stock'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Badges: Featured Product & Deal */}
                      <div className="p-4 rounded-2xl bg-[#F5F7F9] border border-brand-border space-y-3">
                        <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-brand-primary">
                          Promotional Badges & Highlight Tags
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formIsFeatured}
                              onChange={(e) => setFormIsFeatured(e.target.checked)}
                              className="w-4 h-4 text-brand-primary rounded"
                            />
                            <div>
                              <span className="font-bold text-black block">Featured Product</span>
                              <span className="text-[10px] text-slate-500">Show on homepage curated showcase</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formIsDeal}
                              onChange={(e) => setFormIsDeal(e.target.checked)}
                              className="w-4 h-4 text-brand-primary rounded"
                            />
                            <div>
                              <span className="font-bold text-black block">Deal / Festival Offer</span>
                              <span className="text-[10px] text-slate-500">Highlight in daily flash deals</span>
                            </div>
                          </label>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Deal Badge Label (Optional)</label>
                          <input
                            type="text"
                            value={formDealTag}
                            onChange={(e) => setFormDealTag(e.target.value)}
                            placeholder="e.g. Onam Mega Offer, Deal of the Day, Limited Stock"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 3: SPECS & DIMENSIONS */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'specs' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Energy Star Rating (Appliances)</label>
                          <select
                            value={formEnergyRating}
                            onChange={(e) => setFormEnergyRating(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black bg-white focus:border-brand-primary outline-hidden"
                          >
                            <option value="5 Star">5 Star High Energy Efficiency</option>
                            <option value="4 Star">4 Star Inverter Efficient</option>
                            <option value="3 Star">3 Star Standard</option>
                            <option value="2 Star">2 Star</option>
                            <option value="Inverter Technology">Inverter Technology</option>
                            <option value="Not Applicable">Not Applicable (Furniture/Accessories)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Capacity / Size Specification</label>
                          <input
                            type="text"
                            value={formCapacity}
                            onChange={(e) => setFormCapacity(e.target.value)}
                            placeholder="e.g. 655 Litres, 1.5 Ton, 55 Inch 4K, 6-Seater, King Size"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Dimensions (W x H x D)</label>
                          <input
                            type="text"
                            value={formDimensions}
                            onChange={(e) => setFormDimensions(e.target.value)}
                            placeholder="e.g. 912 x 1790 x 738 mm / 72 x 36 x 30 in"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Product Weight</label>
                          <input
                            type="text"
                            value={formWeight}
                            onChange={(e) => setFormWeight(e.target.value)}
                            placeholder="e.g. 116 kg / 45 kg"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Manufacturer Warranty Terms</label>
                        <input
                          type="text"
                          value={formWarranty}
                          onChange={(e) => setFormWarranty(e.target.value)}
                          placeholder="e.g. 1 Year Comprehensive + 10 Years on Smart Inverter Compressor"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Delivery Information Across Kerala</label>
                        <input
                          type="text"
                          value={formDeliveryInfo}
                          onChange={(e) => setFormDeliveryInfo(e.target.value)}
                          placeholder="e.g. Fast Doorstep Delivery Across Kerala (24-48 hrs)"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Search & Filter Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          placeholder="e.g. inverter, side-by-side, frost-free, teakwood, premium"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Initial Customer Rating (1.0 to 5.0)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1.0"
                            max="5.0"
                            value={formRating}
                            onChange={(e) => setFormRating(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Initial Review Count</label>
                          <input
                            type="number"
                            min="0"
                            value={formReviewCount}
                            onChange={(e) => setFormReviewCount(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 4: DETAILED SPECIFICATION GROUPS BUILDER */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'specification_groups' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <div>
                          <h4 className="font-black text-black uppercase tracking-tight text-xs">
                            Technical Specification Groups Builder
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Create organized tables of properties (e.g. General, Display, Performance, Finish)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSpecGroup}
                          className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Group</span>
                        </button>
                      </div>

                      {formSpecifications.length === 0 ? (
                        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-slate-400">
                          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">No specification groups yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1">Click &quot;+ Add Group&quot; to build key-value specification sections.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formSpecifications.map((group, gIdx) => (
                            <div key={gIdx} className="p-4 bg-slate-50/80 rounded-2xl border border-brand-border space-y-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Group Title</label>
                                  <input
                                    type="text"
                                    value={group.groupName}
                                    onChange={(e) => handleUpdateSpecGroupName(gIdx, e.target.value)}
                                    placeholder="e.g. General Information, Display & Audio"
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-black text-black text-xs"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-3">
                                  <button
                                    type="button"
                                    onClick={() => handleAddSpecItem(gIdx)}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-lg text-[10px] flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Row</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecGroup(gIdx)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                                    title="Delete group"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2">
                                {group.items.map((item, iIdx) => (
                                  <div key={iIdx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200">
                                    <div className="col-span-5">
                                      <input
                                        type="text"
                                        value={item.key}
                                        onChange={(e) => handleUpdateSpecItem(gIdx, iIdx, 'key', e.target.value)}
                                        placeholder="Property Key (e.g. Capacity)"
                                        className="w-full px-2 py-1 rounded border border-slate-200 font-bold text-black text-[11px]"
                                      />
                                    </div>
                                    <div className="col-span-6">
                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => handleUpdateSpecItem(gIdx, iIdx, 'value', e.target.value)}
                                        placeholder="Property Value (e.g. 655 Litres)"
                                        className="w-full px-2 py-1 rounded border border-slate-200 font-semibold text-slate-700 text-[11px]"
                                      />
                                    </div>
                                    <div className="col-span-1 text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSpecItem(gIdx, iIdx)}
                                        className="text-slate-400 hover:text-rose-600 p-1"
                                        title="Remove row"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 5: MULTI-IMAGE GALLERY */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'gallery' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-black uppercase tracking-tight text-xs">
                          Product Image Gallery ({formImages.length} Photos)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Add multiple high-resolution photos. The first image serves as the main primary cover on the catalog.
                        </p>
                      </div>

                      {/* Add Image Input */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Paste image URL (Unsplash, Cloudinary, AWS S3, CDN)..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Photo</span>
                        </button>
                      </div>

                      {/* Images Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {formImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl border border-brand-border bg-slate-50 p-2 text-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Product preview ${idx + 1}`}
                              className="w-full h-24 object-contain rounded-lg bg-white"
                            />
                            {idx === 0 ? (
                              <span className="absolute top-1.5 left-1.5 bg-brand-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                                Main Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...formImages];
                                  const [picked] = copy.splice(idx, 1);
                                  copy.unshift(picked);
                                  setFormImages(copy);
                                }}
                                className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Set as Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md shadow-xs opacity-80 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 6: PRODUCT VARIANTS */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'variants' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <div>
                          <h4 className="font-black text-black uppercase tracking-tight text-xs">
                            Product Variants & Finishes ({formVariants.length})
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Configure individual screen sizes, storage capacities, or teakwood polish finishes
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Variant</span>
                        </button>
                      </div>

                      {formVariants.length === 0 ? (
                        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-slate-400">
                          <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">No variants created yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Click &quot;+ Add Variant&quot; if this product comes in multiple dimensions, finishes, or capacities.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formVariants.map((v, vIdx) => (
                            <div key={v._id || vIdx} className="p-3.5 bg-slate-50 rounded-2xl border border-brand-border space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                <div className="sm:col-span-4">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Variant Name</label>
                                  <input
                                    type="text"
                                    value={v.name}
                                    onChange={(e) => handleUpdateVariant(vIdx, 'name', e.target.value)}
                                    placeholder="e.g. 65-Inch / Honey Teak"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-black"
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Selling Price (₹)</label>
                                  <input
                                    type="number"
                                    value={v.price}
                                    onChange={(e) => handleUpdateVariant(vIdx, 'price', Number(e.target.value))}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-black text-black"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Stock</label>
                                  <input
                                    type="number"
                                    value={v.stock}
                                    onChange={(e) => handleUpdateVariant(vIdx, 'stock', Number(e.target.value))}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-black"
                                  />
                                </div>

                                <div className="sm:col-span-2 text-center">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Availability</label>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateVariant(vIdx, 'inStock', !v.inStock)}
                                    className={`w-full py-1 rounded-md text-[10px] font-bold ${
                                      v.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {v.inStock ? 'In Stock' : 'Out of Stock'}
                                  </button>
                                </div>

                                <div className="sm:col-span-1 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(vIdx)}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                    title="Remove variant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-500 uppercase">Variant Specific Image URL (Optional)</label>
                                <input
                                  type="url"
                                  value={v.image || ''}
                                  onChange={(e) => handleUpdateVariant(vIdx, 'image', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-700 text-[11px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* SUB-TAB 7: DESCRIPTION & BULLET HIGHLIGHTS */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  {productModalTab === 'description' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Key Highlights & Features (One bullet per line)
                        </label>
                        <textarea
                          rows={4}
                          value={formFeatures}
                          onChange={(e) => setFormFeatures(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                          placeholder="e.g. Smart Inverter Linear Compressor with 10 Years Warranty&#10;DoorCooling+ technology keeps beverages extra cold&#10;100% Solid Seasoned Nilambur Teakwood&#10;Doorstep delivery across all 14 Kerala districts"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Full Detailed Product Description
                        </label>
                        <textarea
                          rows={6}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                          placeholder="Write comprehensive product information, build quality, technical features, energy conservation, and manufacturer guarantee..."
                        />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Bottom Footer */}
              <div className="px-6 py-4 border-t border-brand-border bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Current Section: <span className="font-bold text-black uppercase">{productModalTab}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    form="fullCustomizeProductForm"
                    disabled={productSaving}
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-deepBlue text-white font-black uppercase tracking-wider rounded-xl shadow-button transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {productSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingProductId ? 'Update Product' : 'Save Product to Database'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* MODAL: ASSIGN COURIER SERVICE & TRACKING ID */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {trackingModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-brand-border shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black uppercase tracking-tight">
                      Assign Courier &amp; Tracking ID
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Order: {trackingModalOrder.orderNumber} • {trackingModalOrder.customer?.fullName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">
                {/* Courier Service Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Courier / Logistics Partner *
                  </label>
                  <select
                    value={courierServiceInput}
                    onChange={(e) => setCourierServiceInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-black bg-white focus:border-brand-primary outline-hidden"
                  >
                    <option value="Delhivery">Delhivery Logistics</option>
                    <option value="Blue Dart">Blue Dart Express</option>
                    <option value="DTDC">DTDC Courier</option>
                    <option value="India Post / Speed Post">India Post / Speed Post</option>
                    <option value="Kochuvila Express (Own Fleet)">Kochuvila Express (Showroom Fleet / Van)</option>
                    <option value="Other">Other Transporter / Custom</option>
                  </select>
                </div>

                {courierServiceInput === 'Other' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Custom Transporter Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCourierInput}
                      onChange={(e) => setCustomCourierInput(e.target.value)}
                      placeholder="e.g. Kerala Roadways (KRS), VRL Logistics, Professional Courier"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-black focus:border-brand-primary outline-hidden"
                    />
                  </div>
                )}

                {/* Tracking ID / AWB Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tracking ID / AWB / Docket Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value.toUpperCase())}
                    placeholder="e.g. DL987654321, BLU88776655, KL-PANGODE-VAN-12"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-black text-black uppercase focus:border-brand-primary outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Customers can track their shipment using this ID on the live order tracking page.
                  </p>
                </div>

                {/* Tracking Webpage URL (Optional) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Direct Tracking Webpage Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={trackingUrlInput}
                    onChange={(e) => setTrackingUrlInput(e.target.value)}
                    placeholder="https://... (auto-generated if left empty for Delhivery, Blue Dart, DTDC)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 focus:border-brand-primary outline-hidden"
                  />
                </div>

                {/* Order Status Synchronization */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Set Shipment Status
                  </label>
                  <select
                    value={trackingStatusInput}
                    onChange={(e) => setTrackingStatusInput(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-black bg-white focus:border-brand-primary outline-hidden"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped (Dispatched with Courier)</option>
                    <option value="Out for Delivery">Out for Delivery (Kerala Doorstep)</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Dispatch Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dispatch Timeline Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingNotesInput}
                    onChange={(e) => setTrackingNotesInput(e.target.value)}
                    placeholder="e.g. Dispatched from Pangode Showroom Warehouse with installation kit"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 focus:border-brand-primary outline-hidden"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2.5 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setTrackingModalOrder(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdatingTracking}
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl shadow-button flex items-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    {isUpdatingTracking ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Tracking...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save &amp; Update Order</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* MODAL: CREATE OFFER COUPON */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-black text-black uppercase tracking-tight">
                  Create Promotional Offer Coupon
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER2026, KERALA15"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-black text-black uppercase focus:border-brand-primary outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                    <select
                      value={couponType}
                      onChange={(e) => setCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-black bg-white focus:border-brand-primary outline-hidden"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {couponType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                    </label>
                    <input
                      type="number"
                      required
                      value={couponValue}
                      onChange={(e) => setCouponValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-black focus:border-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Min. Order Amount (₹)</label>
                    <input
                      type="number"
                      value={couponMinOrder}
                      onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={couponMaxCap}
                      onChange={(e) => setCouponMaxCap(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Description</label>
                  <input
                    type="text"
                    value={couponDescription}
                    onChange={(e) => setCouponDescription(e.target.value)}
                    placeholder="e.g. 15% discount on double door refrigerators"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={couponSaving}
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl shadow-button flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {couponSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Coupon</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* MODAL: ADD / EDIT CUSTOMER REVIEW */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-black uppercase tracking-tight">
                    {editingReviewId ? 'Edit Customer Review' : 'Add New Customer Review'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Product rating and verified customer feedback for Kerala customers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewModalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{reviewModalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveReviewSubmit} className="space-y-4 text-xs">
                {/* Product Dropdown */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associate with Product *</label>
                  <select
                    value={formReviewProductId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setFormReviewProductId(selectedId);
                      const matched = products.find((p) => p._id === selectedId || p.slug === selectedId);
                      if (matched) setFormReviewProductName(matched.name);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-black bg-white focus:border-brand-primary outline-hidden"
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reviewer Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reviewer Name *</label>
                    <input
                      type="text"
                      required
                      value={formReviewUserName}
                      onChange={(e) => setFormReviewUserName(e.target.value)}
                      placeholder="e.g. Mathew Thomas"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reviewer Email (Optional)</label>
                    <input
                      type="email"
                      value={formReviewUserEmail}
                      onChange={(e) => setFormReviewUserEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Star Rating (1 to 5) *</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formReviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-100 text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 ml-2">
                      {formReviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Headline / Title */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Title / Headline *</label>
                  <input
                    type="text"
                    required
                    value={formReviewHeadline}
                    onChange={(e) => setFormReviewHeadline(e.target.value)}
                    placeholder="e.g. Outstanding quality and punctual delivery in Kerala"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                  />
                </div>

                {/* Detailed Comment */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detailed Customer Comment *</label>
                  <textarea
                    rows={4}
                    required
                    value={formReviewComment}
                    onChange={(e) => setFormReviewComment(e.target.value)}
                    placeholder="Write detailed feedback about product quality, doorstep delivery, installation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-black focus:border-brand-primary outline-hidden"
                  />
                </div>

                {/* Verified Purchase Checkbox */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="verifiedPurchaseCheck"
                    checked={formReviewVerified}
                    onChange={(e) => setFormReviewVerified(e.target.checked)}
                    className="w-4 h-4 text-brand-primary rounded border-slate-300"
                  />
                  <label htmlFor="verifiedPurchaseCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Mark as Verified Purchase (Shows verified buyer badge)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSaving}
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl shadow-button flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {reviewSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Review...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingReviewId ? 'Update Review' : 'Save Review'}</span>
                      </>
                    )}
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
