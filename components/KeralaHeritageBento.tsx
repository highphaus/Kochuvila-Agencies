'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Truck,
  Sparkles,
  CheckCircle2,
  TreePine,
  Wind,
  Store,
  ArrowRight,
  Headphones,
} from 'lucide-react';

export default function KeralaHeritageBento() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>The Kochuvila Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
            Why Kerala Homes Choose Kochuvila
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            For decades, Kerala families have relied on our combination of genuine brand electronics and generational hardwood craftsmanship.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5">
          {/* Card 1: 100% Solid Teakwood (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#FAF8F5] to-[#F3EEEA] rounded-3xl p-7 border border-[#E7DFD5] relative overflow-hidden group shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center border border-amber-200">
                <TreePine className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Seasoned Malabar Hardwood
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                  100% Solid Teakwood Built For Kerala Monsoon
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Unlike modern particle board that deteriorates in humid Kerala coastal weather, our furniture uses kiln-dried genuine teakwood. Zero swelling, pest-resistant, and built to last generations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Kiln-dried moisture control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Natural termite resistance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Generational heirlooms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free carpentry assembly</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/products?category=furniture"
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 hover:text-amber-700 uppercase tracking-wider group/link"
              >
                <span>Browse Handcrafted Teak Collections</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Tropical Climate Electronics (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#EBF7FC] to-[#DDF1FB] rounded-3xl p-7 border border-brand-lightBlue relative overflow-hidden group shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white text-brand-primary flex items-center justify-center border border-brand-lightBlue/60 shadow-xs">
                <Wind className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-deepBlue bg-brand-lightBlue/50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Tropical Coastal Engineering
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                  100% Copper Condensers & Surge Protection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Kerala homes experience heavy sea breezes, humidity, and monsoon voltage surges. We curate only appliances with 100% pure copper coils and wide-voltage stabilizer-free operations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>100% Pure Copper Coils</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>Anti-corrosion coating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>Stabilizer-free operation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>10-Yr compressor guarantee</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/products?category=appliances"
                className="inline-flex items-center gap-1.5 text-xs font-black text-brand-deepBlue hover:text-brand-primary uppercase tracking-wider group/link"
              >
                <span>Shop Inverter Appliances</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: 14 Districts Doorstep Transit (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-brand-border shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center border border-brand-lightBlue/60">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-black font-display uppercase tracking-tight">
                Dedicated Kerala Transit Fleet
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Air-cushioned delivery trucks safely deliver 65" 4K TVs and 6-seater solid wood dining tables right to your living room across all 14 Kerala districts.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-brand-primary">
              Thiruvananthapuram to Kasaragod
            </div>
          </div>

          {/* Card 4: Authorized Direct Brand Warranties (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-brand-border shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center border border-brand-lightBlue/60">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-black font-display uppercase tracking-tight">
                Direct Dealership Guarantee
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% genuine retail units with authorized serial numbers directly registered with LG, Samsung, Sony, Daikin, and Bosch for prompt in-home service.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Official Brand Warranty Included
            </div>
          </div>

          {/* Card 5: Physical Showroom Verification (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-brand-border shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-lightBlueSoft text-brand-primary flex items-center justify-center border border-brand-lightBlue/60">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-black font-display uppercase tracking-tight">
                Visit Our 25,000 Sq.Ft Showroom
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Touch the seasoned teakwood grains, hear the Dolby Atmos soundbars, and inspect refrigerator capacities in person before making your decision.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-brand-primary">
              Open 7 Days a Week • Live Demonstrations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
