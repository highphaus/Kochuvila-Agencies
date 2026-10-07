'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, MapPin, Sparkles, Quote, Camera, ThumbsUp } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Dr. Mathew Kurian',
    location: 'Kottayam, Kerala',
    product: 'LG 655L Side-by-Side Refrigerator',
    category: 'Home Appliances',
    comment:
      'Superb experience with Kochuvila Agencies. The delivery team handled the large refrigerator with utmost care, unboxed it, and leveled it in our kitchen. 100% authentic piece with official LG warranty.',
    rating: 5,
    district: 'kottayam',
    date: '2 weeks ago',
  },
  {
    name: 'Suma & Suresh Babu',
    location: 'Kollam, Kerala',
    product: 'Royal Heritage Solid Teak Living Sofa Set',
    category: 'Handcrafted Furniture',
    comment:
      'We visited their showroom to inspect the teak quality before ordering. The seasoning and finish of the wood are unmatched. Sturdy, elegant, and delivered right on time.',
    rating: 5,
    district: 'kollam',
    date: '1 month ago',
  },
  {
    name: 'Ananya & Rahul Nair',
    location: 'Trivandrum, Kerala',
    product: 'Samsung 65" Crystal 4K Smart TV',
    category: 'Television & Audio',
    comment:
      'Seamless 0% EMI process and free professional wall-mounting within 24 hours of delivery. Much better pricing and personalized service than online mega-stores.',
    rating: 5,
    district: 'trivandrum',
    date: '3 weeks ago',
  },
  {
    name: 'Adv. George Varghese',
    location: 'Ernakulam, Kerala',
    product: 'Daikin 1.5 Ton 5★ Inverter Split AC',
    category: 'Home Appliances',
    comment:
      'Purchased two ACs for our home in Kochi. The technicians did a clean copper pipe vacuuming and installation. The room cools within 4 minutes and is totally whisper silent.',
    rating: 5,
    district: 'ernakulam',
    date: 'Just recently',
  },
  {
    name: 'Deepa & Rajesh Pillai',
    location: 'Kollam, Kerala',
    product: 'Grand Hydraulic Storage Teak Bed (King)',
    category: 'Handcrafted Furniture',
    comment:
      'The storage space beneath the mattress is massive and the German gas-lift mechanism is effortless to raise. Premium quality teakwood that feels solid and majestic.',
    rating: 5,
    district: 'kollam',
    date: '1 month ago',
  },
  {
    name: 'Faizal & Shabeena K.',
    location: 'Kottayam, Kerala',
    product: 'Bosch 8kg Front Load Inverter Washer',
    category: 'Home Appliances',
    comment:
      'Very courteous sales advisors who took time explaining the hard-water features suitable for Kerala well water. Delivered within 48 hours with full demo.',
    rating: 5,
    district: 'kottayam',
    date: 'Last month',
  },
];

const REAL_HOMES_GALLERY = [
  {
    title: 'Modern Kerala Villa Living',
    location: 'Kottayam',
    item: 'Chesterfield Teak Sofa & 65" 4K Sony TV',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Contemporary Waterfront Kitchen',
    location: 'Ernakulam',
    item: 'LG French Door Multi-Air Refrigerator',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Warm Teak Master Suite',
    location: 'Kollam',
    item: 'King Hydraulic Bed & Teak Wardrobe',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Family Dining Space',
    location: 'Trivandrum',
    item: '6-Seater Solid Hardwood Dining Suite',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
  },
];

export default function KeralaCustomerTrust() {
  const [activeDistrict, setActiveDistrict] = useState<string>('all');

  const filteredTestimonials = TESTIMONIALS.filter((t) => {
    if (activeDistrict === 'all') return true;
    return t.district === activeDistrict;
  });

  return (
    <section className="py-12 sm:py-16 bg-[#F5F7F9] border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Trusted Across Kerala</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
            Loved By Over 25,000+ Kerala Families
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Real experiences from homeowners across Kerala who choose Kochuvila Agencies for genuine brand electronics and authentic solid teakwood furniture.
          </p>

          {/* Google 4.9 Rating Badge */}
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-brand-border shadow-xs mt-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-left text-xs">
              <span className="font-black text-black">4.9 / 5.0</span>
              <span className="text-slate-500 ml-1.5 font-medium">(1,840+ Verified Kerala Homeowner Reviews)</span>
            </div>
          </div>
        </div>

        {/* District Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Kerala' },
            { id: 'kollam', label: 'Kollam' },
            { id: 'kottayam', label: 'Kottayam' },
            { id: 'ernakulam', label: 'Ernakulam' },
            { id: 'trivandrum', label: 'Trivandrum' },
          ].map((dist) => (
            <button
              key={dist.id}
              onClick={() => setActiveDistrict(dist.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeDistrict === dist.id
                  ? 'bg-brand-primary text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-black border border-brand-border'
              }`}
            >
              {dist.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {filteredTestimonials.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-border shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                {/* Top Stars & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Order
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Customer and Product Details */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-black">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-primary" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-brand-deepBlue uppercase tracking-wider block">
                    Purchased
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 line-clamp-1 max-w-[130px]">
                    {item.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real Homes of Kerala Visual Gallery */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider">
                <Camera className="w-4 h-4" />
                <span>Installed In Real Kerala Residences</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-black font-display uppercase tracking-tight mt-1">
                Real Homes Of Kerala
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              See how our solid teak living sets and smart appliances integrate seamlessly into authentic Kerala architectural aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REAL_HOMES_GALLERY.map((home, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={home.image}
                  alt={home.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-primary px-1.5 py-0.5 rounded text-white inline-block mb-1">
                    {home.location}
                  </span>
                  <p className="text-xs font-black line-clamp-1">{home.title}</p>
                  <p className="text-[10px] text-slate-300 line-clamp-1">{home.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
