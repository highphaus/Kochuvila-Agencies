'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  ShieldCheck,
  Truck,
  Coffee,
  ExternalLink,
  X,
  Compass,
  Check,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

interface BranchInfo {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  address: string;
  landmark: string;
  hoursWeekday: string;
  hoursSunday: string;
  primaryPhone: string;
  displayPhone: string;
  secondaryPhone: string;
  mapsUrl: string;
  distanceHighlights: { place: string; time: string }[];
  exteriorImage: string;
}

export default function ShowroomExperience() {
  const [activeZone, setActiveZone] = useState<number>(0);
  const [selectedBranch, setSelectedBranch] = useState<'pangode' | 'kallara'>('pangode');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('morning');
  const [bookingZone, setBookingZone] = useState<string>('All Showroom Zones');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  // Live Kerala Time Store Open Status calculation
  const [storeStatus, setStoreStatus] = useState<{ isOpen: boolean; message: string }>({
    isOpen: true,
    message: 'Open Today • Closes at 9:00 PM',
  });

  useEffect(() => {
    const checkOpenStatus = () => {
      // Calculate current IST (UTC+5:30)
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);

      const day = istDate.getDay(); // 0 is Sunday
      const hour = istDate.getHours();
      const minute = istDate.getMinutes();
      const currentTime = hour + minute / 60;

      if (day === 0) {
        // Sunday: 9:00 AM - 8:00 PM
        if (currentTime >= 9 && currentTime < 20) {
          setStoreStatus({ isOpen: true, message: 'Open Today • Closes at 8:00 PM (IST)' });
        } else if (currentTime < 9) {
          setStoreStatus({ isOpen: false, message: 'Opens Today at 9:00 AM (IST)' });
        } else {
          setStoreStatus({ isOpen: false, message: 'Closed for the day • Opens Monday at 8:30 AM' });
        }
      } else {
        // Mon-Sat: 8:30 AM - 9:00 PM
        if (currentTime >= 8.5 && currentTime < 21) {
          setStoreStatus({ isOpen: true, message: 'Open Today • Closes at 9:00 PM (IST)' });
        } else if (currentTime < 8.5) {
          setStoreStatus({ isOpen: false, message: 'Opens Today at 8:30 AM (IST)' });
        } else {
          setStoreStatus({ isOpen: false, message: 'Closed for the night • Opens Tomorrow at 8:30 AM' });
        }
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const branches: Record<'pangode' | 'kallara', BranchInfo> = useMemo(
    () => ({
      pangode: {
        id: 'pangode',
        name: 'Pangode Flagship Showroom',
        badge: 'Main 25,000+ Sq.Ft. Experience Centre',
        tagline: 'Full Experience: 4K Home Theatre, Solid Teak Lounge & Smart Kitchens',
        address: 'Near Pangode Junction, Pangode – Bharathanoor Road, Pangode P.O., Trivandrum – 695609',
        landmark: '2 mins from Pangode Central Junction, Bharathanoor Main Rd',
        hoursWeekday: 'Monday to Saturday: 8:30 AM – 9:00 PM',
        hoursSunday: 'Sunday: 9:00 AM – 8:00 PM',
        primaryPhone: '+919745111141',
        displayPhone: '+91 97451 11141',
        secondaryPhone: '+91 99722 23065',
        mapsUrl: 'https://share.google/q4d6GZbN1tKeH5T91',
        exteriorImage: '/banners/hero-living.jpg',
        distanceHighlights: [
          { place: 'Pangode Junction', time: '2 mins' },
          { place: 'Nedumangad Town', time: '18 mins' },
          { place: 'Venjaramoodu', time: '22 mins' },
          { place: 'Trivandrum City (East Fort)', time: '40 mins' },
        ],
      },
      kallara: {
        id: 'kallara',
        name: 'Kallara City Branch',
        badge: 'Town Appliance & Furniture Hub',
        tagline: 'Quick shopping for top brands in TV, AC, Refrigeration & Home Essentials',
        address: 'Main Road, Kallara, Trivandrum – 695608',
        landmark: 'Opposite State Bank, Main Market Road, Kallara',
        hoursWeekday: 'Monday to Saturday: 9:00 AM – 8:30 PM',
        hoursSunday: 'Sunday: 9:30 AM – 7:30 PM',
        primaryPhone: '+919972223065',
        displayPhone: '+91 99722 23065',
        secondaryPhone: '+91 97451 11141',
        mapsUrl: 'https://maps.google.com/?q=Kochuvila+Agencies+Kallara+Trivandrum',
        exteriorImage: '/banners/hero-kochuvila-home.jpg',
        distanceHighlights: [
          { place: 'Kallara Market Junction', time: '1 min' },
          { place: 'Kilimanoor', time: '14 mins' },
          { place: 'Venjaramoodu', time: '15 mins' },
          { place: 'Attingal Bypass', time: '20 mins' },
        ],
      },
    }),
    []
  );

  const activeBranch = branches[selectedBranch];

  const showroomZones = [
    {
      title: '4K Home Theatre & Audio Studio',
      badge: 'Live AV Demos',
      desc: 'Experience Sony Bravia, LG OLED, and Dolby Atmos audio setups in a real living room acoustic environment.',
      image: '/banners/hero-entertainment.jpg',
      icon: Tv,
      brandBadges: ['Sony Bravia XR', 'LG OLED evo', 'Samsung Neo QLED', 'Dolby Atmos 7.1.4'],
      features: [
        'Side-by-side OLED true-black vs Mini-LED brightness comparison shootout',
        'Dolby Atmos spatial surround demonstration in sound-treated acoustics',
        '120Hz/144Hz PS5 & high-end console gaming station test bench',
        'Free acoustic consultation with in-house AV calibration specialists',
      ],
      tag: 'Live Demonstrations Everyday',
    },
    {
      title: 'Solid Teak Furniture Lounge',
      badge: 'Hardwood Touch Lab',
      desc: 'Inspect genuine seasoned Malabar teak sofas, hydraulic beds, and dining suites. Touch the grain finishes firsthand.',
      image: '/banners/portrait-furniture.jpg',
      icon: Armchair,
      brandBadges: ['100% Solid Malabar Teak', 'Pneumatic Hydraulic Beds', 'Bespoke Carpentry'],
      features: [
        'Live wood grain, density, and seasoned moisture verification',
        'Smooth pneumatic hydraulic bed lifts with effortless one-hand test',
        'Fabric Swatch Bar: 150+ stain-resistant linens, velvets & genuine leathers',
        'Custom furniture dimensioning & polish matching to your home floor plan',
      ],
      tag: 'Lifetime Timber Authenticity',
    },
    {
      title: 'Smart Cooling & Kitchen Gallery',
      badge: 'Live Appliance Floor',
      desc: 'Test multi-door refrigerator interior capacities, inverter cooling whisper levels, and front-load washer cycles.',
      image: '/banners/promo-appliances.jpg',
      icon: Volume2,
      brandBadges: ['French Door Refrigerators', 'Whisper Inverter Tech', 'Gesture Hob & Chimneys'],
      features: [
        'Explore 4-door convertible French door refrigerators & flexible chilling zones',
        'Live decibel meter test: Experience whisper-quiet inverter compressors',
        'Heavy smoke suction demonstrations on motion-sensor auto-clean chimneys',
        'AI front-load washing machines live spin & low-vibration balance demo',
      ],
      tag: 'Working Live Power Station',
    },
    {
      title: 'Ergonomic Sleep & Mattress Studio',
      badge: 'Sleep Science Hub',
      desc: 'Test authentic orthopedic pocket spring, memory foam, and 100% natural Kerala latex mattresses before buying.',
      image: '/banners/portrait-bedroom.jpg',
      icon: Sparkles,
      brandBadges: ['Zero Partner Disturbance', '100% Natural Kerala Latex', '10-Year Sag Warranty'],
      features: [
        'Zero-motion transfer pocket spring test with weighted balance',
        '100% natural certified Kerala latex for cooler, ergonomic spine alignment',
        'Motorized zero-gravity luxury recliners with multi-zone lumbar adjustments',
        'Custom length & thickness sizing to fit any heirloom teak bed frame',
      ],
      tag: 'Private Sleep Trial Area',
    },
  ];

  const showroomAmenities = [
    {
      icon: Car,
      title: 'Free Valet Parking',
      subtitle: 'Spacious shaded private parking lot with valet support at the main entrance',
      badge: 'Zero Hassle',
    },
    {
      icon: CheckCircle2,
      title: '0% Paperless EMI',
      subtitle: 'Instant 5-minute approval with Bajaj Finserv, HDFC Bank, TVS & Pine Labs',
      badge: 'Zero Interest',
    },
    {
      icon: Volume2,
      title: 'Live AV Demos',
      subtitle: 'Acoustically tuned sound rooms to test real bass, dialogue clarity & OLED contrast',
      badge: 'Sound Studio',
    },
    {
      icon: Armchair,
      title: 'Teak Customization',
      subtitle: 'Custom furniture design, timber grade selection & tailored upholstery fabrics',
      badge: 'Custom Made',
    },
    {
      icon: Truck,
      title: 'Trivandrum Showroom Delivery',
      subtitle: 'Safe, prompt transport straight to your doorstep with trained unboxing crew',
      badge: 'Safe Transit',
    },
    {
      icon: Coffee,
      title: 'VIP Consultation Desk',
      subtitle: 'Relax in our air-conditioned lounge with complimentary tea & interior advisors',
      badge: 'Warm Kerala Hospitality',
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = activeBranch.primaryPhone.replace(/\D/g, '');
    const message = `Hello Kochuvila Agencies (${activeBranch.name}),%0A%0AI would like to schedule a Showroom VIP Consultation:%0A• *Name:* ${encodeURIComponent(customerName || 'Customer')}%0A• *Phone:* ${encodeURIComponent(customerPhone || 'Provided')}%0A• *Preferred Date:* ${encodeURIComponent(bookingDate || 'Flexible')}%0A• *Preferred Slot:* ${encodeURIComponent(bookingTime.toUpperCase())}%0A• *Zone of Interest:* ${encodeURIComponent(bookingZone)}%0A• *Showroom:* ${encodeURIComponent(activeBranch.name)}%0A%0APlease confirm the appointment with a senior advisor.`;

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setBookingSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setBookingSubmitted(false);
    }, 2500);
  };

  const handleQuickWhatsApp = () => {
    const phone = activeBranch.primaryPhone.replace(/\D/g, '');
    const text = `Hello Kochuvila Agencies! I would like to visit your ${activeBranch.name} to see the ${showroomZones[activeZone].title}. Please share directions and advisor availability.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="showroom-experience" className="py-12 sm:py-20 bg-[#F4F7FB] border-b border-brand-border/80 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0097F3]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#017ED0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Experience Master Card */}
        <div className="bg-white rounded-3xl border border-brand-border/90 p-5 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="space-y-3 max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                <span>Physical Retail Experience</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span className="text-[11px] text-slate-600 font-semibold lowercase">est. 1980s</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-display uppercase tracking-tight leading-tight">
                Experience Kochuvila In Person
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Connect online convenience with offline trust. Visit our expansive 25,000+ sq.ft. Kerala showroom to touch authentic teakwood textures, experience live 4K OLED HDR displays, and consult with our senior home advisors.
              </p>
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 w-full lg:w-auto flex-shrink-0">
              <div className="p-3.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center hover:border-brand-lightBlue transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-brand-deepBlue">25,000+</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Sq.Ft. Display</span>
              </div>
              <div className="p-3.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center hover:border-brand-lightBlue transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-brand-deepBlue">40+ Yrs</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Kerala Trust</span>
              </div>
              <div className="p-3.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center hover:border-brand-lightBlue transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-brand-deepBlue">500+</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Live Demos</span>
              </div>
              <div className="p-3.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center hover:border-brand-lightBlue transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-brand-deepBlue">100%</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Genuine Teak</span>
              </div>
            </div>
          </div>

          {/* BRANCH SELECTION TABS */}
          <div className="pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                Select Showroom Branch:
              </span>
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setSelectedBranch('pangode')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    selectedBranch === 'pangode'
                      ? 'bg-white text-black shadow-sm border border-slate-200/90'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedBranch === 'pangode' ? 'bg-brand-primary' : 'bg-slate-300'}`} />
                  <span>Pangode (Flagship 25,000 sq.ft.)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBranch('kallara')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    selectedBranch === 'kallara'
                      ? 'bg-white text-black shadow-sm border border-slate-200/90'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedBranch === 'kallara' ? 'bg-brand-primary' : 'bg-slate-300'}`} />
                  <span>Kallara (City Branch)</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            
            {/* LEFT COLUMN: INTERACTIVE EXPERIENCE ZONES (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Zone Selector Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                    Showroom Experience Zones:
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Step inside & test live
                  </span>
                </div>

                {/* Zone Tab Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {showroomZones.map((zone, idx) => {
                    const IconComponent = zone.icon;
                    const isActive = activeZone === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveZone(idx)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                          isActive
                            ? 'bg-brand-lightBlueSoft border-brand-primary ring-2 ring-brand-primary/20 shadow-sm'
                            : 'bg-[#F8FAFC] hover:bg-slate-100 border-slate-200/90'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <IconComponent className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-700'}`} />
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                        </div>
                        <div>
                          <span className={`text-[10px] font-black uppercase tracking-wider block line-clamp-1 ${
                            isActive ? 'text-brand-deepBlue' : 'text-slate-500'
                          }`}>
                            {zone.badge}
                          </span>
                          <p className={`text-xs font-bold line-clamp-2 mt-0.5 leading-snug ${
                            isActive ? 'text-black' : 'text-slate-700'
                          }`}>
                            {zone.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE ZONE SHOWCASE CARD */}
              <div className="rounded-2xl border border-brand-border/90 bg-white overflow-hidden shadow-sm group">
                {/* Zone Photo with Gradient & Overlay Badges */}
                <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showroomZones[activeZone].image}
                    alt={showroomZones[activeZone].title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-brand-primary text-white px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {showroomZones[activeZone].badge}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/20">
                      {showroomZones[activeZone].tag}
                    </span>
                  </div>

                  {/* Bottom Text in Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight drop-shadow-sm">
                      {showroomZones[activeZone].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 leading-relaxed drop-shadow-sm">
                      {showroomZones[activeZone].desc}
                    </p>
                  </div>
                </div>

                {/* Zone In-Store Demos Checklist */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-white to-[#F8FAFC] border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      What You Can Test Live in Showroom:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {showroomZones[activeZone].brandBadges.map((brand, bIdx) => (
                        <span key={bIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {showroomZones[activeZone].features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SHOWROOM AMENITIES CHECKLIST */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Showroom Guest Amenities:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {showroomAmenities.map((amenity, idx) => {
                    const AmenityIcon = amenity.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-slate-200/80 transition-all duration-200 shadow-2xs group flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-lightBlueSoft flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            <AmenityIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wide text-brand-deepBlue bg-brand-lightBlueSoft/60 px-1.5 py-0.5 rounded">
                            {amenity.badge}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                            {amenity.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {amenity.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CALL TO ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Google Maps Directions Button */}
                <a
                  href={activeBranch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {/* Direct Phone Dial */}
                <a
                  href={`tel:${activeBranch.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-brand-lightBlueSoft text-black border-2 border-brand-primary/80 hover:border-brand-primary rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span>Call: {activeBranch.displayPhone}</span>
                </a>

                {/* VIP Consultation Appointment Modal Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ml-auto"
                >
                  <Calendar className="w-4 h-4 text-brand-lightBlue" />
                  <span>Schedule VIP Visit</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: STORE INFORMATION, TIMINGS & CONSULTATION (5 COLS) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#017ED0] via-[#0168AC] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Decorative Subtle Accent Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                    Store Status & Hours
                  </h3>
                  <p className="text-[11px] text-blue-100 font-medium">
                    {activeBranch.name}
                  </p>
                </div>
                
                {/* Live Open/Closed Status */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border ${
                    storeStatus.isOpen
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
                      : 'bg-amber-500/30 text-amber-100 border-amber-400/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>{storeStatus.isOpen ? 'Open Now' : 'Closed'}</span>
                </span>
              </div>

              {/* Showroom Photo Card */}
              <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-white/20 shadow-inner group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeBranch.exteriorImage}
                  alt={`${activeBranch.name} Exterior`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-lightBlue">
                    {activeBranch.badge}
                  </span>
                  <span className="text-xs font-bold text-white leading-tight">
                    {activeBranch.tagline}
                  </span>
                </div>
              </div>

              {/* Information Rows */}
              <div className="space-y-4 text-xs text-brand-lightBlue">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Flagship Address:</p>
                    <p className="text-slate-200 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                      {activeBranch.address}
                    </p>
                    <p className="text-[11px] text-blue-200 font-semibold mt-1 flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      Landmark: {activeBranch.landmark}
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Operating Hours (IST):</p>
                    <p className="text-slate-200 mt-0.5 text-[11px] sm:text-xs">
                      {activeBranch.hoursWeekday}
                    </p>
                    <p className="text-slate-200 text-[11px] sm:text-xs">
                      {activeBranch.hoursSunday}
                    </p>
                    <p className="text-[10px] text-emerald-200 font-semibold mt-0.5">
                      • {storeStatus.message}
                    </p>
                  </div>
                </div>

                {/* Helpline & WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Helplines & Enquiries:</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <a href={`tel:${activeBranch.primaryPhone}`} className="text-white hover:underline font-bold">
                        {activeBranch.displayPhone}
                      </a>
                      <span className="text-blue-300">/</span>
                      <a href={`tel:${activeBranch.secondaryPhone}`} className="text-slate-200 hover:underline">
                        {activeBranch.secondaryPhone}
                      </a>
                    </div>
                    <p className="text-[11px] text-blue-200">kochuvilapgd1141@gmail.com</p>
                  </div>
                </div>

                {/* Travel Distance Bar */}
                <div className="pt-2 border-t border-white/15">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-200 mb-2">
                    Estimated Drive Times to Showroom:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeBranch.distanceHighlights.map((dist, dIdx) => (
                      <div key={dIdx} className="bg-white/10 rounded-xl px-2.5 py-1.5 text-[11px] flex items-center justify-between">
                        <span className="text-slate-200 truncate pr-1">{dist.place}</span>
                        <span className="text-white font-bold flex-shrink-0">{dist.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* WhatsApp Consultation Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleQuickWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book Showroom Consultation via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE VIP VISIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-border relative space-y-5">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                VIP Experience Pass
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-black font-display uppercase tracking-tight">
                Schedule a Private Walkthrough
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Receive 1-on-1 guidance from a senior home consultant with reserved parking & live demos.
              </p>
            </div>

            {bookingSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">VIP Request Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Connecting to WhatsApp with your reservation details. Our showroom concierge will confirm your slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                {/* Branch Selection */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Showroom</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as 'pangode' | 'kallara')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="pangode">Pangode Flagship Showroom (25,000+ sq.ft.)</option>
                    <option value="kallara">Kallara City Branch</option>
                  </select>
                </div>

                {/* Primary Zone of Interest */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Area of Interest</label>
                  <select
                    value={bookingZone}
                    onChange={(e) => setBookingZone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="All Showroom Zones">Entire Showroom Tour (Electronics + Teak Furniture)</option>
                    <option value="4K Home Theatre & Audio Studio">4K Home Theatre & Dolby Atmos Studio</option>
                    <option value="Solid Teak Furniture Lounge">Solid Teakwood Sofas, Beds & Dining</option>
                    <option value="Smart Kitchen & Cooling Gallery">Refrigerators, ACs & Kitchen Appliances</option>
                    <option value="Ergonomic Sleep & Mattress Studio">Mattresses & Ergonomic Recliners</option>
                  </select>
                </div>

                {/* Preferred Date & Time Slot */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                      <option value="afternoon">Afternoon (1:00 PM – 4:30 PM)</option>
                      <option value="evening">Evening (4:30 PM – 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sreekumar Nair"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 98470 XXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Confirm VIP Slot via WhatsApp Concierge</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    Free booking • No obligation • Complimentary beverage & advisor reserved
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
