'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories?: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Predefined curated categories matching the reference layout
  const primaryCategories = [
    {
      name: 'Furniture',
      slug: 'furniture',
      href: '/furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Refrigerators',
      slug: 'refrigerators',
      href: '/appliances/refrigerators',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Washing Machines',
      slug: 'washing-machines',
      href: '/appliances/washing-machines',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'TV & Entertainment',
      slug: 'televisions',
      href: '/appliances/televisions',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kitchen Appliances',
      slug: 'kitchen-appliances',
      href: '/appliances/kitchen-appliances',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Air Conditioners',
      slug: 'air-conditioners',
      href: '/appliances/air-conditioners',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="shop-by-category" className="py-10 sm:py-14 bg-[#FDFDFD] border-b border-[#E2EBF2] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] font-display">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Explore our wide selection of certified appliances and living essentials.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0097F3] hover:text-[#017ED0] hover:underline"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Horizontal Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {primaryCategories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group bg-[#EBF6FC]/50 hover:bg-white rounded-2xl p-4 border border-[#E2EBF2] hover:border-[#0097F3] transition-all duration-200 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white p-2.5 flex items-center justify-center mb-3 overflow-hidden border border-[#9FD8F1]/50 relative shadow-2xs">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="font-semibold text-xs sm:text-[13px] text-[#000000] group-hover:text-[#0097F3] transition-colors line-clamp-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
