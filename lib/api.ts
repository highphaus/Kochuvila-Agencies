import { Product, Category, Brand, Order, Coupon } from '@/types';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS, SAMPLE_COUPONS } from './data/sample-data';

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || '/api';

// Circuit breaker & in-memory cache for fast page loads
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const memoryCache = new Map<string, CacheEntry<any>>();
let failureCount = 0;
let nextHealthCheck = 0;

async function fetchWithFallback<T>(url: string, getFallback: () => T): Promise<T> {
  const now = Date.now();

  // 1. Check in-memory cache first (instant 0ms response)
  const cached = memoryCache.get(url);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  // 2. If circuit breaker is tripped due to consecutive failures, use fallback
  if (failureCount >= 3 && now < nextHealthCheck) {
    return getFallback();
  }

  // 3. Robust probe with 3500ms budget to accommodate database queries & cold starts
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 120 },
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const json = (await res.json()) as T;
    failureCount = 0; // Reset consecutive failures on success
    memoryCache.set(url, { data: json, expiry: now + 180_000 }); // Cache for 3 minutes
    return json;
  } catch {
    // Increment failure counter
    failureCount += 1;
    if (failureCount >= 3) {
      nextHealthCheck = now + 30_000; // Backoff for 30 seconds only after 3 consecutive errors
    }
    return getFallback();
  }
}

// Helper to filter sample products lazily ONLY if API is unavailable
function getLocalFilteredProducts(params?: {
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
}) {
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
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }
  if (params?.rating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= params.rating!);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (params?.sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params?.sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (params?.sort === 'discount') {
    filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
  } else if (params?.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const limit = params?.limit || 24;
  const page = params?.page || 1;
  const start = (page - 1) * limit;
  return {
    products: filtered.slice(start, start + limit),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
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

  const url = `${API_BASE}/products?${query.toString()}`;
  return fetchWithFallback(url, () => getLocalFilteredProducts(params));
}

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  return fetchWithFallback(`${API_BASE}/products/${slug}`, () => {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug || p._id === slug) || null;
  });
};

export const fetchCategories = async (): Promise<Category[]> => {
  return fetchWithFallback(`${API_BASE}/categories`, () => SAMPLE_CATEGORIES);
};

export const fetchBrands = async (): Promise<Brand[]> => {
  return fetchWithFallback(`${API_BASE}/brands`, () => SAMPLE_BRANDS);
};

export async function fetchOrderById(id: string): Promise<Order | null> {
  return fetchWithFallback(`${API_BASE}/orders/${id}`, () => null);
}

export async function fetchOrders(): Promise<Order[]> {
  return fetchWithFallback(`${API_BASE}/orders`, () => []);
}
