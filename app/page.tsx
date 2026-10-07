import React from 'react';
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

export const revalidate = 60;

export default async function HomePage() {
  const [featuredData, dealsData, categories, brands] = await Promise.all([
    fetchProducts({ isFeatured: true, limit: 8 }),
    fetchProducts({ isDeal: true, limit: 8 }),
    fetchCategories(),
    fetchBrands(),
  ]);

  const featuredProducts = featuredData.products;
  const deals = dealsData.products;

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
      <KeralaHeritageBento />

      {/* SECTION 9 — TRUST: 5 PILLARS OF EXCELLENCE */}
      <TrustSection />

      {/* SECTION 10 — BRANDS: OFFICIAL RETAIL PARTNERS */}
      <BrandShowcase brands={brands} />

      {/* SECTION 11 — KERALA CUSTOMER TRUST & REAL HOMES GALLERY */}
      <KeralaCustomerTrust />

      {/* SECTION 12 — STORE EXPERIENCE: VISIT OUR 25,000 SQ.FT SHOWROOM */}
      <ShowroomExperience />

      {/* SECTION 13 — FREQUENTLY ASKED QUESTIONS */}
      <FAQSection />

      {/* SECTION 14 — FINAL CLOSING CTA */}
      <FinalCTA />
    </div>
  );
}
