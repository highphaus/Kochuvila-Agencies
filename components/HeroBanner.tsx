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
    iconBg: 'bg-rose-50 border-rose-200 group-hover:bg-rose-100',
  },
  {
    id: 'tvs',
    name: 'Smart 4K TVs',
    subtitle: 'Sony • LG • Samsung',
    href: '/products?category=appliances&subcategory=televisions',
    icon: <Tv className="w-5 h-5 text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-200 group-hover:bg-blue-100',
  },
  {
    id: 'fridges',
    name: 'Refrigerators',
    subtitle: 'Inverter & Frost-Free',
    href: '/products?category=appliances&subcategory=refrigerators',
    icon: <Refrigerator className="w-5 h-5 text-cyan-600" />,
    iconBg: 'bg-cyan-50 border-cyan-200 group-hover:bg-cyan-100',
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    subtitle: 'Front & Top Load',
    href: '/products?category=appliances&subcategory=washing-machines',
    icon: <WashingMachine className="w-5 h-5 text-indigo-600" />,
    iconBg: 'bg-indigo-50 border-indigo-200 group-hover:bg-indigo-100',
  },
  {
    id: 'acs',
    name: 'Air Conditioners',
    subtitle: 'Split Inverter ACs',
    href: '/products?category=appliances&subcategory=air-conditioners',
    icon: <Wind className="w-5 h-5 text-sky-500" />,
    badge: 'COOL',
    badgeColor: 'bg-sky-500 text-white shadow-xs',
    iconBg: 'bg-sky-50 border-sky-200 group-hover:bg-sky-100',
  },
  {
    id: 'sofas',
    name: 'Teakwood Sofas',
    subtitle: 'Malabar Hardwood',
    href: '/products?category=furniture&subcategory=sofas',
    icon: <Armchair className="w-5 h-5 text-amber-700" />,
    badge: 'TEAK',
    badgeColor: 'bg-amber-600 text-white shadow-xs',
    iconBg: 'bg-amber-50 border-amber-200 group-hover:bg-amber-100',
  },
  {
    id: 'beds',
    name: 'Beds & Mattresses',
    subtitle: 'Hydraulic Storage',
    href: '/products?category=furniture&subcategory=beds',
    icon: <BedDouble className="w-5 h-5 text-emerald-600" />,
    iconBg: 'bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100',
  },
  {
    id: 'dining',
    name: 'Dining Sets',
    subtitle: 'Solid Wood 6-Seater',
    href: '/products?category=furniture&subcategory=dining',
    icon: <Utensils className="w-5 h-5 text-orange-600" />,
    iconBg: 'bg-orange-50 border-orange-200 group-hover:bg-orange-100',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Chimneys',
    subtitle: 'Auto-Clean & Stoves',
    href: '/products?category=appliances&subcategory=kitchen-appliances',
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    iconBg: 'bg-purple-50 border-purple-200 group-hover:bg-purple-100',
  },
  {
    id: 'showroom',
    name: 'Visit Showroom',
    subtitle: '25,000 Sq.Ft Experience',
    href: '/contact',
    icon: <MapPin className="w-5 h-5 text-rose-600" />,
    iconBg: 'bg-rose-50 border-rose-200 group-hover:bg-rose-100',
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
    <div className="bg-[#EAEDED]/80 pt-2 sm:pt-4 pb-6 sm:pb-8 space-y-3.5 sm:space-y-4">
      
      {/* ────────────────────────────────────────────────────────────────────────
          PART 1: FLIPKART STYLE CATEGORY QUICK NAVIGATION BAR (AT TOP)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Product Categories" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm px-3 sm:px-5 py-3.5">
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 overflow-x-auto scrollbar-none">
            {CATEGORY_ITEMS.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center min-w-[78px] sm:min-w-[98px] text-center px-1 sm:px-2 py-1 rounded-xl hover:bg-slate-50 transition-all shrink-0"
              >
                <div className="relative mb-1.5 sm:mb-2">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${cat.iconBg}`}
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
                <span className="text-[12px] sm:text-[12.5px] font-bold text-slate-800 group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block truncate max-w-[92px] mt-0.5">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          PART 2: AMAZON QUAD CARDS & FLASH DEAL (4-COLUMN BENTO GRID)
         ──────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Featured Categories & Deals" className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* ── CARD 1: APPLIANCES FESTIVAL (Amazon Style) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between group">
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
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between group">
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
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between group">
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

          {/* ── CARD 4: LIGHTNING FLASH DEAL (Deal of the Day) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between group relative overflow-hidden">
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

    </div>
  );
}
