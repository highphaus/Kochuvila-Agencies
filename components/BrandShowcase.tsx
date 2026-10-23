'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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

  // Tripled list for seamless infinite circular one-by-one sliding
  const loopBrands = [...brandList, ...brandList, ...brandList];

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get card width + gap
  const getStep = useCallback(() => {
    if (!containerRef.current) return 260;
    const card = containerRef.current.querySelector('[data-brand-card]') as HTMLElement;
    if (card) {
      const style = window.getComputedStyle(card);
      const marginRight = parseFloat(style.marginRight) || 0;
      return card.offsetWidth + (marginRight > 0 ? marginRight : 16);
    }
    return 260;
  }, []);

  // Slide forward one card
  const handleNext = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const step = getStep();
    container.scrollBy({ left: step, behavior: 'smooth' });
  }, [getStep]);

  // Slide back one card
  const handlePrev = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const step = getStep();
    container.scrollBy({ left: -step, behavior: 'smooth' });
  }, [getStep]);

  // Initialize scroll position to the middle set for seamless wrap in both directions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const step = getStep();
      const singleSetWidth = step * brandList.length;
      if (container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [brandList.length, getStep]);

  // Handle circular wrap on scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const step = getStep();
    const singleSetWidth = step * brandList.length;

    if (singleSetWidth > 0) {
      if (container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft -= singleSetWidth;
      } else if (container.scrollLeft <= 5) {
        container.scrollLeft += singleSetWidth;
      }
    }
  }, [brandList.length, getStep]);

  // Slow, one-by-one auto-advancing timer (every 3.5s)
  useEffect(() => {
    if (isPaused) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 3500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, handleNext]);

  return (
    /* SECTION 8 — BRANDS: SHOP BY BRAND (Slow one-by-one slider) */
    <section className="py-8 sm:py-12 bg-white border-b border-brand-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Title and One-by-One Navigation Controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-black font-display uppercase tracking-tight whitespace-nowrap">
              Shop By Brand
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF6FC] text-[#0097F3] border border-[#0097F3]/20">
              <CheckCircle2 className="w-3 h-3 text-[#0097F3]" />
              Authorized Dealer
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/brands"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-deepBlue hover:underline group shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Horizontal Slow One-By-One Scrollable Carousel */}
        <div 
          className="relative group/carousel -mx-4 px-4 sm:mx-0 sm:px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Edge Vignette Gradients for Desktop */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Smooth Snap Carousel Track */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto scroll-smooth py-2 sm:py-3 no-scrollbar snap-x snap-mandatory select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loopBrands.map((b, index) => {
              const specialty = specialties[b.name] || 'Authorized Showroom Collection';

              return (
                <Link
                  key={`${b._id}-${index}`}
                  data-brand-card
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="w-[150px] xs:w-[170px] sm:w-[240px] shrink-0 p-3 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-[#0097F3] bg-white hover:bg-[#EBF6FC]/40 transition-all text-left flex flex-col justify-between shadow-2xs hover:shadow-md group relative cursor-pointer snap-start hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
                    <span className="font-extrabold text-xs sm:text-base text-slate-900 group-hover:text-[#0097F3] transition-colors tracking-wide uppercase truncate">
                      {b.name}
                    </span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" title="Authorized Brand" />
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 font-normal mb-2 sm:mb-3 min-h-[26px] sm:min-h-[32px] leading-snug sm:leading-relaxed">
                    {specialty}
                  </p>

                  <div className="pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#0097F3] group-hover:text-[#017ED0]">
                    <span>Explore Catalog</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
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
