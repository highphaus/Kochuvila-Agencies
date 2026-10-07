'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Tv,
  Refrigerator,
  Wind,
  Armchair,
  BedDouble,
  Utensils,
  WashingMachine,
  Flame,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
} from 'lucide-react';

// ─── 1. CATEGORY BUBBLE NAVIGATION DATA ─────────────────────────────────────
interface CategoryBubble {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

const CATEGORY_BUBBLES: CategoryBubble[] = [
  {
    id: 'top-offers',
    name: 'Top Offers',
    subtitle: 'Up to 50% Off',
    href: '/products?isDeal=true',
    icon: <Flame className="w-5 h-5 text-amber-500" />,
    badge: 'HOT',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white',
  },
  {
    id: 'tvs',
    name: 'Smart 4K TVs',
    subtitle: 'Sony • LG • Samsung',
    href: '/products?category=appliances&subcategory=televisions',
    icon: <Tv className="w-5 h-5 text-brand-primary" />,
  },
  {
    id: 'fridges',
    name: 'Refrigerators',
    subtitle: 'Inverter & Frost-Free',
    href: '/products?category=appliances&subcategory=refrigerators',
    icon: <Refrigerator className="w-5 h-5 text-cyan-600" />,
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    subtitle: 'Front & Top Load',
    href: '/products?category=appliances&subcategory=washing-machines',
    icon: <WashingMachine className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: 'acs',
    name: 'Air Conditioners',
    subtitle: 'Split Inverter ACs',
    href: '/products?category=appliances&subcategory=air-conditioners',
    icon: <Wind className="w-5 h-5 text-sky-500" />,
  },
  {
    id: 'sofas',
    name: 'Teakwood Sofas',
    subtitle: 'Malabar Hardwood',
    href: '/products?category=furniture&subcategory=sofas',
    icon: <Armchair className="w-5 h-5 text-amber-700" />,
    badge: 'TEAK',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
  },
  {
    id: 'beds',
    name: 'Beds & Bedroom',
    subtitle: 'Hydraulic Storage',
    href: '/products?category=furniture&subcategory=beds',
    icon: <BedDouble className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'dining',
    name: 'Dining Sets',
    subtitle: 'Solid Wood 6-Seater',
    href: '/products?category=furniture&subcategory=dining',
    icon: <Utensils className="w-5 h-5 text-orange-600" />,
  },
  {
    id: 'showroom',
    name: 'Visit Showroom',
    subtitle: '25,000 Sq.Ft Experience',
    href: '/contact',
    icon: <MapPin className="w-5 h-5 text-rose-600" />,
  },
];

// ─── 2. HERO PROMOTIONAL BANNER DATA ────────────────────────────────────────
interface HeroBannerSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
}

const HERO_BANNERS: HeroBannerSlide[] = [
  {
    id: 1,
    image: '/banners/banner1.jpg',
    badge: 'KERALA PREMIER APPLIANCE FESTIVAL',
    title: 'Up to 45% Off on LG, Samsung & Sony',
    subtitle: '4K Smart TVs, Inverter Refrigerators & Front Load Washers with Official Brand Warranty',
    ctaText: 'Shop Festive Appliance Offers',
    href: '/products?category=appliances',
  },
  {
    id: 2,
    image: '/banners/banner2.jpg',
    badge: '100% SEASONED MALABAR HARDWOOD',
    title: 'Handcrafted Teak Living & Bedroom Sets',
    subtitle: 'Kiln-Dried Kerala Teak Sofas, Hydraulic Storage Beds & Dining Sets with Lifetime Guarantee',
    ctaText: 'Explore Teakwood Collection',
    href: '/products?category=furniture',
  },
  {
    id: 3,
    image: '/banners/banner3.jpg',
    badge: 'TROPICAL INVERTER COOLING FESTIVAL',
    title: 'Beat the Kerala Heat • 5-Star Energy Savers',
    subtitle: '100% Pure Copper Split Inverter ACs from Daikin, Voltas & LG with Free Site Inspection',
    ctaText: 'Explore Inverter Split ACs',
    href: '/products?category=appliances&subcategory=air-conditioners',
  },
];

// ─── 3. AMAZON QUAD CARDS DATA ──────────────────────────────────────────────
const APPLIANCE_QUAD = [
  {
    name: '4K Smart TVs',
    offer: 'From ₹14,990',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=televisions',
  },
  {
    name: 'Inverter Fridges',
    offer: 'Up to 40% Off',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=refrigerators',
  },
  {
    name: 'Front Loaders',
    offer: 'Energy Star A+++',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=washing-machines',
  },
  {
    name: 'Split Inverter ACs',
    offer: '100% Copper Coil',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=air-conditioners',
  },
];

const FURNITURE_QUAD = [
  {
    name: 'Teak Living Sofas',
    offer: '3+1+1 Heritage Sets',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=sofas',
  },
  {
    name: 'Storage Beds',
    offer: 'Hydraulic Lift Teak',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=beds',
  },
  {
    name: '6-Seater Dining',
    offer: 'Solid Wood Timber',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=dining',
  },
  {
    name: 'Lounge Recliners',
    offer: 'Luxury Ergonomic',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=sofas',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 18 });
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION = 5000;
  const totalSlides = HERO_BANNERS.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Flash deal countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-[#EAEDED]/70 pb-6 sm:pb-8">
      {/* ────────────────────────────────────────────────────────────────────────
          1. FULL-WIDTH HERO BANNER CAROUSEL (FULL COVER EDGE-TO-EDGE)
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="w-full relative overflow-hidden bg-slate-950">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[260px] xs:h-[320px] sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[580px] group select-none overflow-hidden"
        >
          {/* Banner Slides */}
          {HERO_BANNERS.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <Link
                key={slide.id}
                href={slide.href}
                className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
              >
                {/* Full-bleed Banner Graphic */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center select-none"
                  draggable={false}
                />

                {/* Subtle bottom shadow vignette for contrast */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Floating Bottom-Left Deal Pill */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 hidden xs:flex items-center gap-2 bg-black/65 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg group-hover:scale-102">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <span className="font-black text-brand-lightBlue uppercase tracking-wider text-[11px]">
                    {slide.badge}
                  </span>
                  <span className="hidden sm:inline text-white/70">•</span>
                  <span className="hidden sm:inline text-white font-semibold">{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-lightBlue" />
                </div>
              </Link>
            );
          })}

          {/* Left Navigation Arrow */}
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-black/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-black/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Pill Indicators */}
          <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-6 sm:w-7 h-2 bg-brand-primary shadow-xs'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          2. FLIPKART / AMAZON CATEGORY NAVIGATION BAR (PLACED UNDER HERO IMAGE)
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 mt-3 sm:mt-4">
        <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs px-3 sm:px-5 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto scrollbar-none">
            {CATEGORY_BUBBLES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center min-w-[76px] sm:min-w-[96px] text-center px-1 sm:px-2 py-1 rounded-xl hover:bg-slate-50 transition-all shrink-0"
              >
                <div className="relative mb-1 sm:mb-1.5">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-brand-lightBlueSoft/60 border border-brand-border group-hover:border-brand-primary group-hover:bg-white group-hover:shadow-card flex items-center justify-center transition-all duration-200 group-hover:scale-105">
                    {cat.icon}
                  </div>
                  {cat.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-2xs tracking-tighter ${cat.badgeColor}`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] sm:text-xs font-bold text-slate-800 group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-600 font-medium hidden sm:block truncate max-w-[90px]">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          3. AMAZON QUAD CARDS & SPOTLIGHT DEAL BENTO
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 mt-3 sm:mt-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* ── CARD 1: APPLIANCES QUAD (Amazon Style) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-cardHover border border-brand-border transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Appliances Festival <br />
                  <span className="text-xs font-bold text-brand-primary">Up to 45% Off • Top Brands</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase shrink-0">
                  Sale
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {APPLIANCE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50 hover:bg-brand-lightBlueSoft/50 transition-all border border-slate-100 hover:border-brand-lightBlue"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 line-clamp-1">
                      {item.offer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products?category=appliances"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-0.5 transition-all"
            >
              <span>Explore all home appliances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 2: TEAKWOOD FURNITURE QUAD (Amazon Style) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-cardHover border border-brand-border transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Malabar Teakwood <br />
                  <span className="text-xs font-bold text-amber-700">100% Solid Seasoned Hardwood</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase shrink-0">
                  Teak
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {FURNITURE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-all border border-slate-100 hover:border-amber-200"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 line-clamp-1">
                      {item.offer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products?category=furniture"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-0.5 transition-all"
            >
              <span>Explore Kerala teak furniture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 3: SPOTLIGHT DEAL OF THE DAY (Flipkart Lightning Deal) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-cardHover border border-brand-border transition-all flex flex-col justify-between group relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase">
                  <Flame className="w-3 h-3 fill-white" />
                  Deal of the Day
                </span>

                <div className="flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>
                    {formatTwoDigits(countdown.hours)}:{formatTwoDigits(countdown.minutes)}:
                    {formatTwoDigits(countdown.seconds)}
                  </span>
                </div>
              </div>

              {/* Product Visual */}
              <Link
                href="/products/prod-sony-bravia-55"
                className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 my-2 group-hover:scale-102 transition-transform duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80"
                  alt="Sony Bravia 55 inch 4K Google TV"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  31% OFF
                </span>
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs border border-black/5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9
                </span>
              </Link>

              {/* Product Info */}
              <Link href="/products/prod-sony-bravia-55" className="block">
                <p className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 hover:text-brand-primary transition-colors">
                  Sony Bravia 55&quot; 4K Ultra HD Smart Google TV
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base sm:text-lg font-black text-slate-950">₹54,990</span>
                  <span className="text-xs text-slate-500 line-through">₹79,900</span>
                  <span className="text-[11px] font-bold text-emerald-600">Save ₹24,910</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium mt-1">
                  <Truck className="w-3 h-3 text-brand-primary" />
                  <span>Free Express Delivery Across Kerala</span>
                </div>
              </Link>
            </div>

            <Link
              href="/products/prod-sony-bravia-55"
              className="mt-3 w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-black text-center shadow-button transition-all flex items-center justify-center gap-1.5"
            >
              <span>Grab Flash Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          4. SERVICE ASSURANCE TRUST STRIP
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 mt-4 sm:mt-5">
        <div className="bg-white rounded-2xl border border-brand-border p-3.5 sm:p-4 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-[13px]">100% Genuine Warranty</p>
                <p className="text-[11px] text-slate-600">Direct from LG, Samsung, Bosch</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-10 h-10 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center shrink-0 border border-brand-lightBlue/40">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-[13px]">Kerala-Wide Delivery</p>
                <p className="text-[11px] text-slate-600">Covering all 14 districts safely</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-[13px]">Zero-Cost EMI Options</p>
                <p className="text-[11px] text-slate-600">Easy monthly installments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-[13px]">Free Installation &amp; Demo</p>
                <p className="text-[11px] text-slate-600">Certified technicians at doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
