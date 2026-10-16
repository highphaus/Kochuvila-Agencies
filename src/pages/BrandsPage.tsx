'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { SAMPLE_BRANDS } from '@/lib/data/sample-data';

export default function BrandsPage() {
  const brandDescriptions: Record<string, string> = {
    LG: 'Pioneer in Inverter Linear refrigerators, front load washing machines, and OLED displays with unmatched Korean engineering.',
    Samsung: 'Global tech leader in SpaceMax refrigerators, AI Ecobubble washing machines, and crystal clear QLED 4K televisions.',
    Whirlpool: 'American appliance innovator known for 6th Sense cooling, Intellifresh frost-free refrigerators, and Stainwash care.',
    Bosch: 'German engineering excellence delivering whisper-quiet EcoSilence washing machines and heavy duty built-in kitchen solutions.',
    IFB: 'Pioneers in front-load laundry technology, built with robust anti-allergen steam cycles and durable stainless steel drums.',
    Godrej: 'Trusted Indian heritage delivering Edge Pro green refrigerators, security lockers, and ergonomic modular furniture.',
    Haier: 'Global cooling specialists featuring bottom-mounted refrigerators, self-cleaning split ACs, and compact smart laundry.',
    Sony: 'The pinnacle of home cinema with BRAVIA XR cognitive processor televisions and immersive Dolby Atmos soundbars.',
    Nilkamal: 'India’s largest molded and solid wood furniture brand offering weather-resistant dining sets and ergonomic wardrobes.',
    Durian: 'Luxury furniture craftsmanship renowned for genuine Italian leather recliner suites and solid teakwood dining tables.',
    Sleepwell: 'Orthopaedic spine-care mattresses and premium contour pillows engineered for restful tropical sleep.',
    Preethi: 'South India’s iconic kitchen powerhouse known for heavy-duty 750W-1000W mixer grinders and induction cooktops.',
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header matching Reference Sheet */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6FC] text-[#0097F3] text-xs font-bold tracking-wider uppercase border border-[#0097F3]/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authorized Retail Partner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] font-display">
            Our Brands
          </h1>
          <p className="text-sm sm:text-base text-[#666666]">
            Trusted brands for your home. Every product in our showroom is backed by official
            manufacturer warranties and authorized Kerala doorstep service.
          </p>
        </div>

        {/* Brands Grid matching the Reference Image */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mb-12 sm:mb-16">
          {SAMPLE_BRANDS.map((brand) => (
            <Link
              key={brand._id}
              href={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group bg-white rounded-2xl p-3.5 sm:p-5 md:p-6 border border-[#E2EBF2] hover:border-[#0097F3] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Brand Name Monogram */}
                <div className="h-14 sm:h-16 w-full rounded-xl bg-[#F8FBFE] border border-[#E2EBF2]/60 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#EBF6FC] transition-colors">
                  <span className="text-lg sm:text-2xl font-black font-display tracking-wider text-[#1A1A1A] group-hover:text-[#0097F3] transition-colors truncate px-2">
                    {brand.name}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] line-clamp-3 leading-relaxed mb-3 sm:mb-4">
                  {brandDescriptions[brand.name] || 'Official brand catalog available at Kochuvila showroom with full Kerala warranty.'}
                </p>
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-[#E2EBF2]/60 flex items-center justify-between text-xs font-semibold text-[#0097F3]">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Trust Note */}
        <div className="bg-white rounded-2xl border border-[#E2EBF2] p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-display">
                100% Genuine Brand Guarantee
              </h3>
              <p className="text-xs text-[#666666]">
                Kochuvila Agencies is an authorized Tier-1 retail partner in Trivandrum for all showcased brands.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0097F3] text-white text-xs font-semibold hover:bg-[#017ED0] transition-all shrink-0"
          >
            <span>Visit Showroom</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
