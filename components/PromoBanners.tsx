'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="py-10 sm:py-16 bg-[#FDFDFD] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Comfort for Every Corner (Furniture) */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 lg:p-10 border border-[#E2EBF2] shadow-sm hover:shadow-2xl transition-all duration-300 group">
            {/* Background Lifestyle Image */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/banners/promo-furniture.jpg"
                alt="Living & Bedroom - Comfort for Every Corner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              />
            </div>

            {/* Seamless Bottom Vignette Gradient for 100% Readable Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-10 max-w-xl space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#38BDF8] border border-white/25 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Living &amp; Bedroom</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                Comfort for Every Corner
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-md drop-shadow-xs">
                Furniture for a better lifestyle. Handcrafted teak and contemporary designs.
              </p>

              <div className="pt-1.5">
                <Link
                  href="/furniture"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 cursor-pointer group/btn"
                >
                  <span>Explore Furniture</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Trusted Home Appliances */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 lg:p-10 border border-[#E2EBF2] shadow-sm hover:shadow-2xl transition-all duration-300 group">
            {/* Background Lifestyle Image */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/banners/promo-appliances.jpg"
                alt="Smart Home & Kitchen - Trusted Home Appliances"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              />
            </div>

            {/* Seamless Bottom Vignette Gradient for 100% Readable Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-10 max-w-xl space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#38BDF8] border border-white/25 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Smart Home &amp; Kitchen</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                Trusted Home Appliances
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-md drop-shadow-xs">
                Built for everyday convenience. Certified brands with official local service.
              </p>

              <div className="pt-1.5">
                <Link
                  href="/appliances"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 cursor-pointer group/btn"
                >
                  <span>Explore Appliances</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
