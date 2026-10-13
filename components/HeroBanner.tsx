'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Tv,
  Refrigerator,
  Wind,
  Armchair,
  BedDouble,
  Utensils,
  WashingMachine,
  Flame,
  Clock,
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Truck,
} from 'lucide-react';

// ─── 1. CATEGORY NAVIGATION DATA ───────────────────────────────────────────
interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  iconBg: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'top-offers',
    name: 'Top Offers',
    subtitle: 'Up to 55% Off',
    href: '/products?isDeal=true',
    icon: <Flame className="w-5 h-5 text-rose-500" />,
    badge: 'HOT',
    badgeColor: 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-xs',
    iconBg: 'bg-rose-50/80 border-rose-200 group-hover:bg-rose-100/80 group-hover:border-rose-300',
  },
  {
    id: 'tvs',
    name: 'Smart 4K TVs',
    subtitle: 'Sony • LG • Samsung',
    href: '/products?category=appliances&subcategory=televisions',
    icon: <Tv className="w-5 h-5 text-blue-600" />,
    iconBg: 'bg-blue-50/80 border-blue-200 group-hover:bg-blue-100/80 group-hover:border-blue-300',
  },
  {
    id: 'fridges',
    name: 'Refrigerators',
    subtitle: 'Inverter & Frost-Free',
    href: '/products?category=appliances&subcategory=refrigerators',
    icon: <Refrigerator className="w-5 h-5 text-cyan-600" />,
    iconBg: 'bg-cyan-50/80 border-cyan-200 group-hover:bg-cyan-100/80 group-hover:border-cyan-300',
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    subtitle: 'Front & Top Load',
    href: '/products?category=appliances&subcategory=washing-machines',
    icon: <WashingMachine className="w-5 h-5 text-indigo-600" />,
    iconBg: 'bg-indigo-50/80 border-indigo-200 group-hover:bg-indigo-100/80 group-hover:border-indigo-300',
  },
  {
    id: 'acs',
    name: 'Air Conditioners',
    subtitle: 'Split Inverter ACs',
    href: '/products?category=appliances&subcategory=air-conditioners',
    icon: <Wind className="w-5 h-5 text-sky-500" />,
    badge: 'COOL',
    badgeColor: 'bg-sky-500 text-white shadow-xs',
    iconBg: 'bg-sky-50/80 border-sky-200 group-hover:bg-sky-100/80 group-hover:border-sky-300',
  },
  {
    id: 'sofas',
    name: 'Teakwood Sofas',
    subtitle: 'Malabar Hardwood',
    href: '/products?category=furniture&subcategory=sofas',
    icon: <Armchair className="w-5 h-5 text-amber-700" />,
    badge: 'TEAK',
    badgeColor: 'bg-amber-600 text-white shadow-xs',
    iconBg: 'bg-amber-50/80 border-amber-200 group-hover:bg-amber-100/80 group-hover:border-amber-300',
  },
  {
    id: 'beds',
    name: 'Beds & Mattresses',
    subtitle: 'Hydraulic Storage',
    href: '/products?category=furniture&subcategory=beds',
    icon: <BedDouble className="w-5 h-5 text-emerald-600" />,
    iconBg: 'bg-emerald-50/80 border-emerald-200 group-hover:bg-emerald-100/80 group-hover:border-emerald-300',
  },
  {
    id: 'dining',
    name: 'Dining Sets',
    subtitle: 'Solid Wood 6-Seater',
    href: '/products?category=furniture&subcategory=dining',
    icon: <Utensils className="w-5 h-5 text-orange-600" />,
    iconBg: 'bg-orange-50/80 border-orange-200 group-hover:bg-orange-100/80 group-hover:border-orange-300',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Chimneys',
    subtitle: 'Auto-Clean & Stoves',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    iconBg: 'bg-purple-50/80 border-purple-200 group-hover:bg-purple-100/80 group-hover:border-purple-300',
  },
  {
    id: 'showroom',
    name: 'Visit Showroom',
    subtitle: 'Experience In Person',
    href: '/contact',
    icon: <MapPin className="w-5 h-5 text-rose-600" />,
    iconBg: 'bg-rose-50/80 border-rose-200 group-hover:bg-rose-100/80 group-hover:border-rose-300',
  },
];

// ─── 2. AMAZON QUAD CARDS DATA ─────────────────────────────────────────────
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
    name: 'Storage Beds',
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

// ─── 3. CURATED PORTRAIT LIFESTYLE ROOMS ────────────────────────────────────
const CURATED_PORTRAIT_SPACES = [
  {
    title: 'Royal Teak Living Room',
    tag: '100% Solid Teak',
    subtitle: 'Nilambur Handcrafted Sofas & Tables',
    offer: 'Explore 85+ Designs',
    image: '/banners/portrait-furniture.jpg',
    href: '/products?category=furniture&subcategory=sofas',
  },
  {
    title: 'Smart Gourmet Kitchen',
    tag: 'Festive Deals',
    subtitle: 'French Door Fridges & Built-in Hobs',
    offer: 'Up to 45% Off',
    image: '/banners/portrait-appliances.jpg',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
  },
  {
    title: 'Master Bedroom Haven',
    tag: 'Hydraulic Storage',
    subtitle: 'Seasoned Teak King Beds & Mattresses',
    offer: 'From ₹24,990',
    image: '/banners/portrait-bedroom.jpg',
    href: '/products?category=furniture&subcategory=beds',
  },
  {
    title: 'Luxury Dining Suites',
    tag: 'Handcrafted',
    subtitle: 'Solid Wood 6-Seater Dining Sets',
    offer: 'Lifetime Warranty',
    image: '/banners/portrait-dining.jpg',
    href: '/products?category=furniture&subcategory=dining',
  },
];

function FlashDealCountdown() {
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mt-0.5">
      <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
      <span className="font-mono" suppressHydrationWarning>
        {formatTwoDigits(countdown.hours)}h : {formatTwoDigits(countdown.minutes)}m : {formatTwoDigits(countdown.seconds)}s
      </span>
    </div>
  );
}

export default function HeroBanner() {
  return (
    <div className="bg-[#F4F6F8] pt-2.5 sm:pt-4 pb-10 sm:pb-14 space-y-4 sm:space-y-5">
      
      {/* ────────────────────────────────────────────────────────────────────────
          PART 1: EDITORIAL FLAGSHIP BENTO GRID (WITH LUXURY PORTRAIT SPOTLIGHTS)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Department Banners" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4">
          
          {/* ── LEFT COLUMN (LG: 4 COLS): LUXURY PORTRAIT SMART KITCHEN & APPLIANCES ── */}
          <Link
            href="/products?category=appliances"
            className="md:col-span-1 lg:col-span-4 group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-rose-400/60 transition-all duration-300 block"
          >
            <Image
              src="/banners/portrait-appliances.jpg"
              alt="Smart Kitchen and Modern Appliances Festival"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-black/15 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-400/30 text-rose-200 text-[10.5px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
                <span>Festive Kitchen Sale</span>
              </div>
              <span className="text-[11px] font-bold text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                Up to 45% Off
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-300">Smart Living Series</span>
              <h2 className="text-lg sm:text-xl font-black drop-shadow-md leading-tight mt-0.5">
                Smart Kitchen &amp; Refrigerators
              </h2>
              <p className="text-xs text-slate-200/90 font-medium line-clamp-2 mt-1">
                Multi-Door French Fridges, Front Load Washers &amp; Auto-Clean Chimneys
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                <span>Explore Appliances</span>
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* ── CENTER COLUMN (LG: 4 COLS): 2 STACKED SPLIT BANNERS (4K CINEMA & INVERTER ACs) ── */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col justify-between gap-3.5 sm:gap-4 lg:h-[490px]">
            
            {/* Top Center: Smart 4K Ultra HD Cinema TVs */}
            <Link
              href="/products?category=appliances&subcategory=televisions"
              className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-auto sm:h-[225px] lg:h-[235px] shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-blue-400/60 transition-all duration-300 block"
            >
              <Image
                src="/banners/banner4.jpg"
                alt="Sony Bravia & Samsung Smart 4K Ultra HD TVs"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/10 pointer-events-none" />

              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-blue-400/30 text-blue-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                  <span>📺 4K Cinema Series</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  From ₹18,990
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                <div className="pr-2">
                  <p className="text-sm sm:text-base font-black drop-shadow-md leading-tight">
                    Smart 4K OLED &amp; Google TVs
                  </p>
                  <span className="text-[11px] text-blue-100/90 font-medium line-clamp-1 mt-0.5">
                    Sony Bravia, LG &amp; Samsung • Free Wall Mount
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 shadow-md">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Bottom Center: Tropical 5-Star Inverter ACs */}
            <Link
              href="/products?category=appliances&subcategory=air-conditioners"
              className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-auto sm:h-[225px] lg:h-[235px] shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-cyan-400/60 transition-all duration-300 block"
            >
              <Image
                src="/banners/banner3.jpg"
                alt="Tropical Inverter Cooling Festival"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/10 pointer-events-none" />

              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-400/30 text-cyan-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <span>❄️ 5-Star Inverter ACs</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-white bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  Free Install Kit
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                <div className="pr-2">
                  <p className="text-sm sm:text-base font-black drop-shadow-md leading-tight">
                    Split Inverter Air Conditioners
                  </p>
                  <span className="text-[11px] text-cyan-100/90 font-medium line-clamp-1 mt-0.5">
                    Daikin, Voltas &amp; Lloyd • Superfast Kerala Cooling
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0 shadow-md">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

          </div>

          {/* ── RIGHT COLUMN (LG: 4 COLS): LUXURY PORTRAIT HANDCRAFTED TEAKWOOD ── */}
          <Link
            href="/products?category=furniture"
            className="md:col-span-1 lg:col-span-4 group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-amber-400/60 transition-all duration-300 block"
          >
            <Image
              src="/banners/portrait-furniture.jpg"
              alt="Handcrafted Solid Nilambur Teakwood Furniture"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-black/15 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 text-amber-200 text-[10.5px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                <span>🪵 Solid Nilambur Teak</span>
              </div>
              <span className="text-[11px] font-bold text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                Lifetime Timber Warranty
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300">Heritage Kerala Craft</span>
              <h2 className="text-lg sm:text-xl font-black drop-shadow-md leading-tight mt-0.5">
                Royal Living &amp; Bedroom Suites
              </h2>
              <p className="text-xs text-amber-100/90 font-medium line-clamp-2 mt-1">
                Seasoned Hardwood Sofas, Hand-Carved Teak Tables &amp; Custom Dining
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                <span>Explore Teak Furniture</span>
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 2: MINIMALIST ASSURANCE STRIP (KERALA-WIDE TRUST)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Customer Guarantees" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 sm:py-3.5 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs divide-y sm:divide-y-0 divide-slate-100">
            <div className="flex items-center justify-center gap-2.5 py-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[13px]">100% Brand Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-1 border-t sm:border-t-0 sm:border-l border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[13px]">0% Interest Easy EMI</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-1 border-t sm:border-t-0 sm:border-l border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[13px]">Kerala Express Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-1 border-t sm:border-t-0 sm:border-l border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[13px]">Free In-Home Demo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 3: CATEGORY QUICK NAVIGATION STRIP (UNDER HERO SECTION)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Product Categories" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto scrollbar-none">
            {CATEGORY_ITEMS.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center min-w-[80px] sm:min-w-[100px] text-center px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
              >
                <div className="relative mb-2">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm ${cat.iconBg}`}
                  >
                    {cat.icon}
                  </div>
                  {cat.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight ${cat.badgeColor}`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-800 group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block truncate max-w-[95px] mt-0.5">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 4: CURATED LIVING SPACES (EDITORIAL PORTRAIT COLLECTION)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Curated Living Spaces" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-primary mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                <span>Shop By Room &amp; Lifestyle</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Curated Spaces for Modern Kerala Living
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors shrink-0"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {CURATED_PORTRAIT_SPACES.map((space, idx) => (
              <Link
                key={idx}
                href={space.href}
                className="group relative rounded-2xl overflow-hidden bg-slate-950 aspect-[3/4] shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-slate-400 transition-all duration-300 block"
              >
                <Image
                  src={space.image}
                  alt={space.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/10 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                  <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {space.tag}
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-200 bg-amber-950/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30">
                    {space.offer}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 text-white">
                  <h3 className="text-xs sm:text-sm font-black drop-shadow-md leading-tight group-hover:text-amber-200 transition-colors">
                    {space.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-200 font-medium line-clamp-1 mt-0.5">
                    {space.subtitle}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">
                    <span>Explore Room</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 5: HIGH-CONTRAST AMAZON QUAD CARDS & FLASH DEAL (4-COLUMN BENTO)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Categories & Deals" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* ── CARD 1: APPLIANCES FESTIVAL (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3.5 min-h-[44px]">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Appliances Festival
                  </h2>
                  <p className="text-xs font-bold text-brand-primary">Up to 45% Off • Top Brands</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase shrink-0">
                  Sale
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {APPLIANCE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-2 rounded-xl bg-slate-50/80 hover:bg-brand-lightBlueSoft/60 transition-all border border-slate-100 hover:border-brand-lightBlue/60"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-sm relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 25vw, 120px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 line-clamp-1 mt-0.5">
                      {item.offer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products?category=appliances"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-deepBlue group-hover:translate-x-1 transition-all"
            >
              <span>See all home appliances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 2: MALABAR TEAKWOOD (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3.5 min-h-[44px]">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Malabar Teakwood
                  </h2>
                  <p className="text-xs font-bold text-amber-700">100% Solid Seasoned Wood</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase shrink-0">
                  Teak
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {FURNITURE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-2 rounded-xl bg-slate-50/80 hover:bg-amber-50/60 transition-all border border-slate-100 hover:border-amber-200"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-sm relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 25vw, 120px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 line-clamp-1 mt-0.5">
                      {item.offer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products?category=furniture"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-deepBlue group-hover:translate-x-1 transition-all"
            >
              <span>Explore Kerala teak furniture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 3: 4K SMART TVS & AUDIO (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3.5 min-h-[44px]">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Smart 4K TVs &amp; Audio
                  </h2>
                  <p className="text-xs font-bold text-cyan-700">Sony, LG, Samsung Deals</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-black uppercase shrink-0">
                  4K
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {ENTERTAINMENT_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-2 rounded-xl bg-slate-50/80 hover:bg-cyan-50/60 transition-all border border-slate-100 hover:border-cyan-200"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-sm relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 25vw, 120px"
                        className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 line-clamp-1 mt-0.5">
                      {item.offer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products?category=appliances&subcategory=televisions"
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-deepBlue group-hover:translate-x-1 transition-all"
            >
              <span>See all 4K Smart TVs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 4: LIGHTNING FLASH DEAL (Deal of the Day) ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3.5 min-h-[44px]">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Deal of the Day
                  </h2>
                  <FlashDealCountdown />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-sm text-[10px] font-black uppercase shrink-0 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  Flash
                </span>
              </div>

              {/* Product Visual */}
              <Link
                href="/product/daikin-1-5-ton-5-star-inverter-split-ac"
                className="block relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 mb-2.5 group-hover:shadow-md transition-all duration-300 border border-slate-100"
              >
                <Image
                  src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80"
                  alt="Daikin 1.5 Ton 5-Star Inverter Split AC"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                  32% OFF
                </span>
                <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-slate-200/60 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9
                </span>
              </Link>

              {/* Product Info */}
              <Link href="/product/daikin-1-5-ton-5-star-inverter-split-ac" className="block space-y-1">
                <p className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 hover:text-brand-primary transition-colors leading-snug">
                  Daikin 1.5 Ton 5-Star Neo Swing Inverter AC
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-black text-slate-950">₹45,490</span>
                  <span className="text-xs text-slate-400 line-through">₹67,200</span>
                  <span className="text-[11px] font-bold text-emerald-600">Save ₹21,710</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium">
                  <Truck className="w-3 h-3 text-brand-primary shrink-0" />
                  <span className="truncate">Free Express Delivery Across Kerala</span>
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/product/daikin-1-5-ton-5-star-inverter-split-ac"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white text-xs font-bold text-center shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group/btn"
              >
                <span>Grab Flash Deal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
