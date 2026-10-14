'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="py-10 sm:py-14 bg-[#F0F8FD] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Comfort for Every Corner (Furniture) */}
          <div className="relative rounded-2xl overflow-hidden bg-[#EBF6FC] border border-[#9FD8F1] p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] group shadow-xs hover:shadow-md transition-all">
            <div className="relative z-10 max-w-xs space-y-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#017ED0]">
                Living &amp; Bedroom
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] font-display leading-tight">
                Comfort for Every Corner
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Furniture for a better lifestyle. Handcrafted teak and contemporary designs.
              </p>
              <div className="pt-2">
                <Link
                  href="/furniture"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0097F3] text-white text-xs sm:text-sm font-semibold hover:bg-[#017ED0] transition-all shadow-xs"
                >
                  <span>Explore Furniture</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Background Lifestyle Image */}
            <div className="absolute right-0 bottom-0 top-0 w-3/5 sm:w-1/2 overflow-hidden pointer-events-none">
              <Image
                src="/banners/promo-furniture.jpg"
                alt="Comfortable Furniture Living"
                fill
                sizes="(max-width: 768px) 60vw, 30vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EBF6FC] via-[#EBF6FC]/60 to-transparent" />
            </div>
          </div>

          {/* Banner 2: Trusted Home Appliances */}
          <div className="relative rounded-2xl overflow-hidden bg-[#EBF6FC] border border-[#9FD8F1] p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] group shadow-xs hover:shadow-md transition-all">
            <div className="relative z-10 max-w-xs space-y-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#017ED0]">
                Smart Home &amp; Kitchen
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] font-display leading-tight">
                Trusted Home Appliances
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Built for everyday convenience. Certified brands with official local service.
              </p>
              <div className="pt-2">
                <Link
                  href="/appliances"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0097F3] text-white text-xs sm:text-sm font-semibold hover:bg-[#017ED0] transition-all shadow-xs"
                >
                  <span>Explore Appliances</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Background Lifestyle Image */}
            <div className="absolute right-0 bottom-0 top-0 w-3/5 sm:w-1/2 overflow-hidden pointer-events-none">
              <Image
                src="/banners/promo-appliances.jpg"
                alt="Trusted Home Appliances"
                fill
                sizes="(max-width: 768px) 60vw, 30vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EBF6FC] via-[#EBF6FC]/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
