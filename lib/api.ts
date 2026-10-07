import { Product, Category, Brand, Order, Coupon } from '@/types';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS, SAMPLE_COUPONS } from './data/sample-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to fetch with timeout & fallback for instant performance
async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    return fallbackData;
  }
}

export async function fetchProducts(params?: {
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFeatured?: boolean;
  isDeal?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.subcategory) query.append('subcategory', params.subcategory);
  if (params?.brand) query.append('brand', params.brand);
  if (params?.search) query.append('search', params.search);
  if (params?.minPrice) query.append('minPrice', String(params.minPrice));
  if (params?.maxPrice) query.append('maxPrice', String(params.maxPrice));
  if (params?.rating) query.append('rating', String(params.rating));
  if (params?.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
  if (params?.isDeal !== undefined) query.append('isDeal', String(params.isDeal));
  if (params?.sort) query.append('sort', params.sort);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  let filtered = [...SAMPLE_PRODUCTS];
  if (params?.category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params?.subcategory) {
    filtered = filtered.filter((p) => p.subcategory.toLowerCase() === params.subcategory!.toLowerCase());
  }
  if (params?.brand) {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === params.brand!.toLowerCase());
  }
  if (params?.isFeatured !== undefined) {
    filtered = filtered.filter((p) => p.isFeatured === params.isFeatured);
  }
  if (params?.isDeal !== undefined) {
    filtered = filtered.filter((p) => p.isDeal === params.isDeal);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  const limit = params?.limit || 24;
  const page = params?.page || 1;
  const start = (page - 1) * limit;
  const paginatedFallback = {
    products: filtered.slice(start, start + limit),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };

  return fetchWithFallback(`${API_BASE}/products?${query.toString()}`, paginatedFallback);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const fallback = SAMPLE_PRODUCTS.find((p) => p.slug === slug || p._id === slug) || null;
  return fetchWithFallback(`${API_BASE}/products/${slug}`, fallback);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchWithFallback(`${API_BASE}/categories`, SAMPLE_CATEGORIES);
}

export async function fetchBrands(): Promise<Brand[]> {
  return fetchWithFallback(`${API_BASE}/brands`, SAMPLE_BRANDS);
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  return fetchWithFallback(`${API_BASE}/orders/${id}`, null);
}

export async function fetchOrders(): Promise<Order[]> {
  return fetchWithFallback(`${API_BASE}/orders`, []);
}
