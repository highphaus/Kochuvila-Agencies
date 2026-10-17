import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import CookieConsent from '@/components/CookieConsent';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] text-[#000000] selection:bg-[#0097F3] selection:text-white font-sans antialiased pb-14 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <CookieConsent />
    </div>
  );
}
