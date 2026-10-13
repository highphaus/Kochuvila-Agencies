import React, { useState, useEffect } from 'react';
import AdminDashboardClient from '@/app/admin/AdminDashboardClient';
import { fetchProducts, fetchOrders, fetchCategories, fetchBrands } from '@/lib/api';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS } from '@/lib/data/sample-data';
import { Product, Order, Category, Brand } from '@/types';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchProducts({ limit: 100 }),
      fetchOrders(),
      fetchCategories(),
      fetchBrands(),
    ])
      .then(([productsData, ordersData, catData, brandData]) => {
        if (!isMounted) return;
        if (productsData?.products?.length) setProducts(productsData.products);
        if (ordersData?.length) setOrders(ordersData);
        if (catData?.length) setCategories(catData);
        if (brandData?.length) setBrands(brandData);
      })
      .catch((err) => {
        console.warn('Admin fetch fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialOrders={orders}
      initialCategories={categories}
      initialBrands={brands}
    />
  );
}
