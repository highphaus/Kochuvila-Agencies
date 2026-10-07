import React from 'react';
import { ShieldCheck, Award, Headphones, CreditCard, Store } from 'lucide-react';

export default function TrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'GENUINE PRODUCTS',
      description: '100% authentic appliances & furniture sourced directly from authorized manufacturers.',
    },
    {
      icon: Award,
      title: 'BRAND WARRANTY',
      description: 'Official manufacturer brand warranty backed by certified service engineers across Kerala.',
    },
    {
      icon: Headphones,
      title: 'EXPERT ASSISTANCE',
      description: 'Consult our showroom team for sizing, feature comparisons, and live demonstrations.',
    },
    {
      icon: CreditCard,
      title: 'EASY ORDERING',
      description: 'Seamless online ordering, zero-cost EMI options, and flexible Cash on Delivery.',
    },
    {
      icon: Store,
      title: 'STORE SUPPORT',
      description: 'Visit our flagship physical showroom for after-sales assistance, exchange, and guidance.',
    },
  ];

  return (
    /* SECTION 7 — TRUST: Clean trust section (White background, Blue icons, Black headings, Grey text) */
    <section className="py-8 sm:py-10 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 p-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-lightBlueSoft flex items-center justify-center text-brand-primary border border-brand-lightBlue/60">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
