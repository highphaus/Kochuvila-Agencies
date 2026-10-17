import React from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { ArrowRight } from 'lucide-react';

interface BrandShowcaseProps {
  brands: Brand[];
}

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
  const brandList = brands && brands.length > 0 ? brands : [
    { _id: '1', name: 'Samsung', slug: 'samsung' },
    { _id: '2', name: 'LG', slug: 'lg' },
    { _id: '3', name: 'Sony', slug: 'sony' },
    { _id: '4', name: 'Bosch', slug: 'bosch' },
    { _id: '5', name: 'Whirlpool', slug: 'whirlpool' },
    { _id: '6', name: 'Royal Teak', slug: 'royal-teak' },
    { _id: '7', name: 'Nilkamal', slug: 'nilkamal' },
    { _id: '8', name: 'Daikin', slug: 'daikin' },
  ];

  // Duplicate for continuous seamless circular loop
  const loopBrands = [...brandList, ...brandList];

  const specialties: Record<string, string> = {
    Samsung: '4K QLED TVs & Double Door Fridges',
    LG: 'Direct Drive Washers & French Door Fridges',
    Sony: 'Bravia OLED TVs & Cinematic Audio',
    Bosch: 'German Front-Load Washers & Dishwashers',
    Whirlpool: 'Intellifresh Refrigerators',
    'Royal Teak': 'Solid Living Sofas, Dining & Beds',
    Nilkamal: 'Ergonomic Living & Study Furniture',
    Daikin: 'Inverter Climate Control & Split ACs',
  };

  return (
    /* SECTION 8 — BRANDS: SHOP BY BRAND */
    <section className="py-8 sm:py-12 bg-white border-b border-brand-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
              Shop By Brand
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Leading appliance and home manufacturers with 100% genuine products and warranty support.
            </p>
          </div>

          <Link
            href="/brands"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-deepBlue hover:underline group"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Auto-Scrollable Circular Loop Carousel */}
        <div className="relative overflow-hidden w-full py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Edge Vignette Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track: continuous 60fps infinite circular loop */}
          <div className="animate-marquee-loop flex items-center gap-3 sm:gap-4 select-none">
            {loopBrands.map((b, index) => {
              const specialty = specialties[b.name] || 'Authorized Showroom Collection';

              return (
                <Link
                  key={`${b._id}-${index}`}
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="w-[200px] sm:w-[240px] shrink-0 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#0097F3] bg-white hover:bg-[#EBF6FC]/40 transition-all text-left flex flex-col justify-between shadow-2xs hover:shadow-md group relative cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#0097F3] transition-colors tracking-wide uppercase truncate">
                      {b.name}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 font-normal mb-2.5">
                    {specialty}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#0097F3] group-hover:text-[#017ED0]">
                    <span>Explore Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Explore More Brands Action Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#06121E] hover:bg-[#0097F3] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 group cursor-pointer"
          >
            <span>Explore More Brands</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
