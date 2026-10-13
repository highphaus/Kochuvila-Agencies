import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import HomePage from '@/src/pages/HomePage';
import ProductsPage from '@/src/pages/ProductsPage';
import ProductDetailPage from '@/src/pages/ProductDetailPage';
import CartPage from '@/app/cart/page';
import CheckoutPage from '@/app/checkout/page';
import OrderSuccessPage from '@/src/pages/OrderSuccessPage';
import WishlistPage from '@/app/wishlist/WishlistClient';
import ComparePage from '@/app/compare/CompareClient';
import ContactPage from '@/app/contact/page';
import AccountPage from '@/app/account/AccountClient';
import LoginPage from '@/app/login/LoginClient';
import TrackOrderPage from '@/src/pages/TrackOrderPage';
import AdminPage from '@/src/pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}
