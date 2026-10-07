'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, Flame, Zap, ShieldCheck, ShoppingCart, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, generateWhatsAppEnquiryLink } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import ProductCard from './ProductCard';

interface DealsSectionProps {
  deals: Product[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'appliances' | 'furniture'>('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 34, seconds: 12 });
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!deals || deals.length === 0) return null;

  const spotlightDeal = deals[0];
  const otherDeals = deals.slice(1);

  const filteredDeals = otherDeals.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'appliances')
      return p.category?.toLowerCase().includes('appliance') || p.category?.toLowerCase() === 'appliances';
    if (activeTab === 'furniture')
      return p.category?.toLowerCase().includes('furniture') || p.category?.toLowerCase() === 'furniture';
    return true;
  });

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#017ED0] via-[#0168AC] to-[#05172E] text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-lightBlue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-lightBlue text-xs font-bold tracking-wider uppercase border border-white/20 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-[#9FD9F1] fill-[#9FD9F1]" />
              <span>Limited Festival Promotions</span>
              <span className="text-white/40">•</span>
              <span className="text-white flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-brand-lightBlue" />
                Ends in{' '}
                <span className="font-mono font-bold text-white bg-black/30 px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display uppercase tracking-tight">
              Kochuvila Deals & Flash Offers
            </h2>
            <p className="text-xs sm:text-sm text-brand-lightBlue font-medium max-w-xl">
              Verified manufacturer price drops, seasonal exchange bonuses, and 0% interest EMI options across all Kerala districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/15 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-brand-deepBlue shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                All Deals
              </button>
              <button
                onClick={() => setActiveTab('appliances')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'appliances'
                    ? 'bg-white text-brand-deepBlue shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Appliances
              </button>
              <button
                onClick={() => setActiveTab('furniture')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'furniture'
                    ? 'bg-white text-brand-deepBlue shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Furniture
              </button>
            </div>

            <Link
              href="/products?isDeal=true"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-brand-lightBlueSoft font-bold text-xs sm:text-sm transition-all shadow-md group"
            >
              <span>All Deals</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-deepBlue group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Featured Deal Spotlight & Fast Deals Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Spotlight Left Card (4 cols) */}
          {spotlightDeal && (
            <div className="lg:col-span-4 bg-white/95 text-black rounded-3xl p-6 border border-white/30 shadow-elevated relative overflow-hidden flex flex-col justify-between group">
              <div className="space-y-4">
                {/* Top Spotlight Tag */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                    <Zap className="w-3 h-3 fill-white" />
                    Deal of the Day
                  </span>

                  <span className="text-xs font-black text-brand-deepBlue">
                    {spotlightDeal.discountPercentage}% SAVINGS
                  </span>
                </div>

                {/* Product Image */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={spotlightDeal.images?.[0] || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                    alt={spotlightDeal.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-brand-deepBlue text-white text-[10px] font-bold">
                      {spotlightDeal.brand}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="font-black text-base sm:text-lg text-black line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                    <Link href={`/product/${spotlightDeal.slug}`}>
                      {spotlightDeal.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {spotlightDeal.description}
                  </p>
                </div>

                {/* Urgency Progress Bar */}
                <div className="p-3 bg-brand-lightBlueSoft rounded-xl border border-brand-lightBlue/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-brand-deepBlue flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
                      Limited Stock Available
                    </span>
                    <span className="text-red-600 font-extrabold">Only 4 left!</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-primary to-red-500 rounded-full w-[82%]" />
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-black">
                      {formatINR(spotlightDeal.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      {formatINR(spotlightDeal.mrp)}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save {formatINR(spotlightDeal.mrp - spotlightDeal.price)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => addItem(spotlightDeal, 1)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-bold transition-all shadow-button"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                <a
                  href={generateWhatsAppEnquiryLink(spotlightDeal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Right Product Grid (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredDeals.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
