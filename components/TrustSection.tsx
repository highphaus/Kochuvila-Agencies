import React from 'react';
import { ShieldCheck, Lock, Headphones } from 'lucide-react';

export default function TrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Quality Products',
      description: 'Guaranteed & genuine products',
    },
    {
      icon: Lock,
      title: 'Secure Shopping',
      description: 'Your data is always safe',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: "We're here to help",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-[#FDFDFD] border-b border-[#E2EBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 sm:gap-5 p-4 rounded-xl border border-[#E2EBF2] bg-[#EBF6FC]/40 hover:bg-[#EBF6FC]/70 transition-all shadow-xs"
              >
                <div className="w-12 h-12 rounded-full border border-[#9FD8F1] bg-[#EBF6FC] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#0097F3]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#000000] font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
