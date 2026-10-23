'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface MobileSlide {
  id: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
  imageSrc: string;
}

const MOBILE_HERO_SLIDES: MobileSlide[] = [
  {
    id: 'slide-festival',
    badge: 'Kerala Festive Deals',
    badgeBg: 'bg-amber-400',
    badgeText: 'text-amber-950',
    title: 'Grand Appliance Festival',
    subtitle: 'Up to 45% OFF on LG, Samsung & Whirlpool',
    ctaText: 'Shop Appliances',
    href: '/appliances',
    imageSrc: '/banners/hero-kochuvila-home.jpg',
  },
  {
    id: 'slide-teak',
    badge: '100% Solid Malabar Teak',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    title: 'Handcrafted Teak Living',
    subtitle: 'Authentic Sofas, Hydraulic Beds & Dining Suites',
    ctaText: 'Explore Teakwood',
    href: '/furniture',
    imageSrc: '/banners/hero-living.jpg',
  },
  {
    id: 'slide-oled',
    badge: '4K OLED & Cinema',
    badgeBg: 'bg-[#0097F3]',
    badgeText: 'text-white',
    title: 'Sony Bravia & LG OLED',
    subtitle: 'Dolby Atmos Soundbars with 0% Paperless EMI',
    ctaText: 'View Smart TVs',
    href: '/appliances?category=tvs',
    imageSrc: '/banners/hero-entertainment.jpg',
  },
  {
    id: 'slide-cooling',
    badge: 'Careful Doorstep Unboxing',
    badgeBg: 'bg-indigo-500',
    badgeText: 'text-white',
    title: 'Smart Cooling & Laundry',
    subtitle: 'Inverter Fridges, Split ACs & Front Load Washers',
    ctaText: 'Shop Cooling',
    href: '/appliances?category=refrigerators',
    imageSrc: '/banners/promo-appliances.jpg',
  },
];

export default function MobileAmazonHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-rotate slides every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOBILE_HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      // Swiped left -> next
      setCurrentSlide((prev) => (prev + 1) % MOBILE_HERO_SLIDES.length);
    } else if (distance < -45) {
      // Swiped right -> prev
      setCurrentSlide((prev) => (prev - 1 + MOBILE_HERO_SLIDES.length) % MOBILE_HERO_SLIDES.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full bg-[#FAFBFD] pt-2 pb-1">
      {/* 1. Flipkart-style Framed Banner Carousel */}
      <div className="px-2.5 sm:px-4">
        <div
          className="relative w-full aspect-[16/9] xs:aspect-[18/9] max-h-[210px] rounded-2xl overflow-hidden select-none bg-slate-900 shadow-sm border border-slate-200/80"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {MOBILE_HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Link href={slide.href} className="block relative w-full h-full">
                  {/* Hero Background Image */}
                  <Image
                    src={slide.imageSrc}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 95vw, 600px"
                    className="object-cover object-center select-none"
                  />

                  {/* Flipkart High Contrast Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                  {/* Banner Content Card */}
                  <div className="absolute inset-0 p-3.5 sm:p-5 flex flex-col justify-end text-white">
                    {/* Badge */}
                    <span
                      className={`inline-block self-start px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs mb-1 ${slide.badgeBg} ${slide.badgeText}`}
                    >
                      {slide.badge}
                    </span>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-black font-display leading-tight drop-shadow-sm text-white line-clamp-1">
                      {slide.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[10px] sm:text-xs text-slate-200 font-medium drop-shadow-xs line-clamp-1 mt-0.5">
                      {slide.subtitle}
                    </p>

                    {/* Flipkart Tap CTA */}
                    <div className="pt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Centered Slide Indicator Dots (Flipkart Style) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {MOBILE_HERO_SLIDES.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  dotIdx === currentSlide ? 'w-3.5 h-1.5 bg-[#FFE500]' : 'w-1.5 h-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Flipkart-style Micro Trust Strip directly below Hero Carousel */}
      <div className="mx-2.5 sm:mx-4 mt-1.5 p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs grid grid-cols-3 divide-x divide-slate-100 text-center">
        <div className="flex flex-col items-center justify-center px-1">
          <Truck className="w-3.5 h-3.5 text-[#0097F3] mb-0.5" />
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Trivandrum Store</span>
          <span className="text-[8px] text-slate-400">Showroom Dispatch</span>
        </div>
        <div className="flex flex-col items-center justify-center px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Brand Warranty</span>
          <span className="text-[8px] text-slate-400">100% Genuine</span>
        </div>
        <div className="flex flex-col items-center justify-center px-1">
          <CreditCard className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
          <span className="text-[10px] font-bold text-slate-800 leading-tight">0% No Cost EMI</span>
          <span className="text-[8px] text-slate-400">Instant Approval</span>
        </div>
      </div>
    </div>
  );
}
