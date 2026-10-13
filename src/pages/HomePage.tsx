import React, { useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import ShopByWorld from '@/components/ShopByWorld';
import CategoryGrid from '@/components/CategoryGrid';
import HomeStylistFinder from '@/components/HomeStylistFinder';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import ShopByRoom from '@/components/ShopByRoom';
import DealsSection from '@/components/DealsSection';
import KeralaHeritageBento from '@/components/KeralaHeritageBento';
import TrustSection from '@/components/TrustSection';
import BrandShowcase from '@/components/BrandShowcase';
import KeralaCustomerTrust from '@/components/KeralaCustomerTrust';
import ShowroomExperience from '@/components/ShowroomExperience';
import FAQSection from '@/components/FAQSection';
import FinalCTA from '@/components/FinalCTA';
import { fetchProducts, fetchCategories, fetchBrands } from '@/lib/api';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES, SAMPLE_BRANDS } from '@/lib/data/sample-data';
import { Product, Category, Brand } from '@/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() =>
    SAMPLE_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8)
  );
  const [deals, setDeals] = useState<Product[]>(() =>
    SAMPLE_PRODUCTS.filter((p) => p.isDeal).slice(0, 8)
  );
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(SAMPLE_BRANDS);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchProducts({ isFeatured: true, limit: 8 }),
      fetchProducts({ isDeal: true, limit: 8 }),
      fetchCategories(),
      fetchBrands(),
    ])
      .then(([featuredData, dealsData, catData, brandData]) => {
        if (!isMounted) return;
        if (featuredData?.products?.length) setFeaturedProducts(featuredData.products);
        if (dealsData?.products?.length) setDeals(dealsData.products);
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
    <div className="flex flex-col min-h-screen bg-[#F5F7F9]">
      {/* SECTION 1 — HERO BANNER WITH INTEGRATED CATEGORY NAV UNDER SLIDER */}
      <HeroBanner />

      {/* SECTION 2 — SHOP BY WORLD: DUAL FLAGSHIP DEPARTMENTS */}
      <ShopByWorld />

      {/* SECTION 3 — SHOP BY CATEGORY: APPLIANCES & FURNITURE */}
      <CategoryGrid categories={categories} />

      {/* SECTION 4 — INTERACTIVE SMART HOME STYLIST & BUDGET FINDER */}
      <HomeStylistFinder />

      {/* SECTION 5 — FEATURED PRODUCTS: CURATED PICKS */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* SECTION 6 — SHOP BY ROOM: LIFESTYLE INSPIRATION */}
      <ShopByRoom />

      {/* SECTION 7 — DEALS: FLASH OFFERS & SPOTLIGHT DEAL OF THE DAY */}
      <DealsSection deals={deals} />

      {/* SECTION 8 — THE KOCHUVILA STANDARD: MALABAR TEAK & COASTAL APPLIANCE BENTO */}
      <div className="cv-auto">
        <KeralaHeritageBento />
      </div>

      {/* SECTION 9 — TRUST: 5 PILLARS OF EXCELLENCE */}
      <div className="cv-auto">
        <TrustSection />
      </div>

      {/* SECTION 10 — AUTHORIZED BRAND PARTNERS */}
      <div className="cv-auto">
        <BrandShowcase brands={brands} />
      </div>

      {/* SECTION 11 — KERALA CUSTOMER TRUST & REAL HOMES */}
      <div className="cv-auto">
        <KeralaCustomerTrust />
      </div>

      {/* SECTION 12 — PHYSICAL SHOWROOM EXPERIENCE */}
      <div className="cv-auto">
        <ShowroomExperience />
      </div>

      {/* SECTION 13 — FREQUENTLY ASKED QUESTIONS */}
      <div className="cv-auto">
        <FAQSection />
      </div>

      {/* SECTION 14 — FINAL CONFIDENCE CTA */}
      <div className="cv-auto">
        <FinalCTA />
      </div>
    </div>
  );
}
