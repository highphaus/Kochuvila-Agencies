'use client';

import React, { useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import PromoBanners from '@/components/PromoBanners';
import BrandShowcase from '@/components/BrandShowcase';
import ShowroomExperience from '@/components/ShowroomExperience';
import FAQSection from '@/components/FAQSection';
import { fetchProducts, fetchCategories, fetchBrands } from '@/lib/api';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS } from '@/lib/data/sample-data';
import { Product, Category, Brand } from '@/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() =>
    SAMPLE_PRODUCTS.filter((p) => p.isFeatured).slice(0, 10)
  );
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchProducts({ isFeatured: true, limit: 12 }),
      fetchCategories(),
      fetchBrands(),
    ])
      .then(([featuredData, catData, brandData]) => {
        if (!isMounted) return;
        if (featuredData?.products?.length) setFeaturedProducts(featuredData.products);
        if (catData?.length) setCategories(catData);
        if (brandData?.length) setBrands(brandData);
      })
      .catch((err) => {
        console.warn('Backend fetch failed, using local high-speed cache:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* 1. HERO SECTION matching user's visual reference (Hero Canvas + Trust Bar + 5 Curated Category Cards) */}
      <HeroBanner />

      {/* 2. FEATURED PRODUCTS (Best Sellers, New Arrivals, Top Rated) */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* 3. PROMOTIONAL EDITORIAL BANNERS (Comfort for Every Corner & Trusted Home Appliances) */}
      <PromoBanners />

      {/* 4. BRAND PARTNERS (Authorized dealer showcase) */}
      <div className="bg-[#FDFDFD]">
        <BrandShowcase brands={brands} />
      </div>

      {/* 5. PHYSICAL SHOWROOM EXPERIENCE IN TRIVANDRUM */}
      <ShowroomExperience />

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <FAQSection />
    </div>
  );
}
