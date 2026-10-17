'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PromoSlide {
  id: string;
  categoryTag: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  imageSrc: string;
  imageAlt: string;
}

const BASE_SLIDES: PromoSlide[] = [
  {
    id: 'furniture',
    categoryTag: 'Living & Bedroom',
    title: 'Comfort for Every Corner',
    description: 'Furniture for a better lifestyle. Handcrafted comfort and contemporary living room & bedroom suites.',
    href: '/furniture',
    buttonLabel: 'Explore Furniture',
    imageSrc: '/banners/promo-furniture.jpg',
    imageAlt: 'Living & Bedroom - Comfort for Every Corner',
  },
  {
    id: 'appliances',
    categoryTag: 'Smart Home & Kitchen',
    title: 'Trusted Home Appliances',
    description: 'Built for everyday convenience. Energy-efficient smart appliances with official warranty and service.',
    href: '/appliances',
    buttonLabel: 'Explore Appliances',
    imageSrc: '/banners/promo-appliances.jpg',
    imageAlt: 'Smart Home & Kitchen - Trusted Home Appliances',
  },
];

// Looped sequence for smaller devices (First -> Second -> First -> Second in continuous circular flow)
const LOOPED_SLIDES = [
  ...BASE_SLIDES,
  ...BASE_SLIDES,
  ...BASE_SLIDES,
  ...BASE_SLIDES,
];

export default function PromoBanners() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Auto-scroll loop for mobile carousel: advances smoothly to the next card in one direction
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const card = container.querySelector('[data-promo-card]') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth + 12; // width + gap-3
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - cardWidth) {
        container.scrollTo({ left: 0, behavior: 'instant' });
      }

      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }, 4500);

    return () => clearInterval(interval);
  }, [isInteracting]);

  return (
    <section className="py-6 sm:py-12 bg-[#FDFDFD] border-b border-[#E2EBF2] select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* 
          ========================================================================
          1. BIGGER DEVICES (Desktop & Tablet >= md 768px):
          - Perfectly balanced 2-column side-by-side grid
          - Both cards fully viewable without horizontal clipping or scroll
          ========================================================================
        */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
          {BASE_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="relative rounded-3xl overflow-hidden min-h-[440px] lg:min-h-[480px] flex flex-col justify-end p-8 lg:p-10 border border-[#E2EBF2] shadow-xs hover:shadow-xl transition-all duration-300 group"
            >
              {/* Background Lifestyle Image */}
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>

              {/* Bottom Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

              {/* Content Overlay */}
              <div className="relative z-10 max-w-lg space-y-3 lg:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#38BDF8] border border-white/25 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{slide.categoryTag}</span>
                </div>

                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                  {slide.title}
                </h3>

                <p className="text-sm text-slate-200 leading-relaxed font-medium drop-shadow-xs">
                  {slide.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-6 lg:px-7 py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 cursor-pointer group/btn"
                  >
                    <span>{slide.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 
          ========================================================================
          2. SMALLER DEVICES (< md 768px):
          - Seamless circular auto-scrolling carousel movement
          - Swipeable with snap points and touch interaction pause
          ========================================================================
        */}
        <div className="block md:hidden">
          <div
            ref={scrollRef}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsInteracting(false), 2000);
            }}
            className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 will-change-scroll -mx-3 px-3"
            style={{ scrollBehavior: 'smooth' }}
          >
            {LOOPED_SLIDES.map((slide, index) => (
              <div
                key={`${slide.id}-${index}`}
                data-promo-card
                className="w-[86vw] xs:w-[82vw] shrink-0 snap-center relative rounded-3xl overflow-hidden min-h-[360px] flex flex-col justify-end p-6 border border-[#E2EBF2] shadow-sm active:scale-99 transition-all duration-300 group"
              >
                {/* Background Lifestyle Image */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes="90vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                  />
                </div>

                {/* Bottom Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#38BDF8] border border-white/25 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                    <span>{slide.categoryTag}</span>
                  </div>

                  <h3 className="text-xl xs:text-2xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                    {slide.title}
                  </h3>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-2 drop-shadow-xs">
                    {slide.description}
                  </p>

                  <div className="pt-1.5">
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 group/btn"
                    >
                      <span>{slide.buttonLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
