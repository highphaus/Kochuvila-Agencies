import React from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { Award, ArrowRight } from 'lucide-react';

interface BrandShowcaseProps {
  brands: Brand[];
}

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
  return (
    /* SECTION 8 — BRANDS: SHOP BY BRAND */
    <section className="py-8 sm:py-10 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              <Award className="w-3.5 h-3.5 text-brand-primary" />
              <span>Official Retail Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black font-display uppercase tracking-tight">
              Shop By Brand
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Official authorized dealership for leading appliance and home manufacturers. 100% genuine products with manufacturer warranty.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-deepBlue hover:underline group"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {brands.map((b) => {
            const specialties: Record<string, string> = {
              Samsung: '4K QLED TVs & Double Door Fridges',
              LG: 'Direct Drive Washers & French Door Fridges',
              Sony: 'Bravia OLED TVs & Cinematic Audio',
              Bosch: 'German Front-Load Washers & Dishwashers',
              Whirlpool: 'Intellifresh Refrigerators',
              'Royal Teak': 'Solid Teak Sofas, Dining & Beds',
              Nilkamal: 'Ergonomic Living & Study Furniture',
              Daikin: 'Inverter Climate Control & Split ACs',
            };

            const specialty = specialties[b.name] || 'Authorized Showroom Collection';

            return (
              <Link
                key={b._id}
                href={`/products?brand=${encodeURIComponent(b.name)}`}
                className="group p-5 rounded-2xl border border-brand-border hover:border-brand-primary bg-white hover:bg-brand-lightBlueSoft/20 transition-all text-left flex flex-col justify-between shadow-card hover:shadow-cardHover relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-black text-sm sm:text-base text-black group-hover:text-brand-primary transition-colors tracking-wide uppercase">
                    {b.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-deepBlue bg-brand-lightBlueSoft px-2 py-0.5 rounded-full border border-brand-lightBlue/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    Authorized
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 font-normal mb-3">
                  {specialty}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-brand-primary group-hover:text-brand-deepBlue">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
