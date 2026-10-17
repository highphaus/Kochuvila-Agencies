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

// Continuous loop sequence in the same direction: First -> Second -> First -> Second...
const LOOPED_SLIDES = [
  ...BASE_SLIDES,
  ...BASE_SLIDES,
  ...BASE_SLIDES,
  ...BASE_SLIDES,
];

export default function PromoBanners() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Auto-scroll forward loop: smoothly advances to next card in the same direction
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const card = container.querySelector('[data-promo-card]') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth + 16; // width + gap
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If close to the end, seamlessly jump back to the first set without visual disruption
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
        {/* Freely swipeable, auto-scrolling horizontal circular loop */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => {
            // Resume gentle auto-scroll shortly after touch release
            setTimeout(() => setIsInteracting(false), 2000);
          }}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 will-change-scroll -mx-3 px-3 sm:mx-0 sm:px-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {LOOPED_SLIDES.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              data-promo-card
              className="w-[88vw] xs:w-[84vw] sm:w-[500px] md:w-[560px] lg:w-[600px] shrink-0 snap-center relative rounded-3xl overflow-hidden min-h-[350px] sm:min-h-[420px] lg:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 border border-[#E2EBF2] shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Background Lifestyle Image */}
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 640px) 90vw, 600px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>

              {/* Seamless Bottom Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

              {/* Content Overlay */}
              <div className="relative z-10 max-w-xl space-y-2.5 sm:space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#38BDF8] border border-white/25 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{slide.categoryTag}</span>
                </div>

                <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-md drop-shadow-xs">
                  {slide.description}
                </p>

                <div className="pt-2">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 cursor-pointer group/btn"
                  >
                    <span>{slide.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
