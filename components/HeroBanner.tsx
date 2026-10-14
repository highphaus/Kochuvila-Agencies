'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react';

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
    subtitle: 'Sofas, Tables, TV Units & More',
    imageSrc: '/banners/hero-living.jpg',
    link: '/furniture?category=living-room',
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    subtitle: 'Beds, Wardrobes, Mattresses & More',
    imageSrc: '/banners/promo-furniture.jpg',
    link: '/furniture?category=bedroom',
  },
  {
    id: 'kitchen-appliances',
    title: 'Kitchen Appliances',
    subtitle: 'Fridges, Ovens, Microwaves & More',
    imageSrc: '/banners/promo-appliances.jpg',
    link: '/appliances?category=kitchen-appliances',
  },
  {
    id: 'laundry-appliances',
    title: 'Laundry Appliances',
    subtitle: 'Washers, Dryers & More',
    imageSrc: '/banners/card-laundry.jpg',
    link: '/appliances?category=washing-machines',
  },
  {
    id: 'home-decor',
    title: 'Home Decor',
    subtitle: 'Rugs, Lights, Wall Art & More',
    imageSrc: '/banners/card-decor.jpg',
    link: '/furniture?category=decor',
  },
];

export default function HeroBanner() {
  return (
    <section className="w-full bg-[#FDFDFD] border-b border-[#E2EBF2] select-none">
      {/* 
        1. Main Hero Canvas matching user's visual reference:
        - Breadcrumb eyebrow: FURNITURE / HOME APPLIANCES / HOME ESSENTIALS
        - Headline: "Your Home. Better Every Day." with Kochuvila Electric Blue (#0097F3)
        - Sub-description & Dual CTA buttons: "Shop Now →" & "Explore Collections"
        - Right-side high-res luxury living room + smart appliances image seamlessly blending into off-white background
      */}
      <div className="relative w-full min-h-[520px] sm:min-h-[580px] lg:h-[620px] xl:h-[660px] overflow-hidden bg-[#FDFDFD] flex items-center">
        {/* Background Architectural Living Room & Kitchen Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/banners/hero-kochuvila-home.jpg"
            alt="Kochuvila Luxury Modern Living Room and Kitchen"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-right lg:object-center select-none"
          />

          {/* Soft Left-to-Right Blending Gradient to Guarantee Perfect Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD]/90 sm:via-[#FDFDFD]/75 lg:via-[#FDFDFD]/30 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 animate-fade-in">
            {/* Category Breadcrumbs Eyebrow in Kochuvila Deep Blue */}
            <div className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#017ED0]">
              <span>Furniture</span>
              <span className="text-[#9FD8F1]">/</span>
              <span>Home Appliances</span>
              <span className="text-[#9FD8F1]">/</span>
              <span>Home Essentials</span>
            </div>

            {/* Headline with Kochuvila Color Accent */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.08] text-[#000000]">
              Your Home.{' '}
              <span className="text-[#0097F3] block sm:inline">
                Better Every Day.
              </span>
            </h1>

            {/* Sub-headline description */}
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg font-medium">
              Stylish furniture, modern appliances and premium home essentials — everything you need to create a home you'll love.
            </p>

            {/* CTA Buttons in Kochuvila Palette */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-full bg-[#06121E] hover:bg-[#0097F3] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:scale-102 active:scale-98 cursor-pointer group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/furniture"
                className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-full bg-white/80 hover:bg-[#EBF6FC] text-[#0F172A] hover:text-[#0097F3] border border-[#CBD5E1] hover:border-[#9FD8F1] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-102 active:scale-98 backdrop-blur-xs cursor-pointer shadow-2xs"
              >
                <span>Explore Collections</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 
        2. Trust Bar (3 Pillars) matching reference image:
        - Free & Fast Delivery (To your doorstep)
        - Quality Assured (Trusted brands & warranty)
        - Dedicated Support (We're here to help)
      */}
      <div className="border-t border-[#E2EBF2] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E2EBF2]">
            {/* Trust 1: Delivery */}
            <div className="flex items-center justify-start md:justify-center gap-3.5 px-4 pt-3 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#000000]">
                  Free &amp; Fast Delivery
                </h4>
                <p className="text-[11px] sm:text-xs text-[#64748B]">
                  To your doorstep
                </p>
              </div>
            </div>

            {/* Trust 2: Warranty */}
            <div className="flex items-center justify-start md:justify-center gap-3.5 px-4 pt-3 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#000000]">
                  Quality Assured
                </h4>
                <p className="text-[11px] sm:text-xs text-[#64748B]">
                  Trusted brands &amp; warranty
                </p>
              </div>
            </div>

            {/* Trust 3: Support */}
            <div className="flex items-center justify-start md:justify-center gap-3.5 px-4 pt-3 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#EBF6FC] flex items-center justify-center text-[#0097F3] flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#000000]">
                  Dedicated Support
                </h4>
                <p className="text-[11px] sm:text-xs text-[#64748B]">
                  We're here to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. 5 Curated Category Cards matching reference image:
        - Living Room, Bedroom, Kitchen Appliances, Laundry Appliances, Home Decor
      */}
      <div className="border-t border-[#E2EBF2] bg-[#FDFDFD] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {CATEGORY_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.link}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block cursor-pointer border border-[#E2EBF2] hover:border-[#0097F3]"
              >
                {/* Background Category Image */}
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 select-none"
                />

                {/* Bottom Contrast Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Card Content & Action Button */}
                <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 pr-1">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white font-display leading-tight truncate drop-shadow-xs">
                        {card.title}
                      </h3>
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
