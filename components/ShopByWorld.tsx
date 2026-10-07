import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Tv,
  Refrigerator,
  Wind,
  Armchair,
  BedDouble,
  Utensils,
  ShieldCheck,
  Truck,
  Wrench,
  Award,
} from 'lucide-react';

export default function ShopByWorld() {
  const appliancePills = [
    { name: 'Double Door Fridges', href: '/products?category=appliances&subcategory=refrigerators' },
    { name: 'Front Load Washers', href: '/products?category=appliances&subcategory=washing-machines' },
    { name: '4K QLED / OLED TVs', href: '/products?category=appliances&subcategory=televisions' },
    { name: '5★ Inverter ACs', href: '/products?category=appliances&subcategory=air-conditioners' },
  ];

  const furniturePills = [
    { name: 'Solid Teak Living Sets', href: '/products?category=furniture&subcategory=sofas' },
    { name: 'Hydraulic Storage Beds', href: '/products?category=furniture&subcategory=beds' },
    { name: '6-Seater Hardwood Dining', href: '/products?category=furniture&subcategory=dining' },
    { name: 'Custom Teak Wardrobes', href: '/products?category=furniture' },
  ];

  return (
    /* SECTION 2 — SHOP BY WORLD: Two strong flagship visual worlds */
    <section className="py-10 sm:py-14 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Two Flagship Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Explore Our Worlds
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Choose your department: Global smart electronics with official brand warranties or authentic handcrafted solid teakwood furniture made to last generations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* World 1: Home Appliances */}
          <div className="group relative rounded-3xl overflow-hidden border border-brand-border bg-[#0B1528] shadow-card hover:shadow-cardHover transition-all duration-500 flex flex-col justify-between min-h-[420px] sm:min-h-[450px]">
            {/* Background Photography with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Smart Home Appliances"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-106 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/75 to-transparent" />
            </div>

            {/* Top Badge & Discount Pill */}
            <div className="relative z-10 p-6 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-brand-deepBlue text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                World of Smart Electronics
              </span>

              <span className="px-3 py-1.5 rounded-full bg-brand-primary text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                Up to 45% Off
              </span>
            </div>

            {/* Bottom Content & Quick Category Shortcuts */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4 text-white">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white group-hover:text-brand-lightBlue transition-colors">
                  Home Appliances
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mt-1 font-normal">
                  Cinematic 4K Google TVs, smart inverter frost-free refrigerators, and front-load washers from authorized brands LG, Samsung, Sony, and Bosch.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200 py-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                  <span>Authorized Brand Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                  <span>Doorstep Delivery Across Kerala</span>
                </div>
              </div>

              {/* Quick Jump Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {appliancePills.map((pill) => (
                  <Link
                    key={pill.name}
                    href={pill.href}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-brand-deepBlue backdrop-blur-md border border-white/20 transition-all font-semibold"
                  >
                    {pill.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/products?category=appliances"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-button active:scale-98 group/btn"
                >
                  <span>Explore All Appliances</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[11px] text-brand-lightBlue font-semibold hidden sm:inline">
                  Free In-Home Installation
                </span>
              </div>
            </div>
          </div>

          {/* World 2: Furniture */}
          <div className="group relative rounded-3xl overflow-hidden border border-brand-border bg-[#0B1528] shadow-card hover:shadow-cardHover transition-all duration-500 flex flex-col justify-between min-h-[420px] sm:min-h-[450px]">
            {/* Background Photography with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                alt="Handcrafted Solid Wood Furniture"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-106 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/75 to-transparent" />
            </div>

            {/* Top Badge & Quality Pill */}
            <div className="relative z-10 p-6 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-brand-deepBlue text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                Handcrafted Solid Living
              </span>

              <span className="px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/30 text-[11px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
                100% Solid Teakwood
              </span>
            </div>

            {/* Bottom Content & Quick Category Shortcuts */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4 text-white">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white group-hover:text-brand-lightBlue transition-colors">
                  Furniture Collections
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mt-1 font-normal">
                  Authentic seasoned solid teakwood living sets, ergonomic king storage beds, luxury dining tables, and bespoke bedroom furniture designed for Kerala weather.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200 py-1">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                  <span>Kiln-Dried Moisture Proof</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                  <span>Free In-Home Carpenter Assembly</span>
                </div>
              </div>

              {/* Quick Jump Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {furniturePills.map((pill) => (
                  <Link
                    key={pill.name}
                    href={pill.href}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-brand-deepBlue backdrop-blur-md border border-white/20 transition-all font-semibold"
                  >
                    {pill.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/products?category=furniture"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-button active:scale-98 group/btn"
                >
                  <span>Explore Furniture</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[11px] text-brand-lightBlue font-semibold hidden sm:inline">
                  Lifetime Hardwood Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
