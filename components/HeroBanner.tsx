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
  Sparkles,
  Zap,
  Percent,
} from 'lucide-react';

// ─── 1. CATEGORY NAVIGATION BUBBLES DATA (PLACED UNDER HERO SLIDER) ─────────
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
    subtitle: 'Up to 55% Off',
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
    badge: 'COOL',
    badgeColor: 'bg-sky-500 text-white',
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
    name: 'Beds & Mattresses',
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
    id: 'kitchen',
    name: 'Kitchen Chimneys',
    subtitle: 'Auto-Clean & Stoves',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
  },
  {
    id: 'showroom',
    name: 'Visit Showroom',
    subtitle: '25,000 Sq.Ft Experience',
    href: '/contact',
    icon: <MapPin className="w-5 h-5 text-rose-600" />,
  },
];

// ─── 2. HERO SLIDER DATA ───────────────────────────────────────────────────
interface HeroBannerSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
  bankOffer: string;
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
    bankOffer: 'Instant 10% Off on Federal Bank & HDFC Cards',
  },
  {
    id: 2,
    image: '/banners/banner2.jpg',
    badge: '100% SEASONED MALABAR HARDWOOD',
    title: 'Handcrafted Teak Living & Bedroom Sets',
    subtitle: 'Kiln-Dried Kerala Teak Sofas, Hydraulic Storage Beds & Dining Sets with Lifetime Guarantee',
    ctaText: 'Explore Teakwood Collection',
    href: '/products?category=furniture',
    bankOffer: '0% Interest EMI Available up to 24 Months',
  },
  {
    id: 3,
    image: '/banners/banner3.jpg',
    badge: 'TROPICAL INVERTER COOLING FESTIVAL',
    title: 'Beat the Kerala Heat • 5-Star Energy Savers',
    subtitle: '100% Pure Copper Split Inverter ACs from Daikin, Voltas & LG with Free Site Inspection',
    ctaText: 'Explore Inverter Split ACs',
    href: '/products?category=appliances&subcategory=air-conditioners',
    bankOffer: 'Free Standard Copper Pipe & Installation Kit',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    badge: 'MODERN KITCHEN & DINING UPGRADE',
    title: 'Faber Auto-Clean Chimneys & Glass Stoves',
    subtitle: 'Transform your cooking experience with motion-gesture chimneys, 750W mixers & water geysers',
    ctaText: 'Shop Kitchen Appliances',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
    bankOffer: 'Extra ₹1,500 Off with Coupon FESTIVAL5',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1600&q=80',
    badge: 'CINEMA EXPERIENCE AT HOME',
    title: 'Massive 55" & 65" 4K Smart Google TVs',
    subtitle: 'Dolby Atmos surround sound, vivid crystal displays & free table mount across Kerala',
    ctaText: 'Explore Smart Televisions',
    href: '/products?category=appliances&subcategory=televisions',
    bankOffer: 'Free Extended 2-Year Panel Warranty Included',
  },
];

// ─── 3. AMAZON QUAD CARDS DATA (4 MULTI-ITEM SECTIONS) ──────────────────────
const APPLIANCE_QUAD = [
  {
    name: 'Split Inverter ACs',
    offer: 'From ₹28,990',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=air-conditioners',
  },
  {
    name: 'Frost-Free Fridges',
    offer: 'Up to 40% Off',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=refrigerators',
  },
  {
    name: 'Front Load Washers',
    offer: '5-Star Energy Star',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=washing-machines',
  },
  {
    name: 'Kitchen Chimneys',
    offer: 'Auto-Clean 1200m³',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
  },
];

const FURNITURE_QUAD = [
  {
    name: 'Solid Teak Sofas',
    offer: '3+1+1 Heritage Sets',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=sofas',
  },
  {
    name: 'Hydraulic Storage Beds',
    offer: 'Solid Wood Timber',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=beds',
  },
  {
    name: '6-Seater Dining Sets',
    offer: 'Cushioned Chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=dining',
  },
  {
    name: '4-Door Wardrobes',
    offer: 'Dressing Mirror Sets',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=wardrobes',
  },
];

const ENTERTAINMENT_QUAD = [
  {
    name: '65" 4K Ultra HD',
    offer: 'Cinema Series',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=televisions',
  },
  {
    name: '55" OLED & QLED',
    offer: 'Google TV Built-in',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=televisions',
  },
  {
    name: '43" Smart LED TVs',
    offer: 'From ₹21,990',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=televisions',
  },
  {
    name: 'Floating TV Units',
    offer: 'Sheesham Solid Wood',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=office-accents',
  },
];

// ─── 4. QUICK TRENDING DEALS REEL DATA ──────────────────────────────────────
const QUICK_TRENDING_ITEMS = [
  {
    name: 'Daikin 1.5 Ton 5-Star Split AC',
    brand: 'Daikin',
    price: 45490,
    mrp: 67200,
    discount: '32% OFF',
    tag: '5-Star Inverter',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=400&q=80',
    href: '/products/daikin-1-5-ton-5-star-inverter-split-ac',
  },
  {
    name: 'Sony Bravia 55" 4K Google TV',
    brand: 'Sony',
    price: 54990,
    mrp: 79900,
    discount: '31% OFF',
    tag: 'Top Rated 4K',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=televisions',
  },
  {
    name: 'Royal Heritage Solid Teak Sofa',
    brand: 'Royal Oak',
    price: 46500,
    mrp: 69900,
    discount: '33% OFF',
    tag: 'Pure Teakwood',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=furniture&subcategory=sofas',
  },
  {
    name: 'LG 655L Side-by-Side Refrigerator',
    brand: 'LG',
    price: 79990,
    mrp: 109990,
    discount: '27% OFF',
    tag: 'Smart Inverter',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    href: '/products?category=appliances&subcategory=refrigerators',
  },
  {
    name: 'Faber 60cm Auto-Clean Chimney',
    brand: 'Faber',
    price: 13990,
    mrp: 24990,
    discount: '44% OFF',
    tag: 'Filterless 1200m³',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    href: '/products/faber-60cm-1200-m3h-auto-clean-kitchen-chimney',
  },
  {
    name: 'Solid Teak 6-Seater Dining Table',
    brand: 'Royal Oak',
    price: 48990,
    mrp: 69990,
    discount: '30% OFF',
    tag: 'Includes 6 Chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
    href: '/products/solid-teak-wood-6-seater-dining-table-set',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 18 });
  const touchStartX = useRef<number | null>(null);
  const dealScrollRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION = 4500;
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

  const scrollDeals = (direction: 'left' | 'right') => {
    if (dealScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      dealScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-[#EAEDED]/70 pb-8 sm:pb-12 space-y-4 sm:space-y-6">
      
      {/* ────────────────────────────────────────────────────────────────────────
          PART 1: MAIN PROMOTIONAL HERO BANNER CAROUSEL (TOP OF HERO)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Promotions" className="w-full relative overflow-hidden bg-slate-950">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[260px] xs:h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] xl:h-[540px] group select-none overflow-hidden"
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

                {/* Left Gradient Overlay for High Contrast Text */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent pointer-events-none" />

                {/* Subtle bottom shadow vignette */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
                  <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-brand-lightBlue mb-3 sm:mb-4 w-fit shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-black uppercase tracking-wider text-[10px] sm:text-[11px]">
                      {slide.badge}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-slate-200 mt-2 sm:mt-3 leading-relaxed drop-shadow-sm max-w-xl">
                    {slide.subtitle}
                  </p>

                  {/* Bank Offer Strip inside banner */}
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-200 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold backdrop-blur-xs w-fit">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{slide.bankOffer}</span>
                  </div>

                  <div className="mt-4 sm:mt-6 flex items-center gap-3">
                    <span className="px-5 py-2.5 sm:px-6 sm:py-3 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs sm:text-sm font-black shadow-button transition-all inline-flex items-center gap-2">
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
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

          {/* Bottom Indicators */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
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
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 2: FLIPKART STYLE CATEGORY QUICK NAVIGATION (PLACED UNDER HERO SLIDER)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Product Categories" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs px-3 sm:px-5 py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
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
                <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium hidden sm:block truncate max-w-[90px]">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 3: AMAZON QUAD CARDS & FLASH DEAL (4-COLUMN BENTO GRID)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Categories & Deals" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* ── CARD 1: APPLIANCES FESTIVAL (Amazon Style) ── */}
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
              <span>See all home appliances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 2: MALABAR TEAKWOOD (Amazon Style) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-cardHover border border-brand-border transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Malabar Teakwood <br />
                  <span className="text-xs font-bold text-amber-700">100% Solid Seasoned Wood</span>
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

          {/* ── CARD 3: 4K SMART TVS & AUDIO (Amazon Style) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-cardHover border border-brand-border transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Smart 4K TVs & Audio <br />
                  <span className="text-xs font-bold text-cyan-600">Sony, LG, Samsung Deals</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-black uppercase shrink-0">
                  4K
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {ENTERTAINMENT_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50 hover:bg-cyan-50/50 transition-all border border-slate-100 hover:border-cyan-200"
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
              href="/products?category=appliances&subcategory=televisions"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-0.5 transition-all"
            >
              <span>See all 4K Smart TVs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 4: LIGHTNING FLASH DEAL (Flipkart Style) ── */}
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
                href="/products/daikin-1-5-ton-5-star-inverter-split-ac"
                className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-50 my-2 group-hover:scale-102 transition-transform duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80"
                  alt="Daikin 1.5 Ton 5-Star Inverter Split AC"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  32% OFF
                </span>
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs border border-black/5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9
                </span>
              </Link>

              {/* Product Info */}
              <Link href="/products/daikin-1-5-ton-5-star-inverter-split-ac" className="block">
                <p className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 hover:text-brand-primary transition-colors">
                  Daikin 1.5 Ton 5-Star Neo Swing Inverter Split AC
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base sm:text-lg font-black text-slate-950">₹45,490</span>
                  <span className="text-xs text-slate-500 line-through">₹67,200</span>
                  <span className="text-[11px] font-bold text-emerald-600">Save ₹21,710</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium mt-1">
                  <Truck className="w-3 h-3 text-brand-primary" />
                  <span>Free Express Delivery Across Kerala</span>
                </div>
              </Link>
            </div>

            <Link
              href="/products/daikin-1-5-ton-5-star-inverter-split-ac"
              className="mt-3 w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-black text-center shadow-button transition-all flex items-center justify-center gap-1.5"
            >
              <span>Grab Flash Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 4: FLIPKART / AMAZON 3-COLUMN BANK & BENEFIT BANNER STRIP
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Financing and Delivery Benefits" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center gap-3.5 shadow-sm border border-blue-800/40">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
              <Percent className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Bank Festival Offer</span>
              <p className="text-xs sm:text-sm font-black text-white leading-tight">Instant 10% Off on Federal &amp; HDFC</p>
              <span className="text-[10.5px] text-slate-300">On appliances &amp; teak furniture</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white flex items-center gap-3.5 shadow-sm border border-emerald-800/40">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Zero Cost Financing</span>
              <p className="text-xs sm:text-sm font-black text-white leading-tight">0% Interest EMI from ₹1,299/mo</p>
              <span className="text-[10.5px] text-slate-300">Bajaj Finserv &amp; major credit cards</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-900 text-white flex items-center gap-3.5 shadow-sm border border-amber-800/40">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
              <Truck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Kerala Express Dispatch</span>
              <p className="text-xs sm:text-sm font-black text-white leading-tight">24-48 Hour Doorstep Unboxing</p>
              <span className="text-[10.5px] text-slate-300">Covering all 14 districts safely</span>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 5: HORIZONTAL BLOCKBUSTER DEALS REEL ("TRENDING IN KERALA")
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Trending Offers" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-card">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                  Blockbuster Deals
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Trending Offers in Kerala • Up to 44% Off
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollDeals('left')}
                aria-label="Scroll deals left"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:text-brand-primary text-slate-600 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollDeals('right')}
                aria-label="Scroll deals right"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-brand-primary hover:text-brand-primary text-slate-600 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                href="/products?isDeal=true"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-brand-primary hover:underline ml-2"
              >
                <span>See all deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Horizontal Reel */}
          <div
            ref={dealScrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-1"
          >
            {QUICK_TRENDING_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group/deal flex-none w-[180px] sm:w-[210px] p-2.5 rounded-xl bg-slate-50 hover:bg-white hover:shadow-card border border-slate-200/80 hover:border-brand-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-white relative mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover/deal:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                      {item.discount}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                    {item.brand}
                  </span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover/deal:text-brand-primary transition-colors">
                    {item.name}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{item.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-semibold text-slate-500 block truncate mt-0.5">
                    {item.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 6: SERVICE ASSURANCE TRUST STRIP
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Customer Guarantees" className="max-w-7xl mx-auto px-2 sm:px-4">
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
      </section>

    </div>
  );
}
