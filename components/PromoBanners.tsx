'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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

const PROMO_SLIDES: PromoSlide[] = [
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

export default function PromoBanners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? PROMO_SLIDES.length - 1 : prev - 1));
  }, []);

  // Auto-scrolling circular loop: stops on each slide for 5s, then transitions slowly
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  return (
    <section className="py-8 sm:py-14 bg-[#FDFDFD] border-b border-[#E2EBF2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-3xl overflow-hidden border border-[#E2EBF2] shadow-sm hover:shadow-2xl transition-all duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Horizontal Carousel Track: Slow 1000ms transition with stop */}
          <div
            className="flex transition-transform duration-1000 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {PROMO_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="w-full flex-shrink-0 relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-end p-6 sm:p-10 lg:p-12 group"
              >
                {/* Background Lifestyle Image */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
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

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-md">
                    {slide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-md drop-shadow-xs">
                    {slide.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 cursor-pointer group/btn"
                    >
                      <span>{slide.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Left / Right Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Banner"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0097F3] border border-white/60 shadow-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Banner"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0097F3] border border-white/60 shadow-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Navigation Indicators / Dots */}
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 z-20 flex items-center gap-2">
            {PROMO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 sm:w-8 h-2 bg-[#0097F3] shadow-md'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
