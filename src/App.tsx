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
import AboutPage from '@/src/pages/AboutPage';
import BrandsPage from '@/src/pages/BrandsPage';
import AccountPage from '@/app/account/AccountClient';
import LoginPage from '@/app/login/LoginClient';
import TrackOrderPage from '@/src/pages/TrackOrderPage';
import AdminPage from '@/src/pages/AdminPage';
import PolicyPage from '@/src/pages/PolicyPage';
import NotFoundPage from '@/src/pages/NotFoundPage';

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
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/appliances" element={<ProductsPage defaultDepartment="appliances" />} />
          <Route path="/appliances/:sub" element={<ProductsPage defaultDepartment="appliances" />} />
          <Route path="/furniture" element={<ProductsPage defaultDepartment="furniture" />} />
          <Route path="/furniture/:sub" element={<ProductsPage defaultDepartment="furniture" />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />

          {/* Commerce Flows */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* Informational Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />

          {/* Account & Auth */}
          <Route path="/account/*" element={<AccountPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage isRegisterMode />} />

          {/* Customer Service & Policies */}
          <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
          <Route path="/return-policy" element={<PolicyPage type="return" />} />
          <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
          <Route path="/terms" element={<PolicyPage type="terms" />} />
          <Route path="/faq" element={<PolicyPage type="faq" />} />

          {/* Administration */}
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
