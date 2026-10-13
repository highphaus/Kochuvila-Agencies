import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileBottomNav from '@/components/MobileBottomNav';
import CompareDrawer from '@/components/CompareDrawer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-black selection:bg-brand-primary selection:text-white font-sans antialiased pb-14 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
      <CompareDrawer />
    </div>
  );
}
