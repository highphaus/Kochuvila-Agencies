import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const ROOMS = [
  {
    name: 'Living Room',
    badge: 'Solid Teakwood',
    startingPrice: 'From ₹28,990',
    description: 'Solid teakwood chesterfield sofas, luxury L-shapes, recliners & handcrafted TV consoles.',
    link: '/products?category=furniture&subcategory=sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    cta: 'Explore Living Room',
  },
  {
    name: 'Master Bedroom',
    badge: 'Hydraulic Storage',
    startingPrice: 'From ₹34,500',
    description: 'King & queen size teak storage beds, bonded ortho mattresses & three-door solid wardrobes.',
    link: '/products?category=furniture&subcategory=beds',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    cta: 'Explore Bedroom',
  },
  {
    name: 'Dining & Kitchen',
    badge: 'Seasoned Hardwood',
    startingPrice: 'From ₹22,000',
    description: '6-seater & 4-seater solid wood dining tables with cushioned chairs & crockery units.',
    link: '/products?category=furniture&subcategory=dining',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    cta: 'Explore Dining Sets',
  },
  {
    name: 'Home Office & Study',
    badge: 'Ergonomic Comfort',
    startingPrice: 'From ₹8,990',
    description: 'Executive orthopedic chairs, teak study desks & modular bookshelves for Kerala homes.',
    link: '/products?category=furniture',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    cta: 'Explore Workspaces',
  },
];

export default function ShopByRoom() {
  return (
    /* Editorial furniture section with light blue background (#9FD9F1 / #EBF7FC) */
    <section className="py-10 sm:py-14 bg-gradient-to-b from-[#EBF7FC] via-[#F2FAFD] to-white border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-deepBlue mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Lifestyle In Situ Inspiration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
              Shop By Room
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Designed for authentic Kerala living spaces. Handcrafted with 100% seasoned solid teakwood and premium stain-resistant upholstery.
            </p>
          </div>

          <Link
            href="/products?category=furniture"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black border-2 border-brand-primary hover:bg-brand-lightBlueSoft rounded-xl text-xs sm:text-sm font-bold transition-all shadow-card group"
          >
            <span>View All Furniture Collections</span>
            <ArrowRight className="w-4 h-4 text-brand-primary transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.name}
              href={room.link}
              className="group bg-white rounded-3xl overflow-hidden border border-brand-border hover:border-brand-primary transition-all duration-300 shadow-card hover:shadow-cardHover flex flex-col"
            >
              {/* Large Photography with Badge & Price Tag */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.image}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Floating pill badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-brand-deepBlue text-[10px] font-black uppercase tracking-wider shadow-xs">
                    {room.badge}
                  </span>
                </div>

                {/* Price indicator tag */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                    {room.startingPrice}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {room.description}
                  </p>
                </div>

                {/* Blue CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-primary group-hover:text-brand-deepBlue transition-colors">
                  <span>{room.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
