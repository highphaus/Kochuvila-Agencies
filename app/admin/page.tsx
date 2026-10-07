import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';
import { fetchProducts, fetchOrders, fetchCategories, fetchBrands } from '@/lib/api';

export const revalidate = 0;

export const metadata = {
  title: 'Admin Management Portal | Kochuvila Agencies',
  description: 'Manage store orders, products catalog, pricing, and showroom inventory.',
};

export default async function AdminPage() {
  const [productsData, orders, categories, brands] = await Promise.all([
    fetchProducts({ limit: 100 }),
    fetchOrders(),
    fetchCategories(),
    fetchBrands(),
  ]);

  return (
    <AdminDashboardClient
      initialProducts={productsData.products}
      initialOrders={orders}
      initialCategories={categories}
      initialBrands={brands}
    />
  );
}
