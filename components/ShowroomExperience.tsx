'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  Sparkles,
  Navigation,
  CheckCircle2,
  MessageSquare,
  Car,
  Tv,
  Armchair,
  Volume2,
  Calendar,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function ShowroomExperience() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const [activeExperience, setActiveExperience] = useState<number>(0);

  const showroomZones = [
    {
      title: '4K Home Theatre & Audio Studio',
      desc: 'Experience Sony Bravia, LG OLED, and Dolby Atmos audio setups in a real living room acoustic environment.',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      badge: 'Live AV Demos',
    },
    {
      title: 'Solid Teak Furniture Lounge',
      desc: 'Inspect genuine seasoned Malabar teak sofas, hydraulic beds, and dining suites. Touch the grain finishes firsthand.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      badge: 'Hardwood Touch Lab',
    },
    {
      title: 'Smart Cooling & Kitchen Gallery',
      desc: 'Test multi-door refrigerator interior capacities, inverter cooling whisper levels, and front-load washer cycles.',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      badge: 'Live Appliance Floor',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F5F7F9] border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Showroom Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                <span>Physical Retail Experience</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
                  Experience Kochuvila In Person
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Connect online convenience with offline trust. Visit our expansive 25,000+ sq.ft. Kerala showroom to touch authentic teakwood textures, experience live 4K OLED HDR displays, and consult with our senior home advisors.
                </p>
              </div>

              {/* Experience Zones Switcher */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Showroom Experience Zones:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {showroomZones.map((zone, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveExperience(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                        activeExperience === idx
                          ? 'bg-brand-lightBlueSoft border-brand-primary ring-2 ring-brand-primary/10 shadow-2xs'
                          : 'bg-[#F5F7F9] hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase text-brand-primary block line-clamp-1">
                        {zone.badge}
                      </span>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                        {zone.title}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Selected Zone Preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/8] bg-slate-900 border border-brand-border mt-3 shadow-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showroomZones[activeExperience].image}
                    alt={showroomZones[activeExperience].title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary px-2 py-0.5 rounded self-start mb-1 text-white">
                      {showroomZones[activeExperience].badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {showroomZones[activeExperience].title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {showroomZones[activeExperience].desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Showroom Amenities Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F9] border border-slate-200 text-xs font-bold text-slate-800">
                  <Car className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>Free Valet Parking</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F9] border border-slate-200 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>0% Paperless EMI</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F9] border border-slate-200 text-xs font-bold text-slate-800">
                  <Volume2 className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>Live AV Demos</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F7F9] border border-slate-200 text-xs font-bold text-slate-800">
                  <Armchair className="w-4 h-4 text-brand-primary flex-shrink-0" />
                  <span>Teak Customization</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://maps.google.com/?q=Kochuvila+Agencies+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-button transition-all active:scale-98"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS TO SHOWROOM</span>
                </a>

                <a
                  href="tel:+919447023456"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-brand-lightBlueSoft text-black border-2 border-brand-primary rounded-xl text-xs sm:text-sm font-bold transition-all shadow-card"
                >
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span>Call: +91 94470 23456</span>
                </a>
              </div>
            </div>

            {/* Store Information Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#017ED0] via-[#0168AC] to-[#0B1528] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-elevated border border-white/20 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Store Status & Hours
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white font-bold px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Open Today
                </span>
              </div>

              {/* Store Exterior */}
              <div className="w-full h-40 rounded-2xl overflow-hidden relative border border-white/20 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                  alt="Kochuvila Showroom Exterior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Kochuvila Flagship Retail Showroom • Kerala
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-brand-lightBlue">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Flagship Location:</p>
                    <p className="text-slate-200 mt-0.5">
                      Kochuvila Junction, Main Commercial Highway, Kerala, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Operating Hours:</p>
                    <p className="text-slate-200 mt-0.5">
                      Monday to Saturday: 9:30 AM – 8:30 PM
                    </p>
                    <p className="text-slate-200">
                      Sunday: 10:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Helpline & WhatsApp:</p>
                    <p className="text-slate-200 mt-0.5">
                      +91 94470 23456 / contact@kochuvilaagencies.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book Showroom Consultation via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
