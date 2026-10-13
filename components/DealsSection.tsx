'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Clock, Flame, Zap, ShieldCheck, ShoppingCart, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, generateWhatsAppEnquiryLink } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import ProductCard from './ProductCard';

interface DealsSectionProps {
  deals: Product[];
}

function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 34, seconds: 12 });

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

  return (
    <span className="font-mono font-bold text-white bg-black/30 px-1.5 py-0.5 rounded text-[11px]" suppressHydrationWarning>
      {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
      {String(timeLeft.seconds).padStart(2, '0')}s
    </span>
  );
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'appliances' | 'furniture'>('all');
  const addItem = useCartStore((state) => state.addItem);

  const spotlightDeal = deals?.[0];
  const otherDeals = useMemo(() => deals?.slice(1) || [], [deals]);

  const filteredDeals = useMemo(() => {
    return otherDeals.filter((p) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'appliances')
        return p.category?.toLowerCase().includes('appliance') || p.category?.toLowerCase() === 'appliances';
      if (activeTab === 'furniture')
        return p.category?.toLowerCase().includes('furniture') || p.category?.toLowerCase() === 'furniture';
      return true;
    });
  }, [otherDeals, activeTab]);

  if (!deals || deals.length === 0) return null;

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
                Ends in <DealCountdown />
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display uppercase tracking-tight">
              Kochuvila Deals &amp; Flash Offers
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-brand-deepBlue shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                All Deals
              </button>
              <button
                onClick={() => setActiveTab('appliances')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'appliances'
                    ? 'bg-white text-brand-deepBlue shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Appliances
              </button>
              <button
                onClick={() => setActiveTab('furniture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'furniture'
                    ? 'bg-white text-brand-deepBlue shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Furniture
              </button>
            </div>

            <Link
              href="/products?isDeal=true"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Spotlight Hero Deal (Large Feature) */}
          {spotlightDeal && (
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Deal of the Week
                  </span>

                  <span className="text-xs font-black text-brand-deepBlue">
                    {spotlightDeal.discountPercentage}% SAVINGS
                  </span>
                </div>

                {/* Product Image */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-100">
                  <Image
                    src={spotlightDeal.images?.[0] || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                    alt={spotlightDeal.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
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

                {/* Pricing & Key Benefits */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        {formatINR(spotlightDeal.price)}
                      </span>
                      {spotlightDeal.mrp > spotlightDeal.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(spotlightDeal.mrp)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                      Save {formatINR(spotlightDeal.mrp - spotlightDeal.price)} with festival bonus
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Warranty</span>
                    <span className="text-xs font-bold text-slate-700">Official Brand Care</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => addItem(spotlightDeal, 1)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold shadow-button transition-all active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <a
                    href={generateWhatsAppEnquiryLink(spotlightDeal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Deal</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Deals */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDeals.slice(0, 6).map((deal) => (
              <ProductCard key={deal._id} product={deal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
