'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Truck,
  ShieldCheck,
  CreditCard,
  Building2,
  Zap,
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
    subtitle: '25,000 Sq.Ft Experience',
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

export default function HeroBanner() {
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 18 });

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

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-[#F4F6F8] pt-2.5 sm:pt-4 pb-10 sm:pb-14 space-y-4 sm:space-y-5">
      
      {/* ────────────────────────────────────────────────────────────────────────
          PART 1: EDITORIAL FLAGSHIP BENTO GRID (REAL PHOTOGRAPHIC BANNERS)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Department Banners" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5">
          
          {/* ── MAIN SPOTLIGHT BANNER: KERALA APPLIANCE FESTIVAL (8 COLS) ── */}
          <Link
            href="/products?category=appliances"
            className="lg:col-span-8 group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[16/8.5] lg:aspect-auto lg:h-[450px] shadow-md hover:shadow-2xl border border-slate-200/90 hover:border-brand-primary/50 transition-all duration-500 block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/banners/banner1.jpg"
              alt="LG & Samsung Kerala Premier Appliance Festival"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out select-none"
            />

            {/* Subtle Gradient Insets for High-End Framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

            {/* Top-Left Frosted Badge */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-10 hidden xs:inline-flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-white text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Festive Mega Offers • Official Brand Warranty</span>
            </div>

            {/* Bottom-Left Glassmorphism CTA Pill */}
            <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 z-10 flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border border-white/30 text-white shadow-xl group-hover:bg-slate-900 group-hover:border-brand-lightBlue/60 transition-all">
              <span className="text-xs sm:text-sm font-black tracking-tight">Shop Festive Appliance Offers</span>
              <ArrowRight className="w-4 h-4 text-brand-lightBlue group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>

            {/* Bottom-Right Frosted Card Offer */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-10 hidden sm:inline-flex items-center gap-2 bg-amber-500/25 border border-amber-300/40 text-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md shadow-md">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>Instant 10% Off on Cards</span>
            </div>
          </Link>

          {/* ── RIGHT STACKED BANNERS: TEAKWOOD & INVERTER ACs (4 COLS) ── */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4.5 lg:h-[450px]">
            
            {/* ── CARD 1: MALABAR TEAKWOOD SHOWCASE ── */}
            <Link
              href="/products?category=furniture"
              className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-auto sm:h-[205px] lg:h-[217px] shadow-md hover:shadow-2xl border border-slate-200/90 hover:border-amber-400/50 transition-all duration-500 block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banners/banner2.jpg"
                alt="Handcrafted Teak Living & Bedroom Sets"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Top Tag */}
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
                <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-amber-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 shadow-xs">
                  🪵 100% Solid Malabar Teak
                </span>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 flex items-center justify-between right-3 sm:right-3.5 text-white">
                <div>
                  <p className="text-xs sm:text-sm font-black drop-shadow-md leading-tight">Teak Living &amp; Bedroom Sets</p>
                  <span className="text-[10.5px] text-amber-200/90 font-medium">Lifetime Structural Guarantee</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shrink-0 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* ── CARD 2: TROPICAL INVERTER ACs ── */}
            <Link
              href="/products?category=appliances&subcategory=air-conditioners"
              className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-auto sm:h-[205px] lg:h-[217px] shadow-md hover:shadow-2xl border border-slate-200/90 hover:border-cyan-400/50 transition-all duration-500 block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banners/banner3.jpg"
                alt="Tropical Inverter Cooling Festival"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Top Tag */}
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
                <span className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-cyan-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-400/30 shadow-xs">
                  ❄️ 5-Star Inverter ACs
                </span>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 flex items-center justify-between right-3 sm:right-3.5 text-white">
                <div>
                  <p className="text-xs sm:text-sm font-black drop-shadow-md leading-tight">Daikin &amp; Voltas Split ACs</p>
                  <span className="text-[10.5px] text-cyan-200/90 font-medium">Free Installation Kit Included</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shrink-0 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 2: MINIMALIST ASSURANCE STRIP (KERALA-WIDE TRUST)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Customer Guarantees" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 sm:py-3.5 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[12.5px]">Kerala 24-48 Hr Express Delivery</span>
            </div>
            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[12.5px]">100% Brand Official Warranty</span>
            </div>
            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[12.5px]">0% Interest Easy EMI Options</span>
            </div>
            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-[12.5px]">25,000 Sq.Ft Mega Showroom</span>
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
                className="group flex flex-col items-center min-w-[80px] sm:min-w-[100px] text-center px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300 shrink-0"
              >
                <div className="relative mb-2">
                  <div
                    className={`w-13 h-13 sm:w-15 sm:h-15 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${cat.iconBg}`}
                  >
                    {cat.icon}
                  </div>
                  {cat.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight ${cat.badgeColor}`}
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
          PART 4: HIGH-CONTRAST AMAZON QUAD CARDS & FLASH DEAL (4-COLUMN BENTO)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Categories & Deals" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
          
          {/* ── CARD 1: APPLIANCES FESTIVAL (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-4.5 sm:p-5.5 shadow-sm hover:shadow-xl border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Appliances Festival <br />
                  <span className="text-xs font-bold text-brand-primary">Up to 45% Off • Top Brands</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase shrink-0">
                  Sale
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {APPLIANCE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50/80 hover:bg-brand-lightBlueSoft/50 transition-all border border-slate-100 hover:border-brand-lightBlue"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-108 transition-transform duration-300"
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
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-1 transition-all"
            >
              <span>See all home appliances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 2: MALABAR TEAKWOOD (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-4.5 sm:p-5.5 shadow-sm hover:shadow-xl border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Malabar Teakwood <br />
                  <span className="text-xs font-bold text-amber-700">100% Solid Seasoned Wood</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase shrink-0">
                  Teak
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {FURNITURE_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50/80 hover:bg-amber-50/50 transition-all border border-slate-100 hover:border-amber-200"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-108 transition-transform duration-300"
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
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-1 transition-all"
            >
              <span>Explore Kerala teak furniture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 3: 4K SMART TVS & AUDIO (Amazon Style) ── */}
          <div className="bg-white rounded-3xl p-4.5 sm:p-5.5 shadow-sm hover:shadow-xl border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Smart 4K TVs & Audio <br />
                  <span className="text-xs font-bold text-cyan-600">Sony, LG, Samsung Deals</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-black uppercase shrink-0">
                  4K
                </span>
              </div>

              {/* 2x2 Mini Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {ENTERTAINMENT_QUAD.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex flex-col p-1.5 rounded-xl bg-slate-50/80 hover:bg-cyan-50/50 transition-all border border-slate-100 hover:border-cyan-200"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-108 transition-transform duration-300"
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
              className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-primaryHover group-hover:translate-x-1 transition-all"
            >
              <span>See all 4K Smart TVs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── CARD 4: LIGHTNING FLASH DEAL (Deal of the Day) ── */}
          <div className="bg-white rounded-3xl p-4.5 sm:p-5.5 shadow-sm hover:shadow-xl border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
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
                className="block relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 my-2 group-hover:scale-102 transition-transform duration-300 shadow-2xs"
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
              className="mt-3.5 w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-black text-center shadow-button transition-all flex items-center justify-center gap-1.5"
            >
              <span>Grab Flash Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
