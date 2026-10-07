'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Sparkles, Tag, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function FinalCTA() {
  const whatsappUrl = generateGeneralWhatsAppLink();

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#EBF7FC] via-white to-[#F5F7F9] border-t border-brand-border text-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Kerala's Trusted Home Destination</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-display uppercase tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Make Your Home Feel Beautifully Complete.
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Explore genuine electronics from global leaders and authentic solid teak furniture crafted for generations. Visit our Kerala showroom or place your order online with guaranteed doorstep delivery.
        </p>

        {/* Exclusive Welcome Coupon Code Banner */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 p-2.5 px-5 rounded-2xl bg-white border border-brand-primary/30 shadow-card">
          <Tag className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-medium text-slate-700">Special Online Offer: Use code</span>
          <span className="text-xs font-mono font-black text-brand-deepBlue bg-brand-lightBlueSoft px-2.5 py-1 rounded-lg border border-brand-lightBlue/60">
            KOCHUVILA1000
          </span>
          <span className="text-xs font-bold text-emerald-700">for ₹1,000 OFF on orders above ₹20,000</span>
        </div>

        {/* Dual Call-to-Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-xs sm:text-sm rounded-xl shadow-button transition-all duration-200 active:scale-98 group/btn"
          >
            <span>EXPLORE FULL STORE COLLECTION</span>
            <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 bg-white hover:bg-brand-lightBlueSoft text-slate-900 border-2 border-brand-primary font-bold text-xs sm:text-sm rounded-xl shadow-card transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span>100% Genuine Authorized Brands</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-primary" />
            <span>Doorstep Transit Across All 14 Districts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            <span>Zero-Cost EMI Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
