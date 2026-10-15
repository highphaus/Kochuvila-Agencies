'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, ShieldCheck, Headphones, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  link: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'living-room',
    title: 'Living Room',
    subtitle: 'Sofas, Tables, TV Units & Recliners',
    imageSrc: '/banners/hero-living.jpg',
    link: '/furniture?category=living-room',
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    subtitle: 'Teak Beds, Wardrobes & Mattresses',
    imageSrc: '/banners/promo-furniture.jpg',
    link: '/furniture?category=bedroom',
  },
  {
    id: 'kitchen-appliances',
    title: 'Kitchen Appliances',
    subtitle: 'Fridges, Ovens, Microwaves & Hobs',
    imageSrc: '/banners/promo-appliances.jpg',
    link: '/appliances?category=kitchen-appliances',
  },
  {
    id: 'laundry-appliances',
    title: 'Laundry Appliances',
    subtitle: 'Front Load, Top Load Washers & Dryers',
    imageSrc: '/banners/card-laundry.jpg',
    link: '/appliances?category=washing-machines',
  },
  {
    id: 'entertainment-tvs',
    title: 'Smart TVs & Cinema',
    subtitle: 'OLED 4K, QLED & Dolby Soundbars',
    imageSrc: '/banners/hero-entertainment.jpg',
    link: '/appliances?category=tvs',
  },
  {
    id: 'dining-room',
    title: 'Dining & Kitchen',
    subtitle: 'Solid Teak Dining Sets & Cabinets',
    imageSrc: '/banners/portrait-dining.jpg',
    link: '/furniture?category=dining',
  },
  {
    id: 'air-conditioning',
    title: 'Cooling & ACs',
    subtitle: '5-Star Inverter Split ACs & Fans',
    imageSrc: '/banners/portrait-appliances.jpg',
    link: '/appliances?category=air-conditioners',
  },
  {
    id: 'home-decor',
    title: 'Home Decor',
    subtitle: 'Rugs, Designer Lights, Wall Art & More',
    imageSrc: '/banners/card-decor.jpg',
    link: '/furniture?category=decor',
  },
];

// Tripled cards for seamless infinite bi-directional carousel loop
const LOOPED_CATEGORY_CARDS = [
  ...CATEGORY_CARDS.map((c) => ({ ...c, uniqueId: `set1-${c.id}` })),
  ...CATEGORY_CARDS.map((c) => ({ ...c, uniqueId: `set2-${c.id}` })),
  ...CATEGORY_CARDS.map((c) => ({ ...c, uniqueId: `set3-${c.id}` })),
];

interface HeroSlide {
  id: string;
  eyebrow: string[];
  titlePart1: string;
  titleAccent: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'home-appliances-furniture',
    eyebrow: ['Furniture', 'Home Appliances', 'Home Essentials'],
    titlePart1: 'Your Home. ',
    titleAccent: 'Better Every Day.',
    description: "Stylish furniture, modern appliances and premium home essentials — everything you need to create a home you'll love.",
    imageSrc: '/banners/hero-kochuvila-home.jpg',
    imageAlt: 'Kochuvila Luxury Modern Living Room and Kitchen',
    primaryCta: {
      label: 'Shop Now',
      href: '/products',
    },
    secondaryCta: {
      label: 'Explore Collections',
      href: '/furniture',
    },
  },
  {
    id: 'entertainment-cinematic',
    eyebrow: ['Entertainment', 'Smart 4K TVs', 'Audio Systems'],
    titlePart1: 'Cinematic Living. ',
    titleAccent: 'Ultra 4K Clarity.',
    description: 'Immerse yourself in world-class OLED & QLED displays, paired with studio-quality audio systems tailored for Kerala homes.',
    imageSrc: '/banners/hero-entertainment.jpg',
    imageAlt: 'Kochuvila Luxury 4K Smart Living Room Cinema',
    primaryCta: {
      label: 'Shop Smart TVs',
      href: '/appliances?category=tvs',
    },
    secondaryCta: {
      label: 'Living Room Sets',
      href: '/furniture?category=living-room',
    },
  },
  {
    id: 'heritage-teak-furniture',
    eyebrow: ['Kerala Heritage', 'Teak Wood', 'Designer Living'],
    titlePart1: 'Timeless Comfort. ',
    titleAccent: 'Crafted for Generations.',
    description: 'Handcrafted solid teakwood living furniture, ergonomic dining sets and luxury bedroom collections built to endure.',
    imageSrc: '/banners/hero-living.jpg',
    imageAlt: 'Kochuvila Handcrafted Living Room and Dining Furniture',
    primaryCta: {
      label: 'Explore Furniture',
      href: '/furniture',
    },
    secondaryCta: {
      label: 'Living Room',
      href: '/furniture?category=living-room',
    },
  },
  {
    id: 'smart-appliances-kitchen',
    eyebrow: ['Smart Kitchen', 'Laundry Care', 'Inverter Cooling'],
    titlePart1: 'Everyday Innovation. ',
    titleAccent: 'Top Global Brands.',
    description: 'Discover energy-efficient multi-door refrigerators, smart AI washing machines and 5-star inverter ACs with complete warranty.',
    imageSrc: '/banners/promo-appliances.jpg',
    imageAlt: 'Kochuvila Smart Kitchen and Laundry Appliances',
    primaryCta: {
      label: 'Shop Appliances',
      href: '/appliances',
    },
    secondaryCta: {
      label: 'Special Deals',
      href: '/products?deals=true',
    },
  },
];

// Extended slides for seamless infinite loop (clones at boundaries)
const EXTENDED_SLIDES = [
  { ...HERO_SLIDES[HERO_SLIDES.length - 1], uniqueKey: 'loop-clone-last' },
  ...HERO_SLIDES.map((s) => ({ ...s, uniqueKey: s.id })),
  { ...HERO_SLIDES[0], uniqueKey: 'loop-clone-first' },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = React.useState(1); // Start at real first slide (index 1)
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = React.useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = React.useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Continuous auto-scroll loop every 4.5 seconds for main hero
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Category Carousel auto-scroll & loop controls
  const categoryTrackRef = React.useRef<HTMLDivElement>(null);
  const [isCategoryHovered, setIsCategoryHovered] = React.useState(false);

  // Position at middle set on initial mount for seamless bi-directional infinite loop
  React.useEffect(() => {
    const el = categoryTrackRef.current;
    if (!el) return;
    const initScroll = () => {
      const setWidth = el.scrollWidth / 3;
      el.scrollLeft = setWidth;
    };
    const timer = setTimeout(initScroll, 80);
    return () => clearTimeout(timer);
  }, []);

  // Continuous auto-scroll loop every 3.2 seconds for Explore by Category
  React.useEffect(() => {
    if (isCategoryHovered) return;
    const interval = setInterval(() => {
      const el = categoryTrackRef.current;
      if (!el) return;
      const firstCard = el.querySelector<HTMLElement>('[data-category-card]');
      const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
      el.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }, 3200);

    return () => clearInterval(interval);
  }, [isCategoryHovered]);

  const handleCategoryScroll = () => {
    const el = categoryTrackRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    if (setWidth <= 0) return;

    if (el.scrollLeft >= setWidth * 2) {
      el.scrollLeft -= setWidth;
    } else if (el.scrollLeft <= 10) {
      el.scrollLeft += setWidth;
    }
  };

  const handleCategoryNext = () => {
    const el = categoryTrackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-category-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    el.scrollBy({ left: cardWidth, behavior: 'smooth' });
  };

  const handleCategoryPrev = () => {
    const el = categoryTrackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-category-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  // Re-enable smooth transition right after an instant jump
  React.useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const handleTransitionEnd = () => {
    // If reached the cloned first slide at the end, snap back instantly to real first slide
    if (currentIndex >= EXTENDED_SLIDES.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
    // If reached the cloned last slide at the start, snap back instantly to real last slide
    else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(EXTENDED_SLIDES.length - 2);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <section className="w-full bg-[#FDFDFD] border-b border-[#E2EBF2] select-none">
      {/* 
        1. Main Hero Carousel Canvas:
        - Continuous infinite loop auto-scrolling with smooth forward slide animation
        - Left & Right navigation controls
        - Touch swipe support for mobile
      */}
      <div 
        className="relative w-full min-h-[460px] sm:min-h-[540px] lg:h-[600px] xl:h-[640px] overflow-hidden bg-slate-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Sliding Track with Seamless Infinite Loop */}
        <div 
          className={`flex h-full w-full ${
            isTransitioning ? 'transition-transform duration-700 ease-out will-change-transform' : ''
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {EXTENDED_SLIDES.map((slide, index) => (
            <div
              key={slide.uniqueKey}
              className="relative w-full flex-shrink-0 h-full flex flex-col justify-end min-h-[460px] sm:min-h-[540px] lg:h-[600px] xl:h-[640px]"
            >
              {/* Slide Background Image - 100% full clarity without cloudy white wash */}
              <div className="absolute inset-0">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  className="object-cover object-right lg:object-center select-none"
                />
              </div>

              {/* Bottom Vignette only at the bottom 25-30% for text contrast - leaving 75% of the room 100% unblocked */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Hero Content Overlay: Bottom-Anchored without any opaque card hiding the photo */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto pb-14 sm:pb-16 pt-8">
                <div className="max-w-2xl space-y-2 sm:space-y-3">
                  {/* Category Breadcrumbs Eyebrow */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#38BDF8] text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-white/20 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{slide.eyebrow.join(' • ')}</span>
                  </div>

                  {/* Headline with crisp high contrast */}
                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.2] text-white drop-shadow-md">
                    {slide.titlePart1}
                    <span className="text-[#38BDF8] block sm:inline">
                      {slide.titleAccent}
                    </span>
                  </h1>

                  {/* Sub-headline description */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium line-clamp-2 max-w-xl drop-shadow-xs">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                    <Link
                      href={slide.primaryCta.href}
                      className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#0097F3]/30 hover:scale-102 active:scale-98 group cursor-pointer"
                    >
                      <span>{slide.primaryCta.label}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/35 hover:bg-black/55 text-white border border-white/30 backdrop-blur-sm text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-98 cursor-pointer shadow-xs"
                    >
                      <span>{slide.secondaryCta.label}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0097F3] border border-white/60 shadow-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0097F3] border border-white/60 shadow-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

      </div>

      {/* 
        2. Trust Bar in a clean HORIZONTAL row across all devices:
        - Free Delivery
        - Quality Assured
        - Dedicated Support
      */}
      <div className="border-t border-[#E2EBF2] bg-white py-3.5 sm:py-5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-[#E2EBF2]">
            {/* Trust 1: Delivery */}
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-3 px-2 sm:px-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-[#000000] leading-tight">
                  Free Delivery
                </h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] hidden sm:block">
                  To your doorstep
                </p>
              </div>
            </div>

            {/* Trust 2: Warranty */}
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-3 px-2 sm:px-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-[#000000] leading-tight">
                  Quality Assured
                </h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] hidden sm:block">
                  Trusted warranty
                </p>
              </div>
            </div>

            {/* Trust 3: Support */}
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-3 px-2 sm:px-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-sm font-bold text-[#000000] leading-tight">
                  Dedicated Support
                </h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] hidden sm:block">
                  We're here to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. Curated Category Cards - Smooth Auto-Scrolling Carousel with Seamless Infinite Loop:
      */}
      <div 
        className="border-t border-[#E2EBF2] bg-[#FDFDFD] py-6 sm:py-9 relative overflow-hidden"
        onMouseEnter={() => setIsCategoryHovered(true)}
        onMouseLeave={() => setIsCategoryHovered(false)}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0097F3] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0097F3]" />
                Curated Spaces
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-[#000000] font-display">
                Explore by Category
              </h3>
            </div>

            {/* Carousel Navigation Arrow Controls */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 mr-2">
                {isCategoryHovered ? 'Paused on hover' : 'Auto-scrolling'}
              </span>

              <button
                type="button"
                onClick={handleCategoryPrev}
                aria-label="Previous Category"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#0097F3] hover:text-white text-[#1A1A1A] border border-[#E2EBF2] hover:border-[#0097F3] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCategoryNext}
                aria-label="Next Category"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#0097F3] hover:text-white text-[#1A1A1A] border border-[#E2EBF2] hover:border-[#0097F3] shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Seamless Infinite Auto-Scrolling Carousel Track */}
          <div
            ref={categoryTrackRef}
            onScroll={handleCategoryScroll}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory will-change-scroll select-none"
            style={{ scrollBehavior: 'smooth' }}
          >
            {LOOPED_CATEGORY_CARDS.map((card) => (
              <Link
                key={card.uniqueId}
                href={card.link}
                data-category-card
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] shrink-0 snap-start shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block cursor-pointer border border-[#E2EBF2] hover:border-[#0097F3]"
              >
                {/* Background Category Image */}
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 select-none"
                />

                {/* Bottom Contrast Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Card Content & Action Button */}
                <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 pr-1">
                      <h4 className="text-xs sm:text-sm md:text-base font-bold text-white font-display leading-tight truncate drop-shadow-xs">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate mt-0.5">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Circular Arrow Button */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/35 bg-white/15 backdrop-blur-xs text-white group-hover:bg-[#0097F3] group-hover:border-[#0097F3] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
