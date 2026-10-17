'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, Cookie } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'kochuvila_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preference
    try {
      const savedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!savedConsent) {
        // Show banner after brief delay for smooth page entry
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
    } catch {
      // storage fallback
    }
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'essential');
    } catch {
      // storage fallback
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed bottom-16 md:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-50 animate-fade-in select-none"
    >
      <div className="bg-[#06121E]/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl space-y-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0097F3]/20 text-[#0097F3] flex items-center justify-center shrink-0 border border-[#0097F3]/30">
              <Cookie className="w-4 h-4 text-[#9FD8F1]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                Cookie &amp; Privacy Choices
              </h4>
              <p className="text-[10px] text-slate-400">
                Kochuvila Agencies • Trivandrum Showroom
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcceptEssential}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          We use cookies and local storage to keep your cart and wishlist secure, deliver personalized appliance offers, and support showroom order tracking across Kerala.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3.5 rounded-xl bg-[#0097F3] hover:bg-[#0084D6] text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer text-center"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={handleAcceptEssential}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium border border-white/10 transition-all cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>

        {/* Legal link */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            100% Secure &amp; Transparent
          </span>
          <Link
            href="/privacy-policy"
            className="text-[#9FD8F1] hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
