'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Tv,
  Refrigerator,
  Wind,
  Armchair,
  BedDouble,
  Utensils,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface Recommendation {
  id: string;
  name: string;
  category: string;
  tag: string;
  badge: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  link: string;
  highlights: string[];
}

const RECOMMENDATIONS_DATA: Record<string, Recommendation[]> = {
  living: [
    {
      id: 'rec-1',
      name: 'Royal Heritage 3+1+1 Solid Teakwood Living Sofa Set',
      category: 'Furniture • Living Room',
      tag: 'Best for Kerala Homes',
      badge: '100% Solid Teak',
      price: 48500,
      originalPrice: 68000,
      discountPercentage: 28,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=furniture&subcategory=sofas',
      highlights: ['Kiln-dried Malabar teak', 'High-density foam', 'Washable fabric'],
    },
    {
      id: 'rec-2',
      name: 'Sony Bravia 55" 4K Google Smart LED TV',
      category: 'Appliances • Televisions',
      tag: 'Cinematic Living Experience',
      badge: '4K Ultra HD',
      price: 54990,
      originalPrice: 79900,
      discountPercentage: 31,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=appliances&subcategory=televisions',
      highlights: ['Dolby Vision & Atmos', 'Google TV OS', '3-Year Panel Warranty'],
    },
    {
      id: 'rec-3',
      name: 'Modern Teak Wood Entertainment Media Console Table',
      category: 'Furniture • Living Room',
      tag: 'Cable Managed Design',
      badge: 'Handcrafted',
      price: 18900,
      originalPrice: 24900,
      discountPercentage: 24,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=furniture',
      highlights: ['Solid brass handles', 'Ample storage', 'Scratch-resistant finish'],
    },
  ],
  bedroom: [
    {
      id: 'rec-4',
      name: 'Grand Teak Hydraulic Storage King Size Bed',
      category: 'Furniture • Bedroom',
      tag: 'Maximum Storage',
      badge: 'German Gas Lifts',
      price: 44500,
      originalPrice: 59900,
      discountPercentage: 25,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=furniture&subcategory=beds',
      highlights: ['1200L underbed space', 'Padded headboard', 'Solid teak frame'],
    },
    {
      id: 'rec-5',
      name: 'Daikin 1.5 Ton 5-Star Inverter Split AC',
      category: 'Appliances • Air Conditioners',
      tag: 'Whisper-Quiet Night Mode',
      badge: '5★ Energy Saver',
      price: 37990,
      originalPrice: 52000,
      discountPercentage: 27,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=appliances&subcategory=air-conditioners',
      highlights: ['100% Copper condenser', 'PM 2.5 air filter', 'Cools at 54°C'],
    },
    {
      id: 'rec-6',
      name: 'Orthopedic 3-Layer Bonded Foam King Mattress',
      category: 'Furniture • Mattress',
      tag: 'Doctor Recommended',
      badge: '10-Yr Guarantee',
      price: 19990,
      originalPrice: 28500,
      discountPercentage: 29,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=furniture&subcategory=beds',
      highlights: ['Spinal alignment', 'Breathable fabric', 'Zero partner disturbance'],
    },
  ],
  kitchen: [
    {
      id: 'rec-7',
      name: 'LG 655L Frost-Free Side-by-Side Smart Inverter Refrigerator',
      category: 'Appliances • Refrigerators',
      tag: 'Spacious Multi-Air Flow',
      badge: 'Smart Inverter',
      price: 74990,
      originalPrice: 98990,
      discountPercentage: 24,
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=appliances&subcategory=refrigerators',
      highlights: ['Door cooling+ technology', 'Express freeze', '10-Year compressor warranty'],
    },
    {
      id: 'rec-8',
      name: 'Bosch 8 kg 5-Star Fully-Automatic Front Load Washer',
      category: 'Appliances • Washing Machines',
      tag: 'German Engineering',
      badge: 'EcoSilence Drive',
      price: 38990,
      originalPrice: 52990,
      discountPercentage: 26,
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=appliances&subcategory=washing-machines',
      highlights: ['Anti-tangle program', 'ActiveWater Plus', 'Built-in water heater'],
    },
    {
      id: 'rec-9',
      name: 'Handcrafted Teak 6-Seater Family Dining Table Suite',
      category: 'Furniture • Dining',
      tag: 'Generational Heirloom',
      badge: 'Solid Hardwood',
      price: 34990,
      originalPrice: 47900,
      discountPercentage: 26,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=furniture&subcategory=dining',
      highlights: ['Includes 6 cushioned chairs', 'Heat-resistant top', 'Zero wobbling guarantee'],
    },
  ],
};

const ROOM_OPTIONS = [
  { id: 'living', name: 'Living Room', icon: Armchair, subtitle: 'Sofa sets, 4K TVs & Media Units' },
  { id: 'bedroom', name: 'Master Suite', icon: BedDouble, subtitle: 'Hydraulic beds, ACs & Mattresses' },
  { id: 'kitchen', name: 'Kitchen & Dining', icon: Utensils, subtitle: 'Refrigerators, Washers & Dining Sets' },
];

export default function HomeStylistFinder() {
  const [activeRoom, setActiveRoom] = useState<'living' | 'bedroom' | 'kitchen'>('living');
  const [budgetTier, setBudgetTier] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');

  const rawList = RECOMMENDATIONS_DATA[activeRoom] || [];

  const filteredList = rawList.filter((item) => {
    if (budgetTier === 'all') return true;
    if (budgetTier === 'budget') return item.price <= 25000;
    if (budgetTier === 'mid') return item.price > 25000 && item.price <= 50000;
    if (budgetTier === 'luxury') return item.price > 50000;
    return true;
  });

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-brand-lightBlueSoft/30 to-[#F5F7F9] border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue mb-2">
              <Compass className="w-3.5 h-3.5 text-brand-primary" />
              <span>Smart Home Stylist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Find The Perfect Match For Your Space
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Tell us which room you are furnishing or upgrading. Explore curated appliances and handcrafted furniture designed to work together seamlessly.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-deepBlue transition-colors group self-start md:self-auto"
          >
            <span>View Complete Store Catalog</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Room Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {ROOM_OPTIONS.map((room) => {
            const Icon = room.icon;
            const isSelected = activeRoom === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id as 'living' | 'bedroom' | 'kitchen')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-white border-brand-primary shadow-card ring-2 ring-brand-primary/10'
                    : 'bg-white/70 hover:bg-white border-brand-border hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-brand-lightBlueSoft text-brand-deepBlue'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-black tracking-tight ${isSelected ? 'text-black' : 'text-slate-800'}`}>
                    {room.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{room.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Budget Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-primary" />
              Budget:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Budgets' },
                { id: 'budget', label: 'Under ₹25,000' },
                { id: 'mid', label: '₹25,000 – ₹50,000' },
                { id: 'luxury', label: 'Above ₹50,000' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBudgetTier(tier.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    budgetTier === tier.id
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-black border border-brand-border'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-black">{filteredList.length}</span> curated matches
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-brand-border hover:border-brand-primary transition-all duration-300 overflow-hidden shadow-card hover:shadow-cardHover flex flex-col justify-between group"
            >
              <div>
                {/* Image & Tags */}
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {item.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold">
                      {item.discountPercentage}% OFF
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-brand-deepBlue text-[11px] font-black shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    {item.category}
                  </span>

                  <h3 className="font-black text-sm sm:text-base text-black group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-lg font-black text-black">
                      {formatINR(item.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      {formatINR(item.originalPrice)}
                    </span>
                  </div>

                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-lightBlueSoft hover:bg-brand-primary text-brand-deepBlue hover:text-white text-xs font-bold transition-all group/btn"
                  >
                    <span>View Deal</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
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
