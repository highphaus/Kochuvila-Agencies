'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Users, Award, MapPin, Phone, Mail, ArrowRight, HeartHandshake, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F8FBFE] py-12 sm:py-16 md:py-20 border-b border-[#E2EBF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols): Story matching reference */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6FC] text-[#0097F3] text-xs font-bold tracking-wider uppercase border border-[#0097F3]/25">
                <Award className="w-3.5 h-3.5" />
                <span>Trusted Retailer Since 1993</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] font-display leading-tight">
                About Kochuvila
              </h1>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Kochuvila is a trusted name in home appliances and furniture, dedicated to bringing
                high-quality products, modern convenience, and lasting comfort to every home.
                With decades of trusted retail experience, our showroom in Trivandrum offers a vast
                selection of premium brands and personalized customer care.
              </p>

              {/* 3 Pills matching Reference Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E2EBF2] text-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#0097F3] mx-auto mb-1.5" />
                  <span className="block text-xs font-bold text-[#1A1A1A]">Quality Products</span>
                  <span className="text-[10px] text-[#666666]">100% Genuine</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E2EBF2] text-center shadow-xs">
                  <Users className="w-5 h-5 text-[#0097F3] mx-auto mb-1.5" />
                  <span className="block text-xs font-bold text-[#1A1A1A]">Customer First</span>
                  <span className="text-[10px] text-[#666666]">Dedicated Support</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E2EBF2] text-center shadow-xs">
                  <Award className="w-5 h-5 text-[#0097F3] mx-auto mb-1.5" />
                  <span className="block text-xs font-bold text-[#1A1A1A]">Trusted Since 1993</span>
                  <span className="text-[10px] text-[#666666]">30+ Years Legacy</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0097F3] text-white text-xs font-semibold hover:bg-[#017ED0] transition-all shadow-xs"
                >
                  <span>Visit Our Showroom</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E2EBF2] text-[#1A1A1A] text-xs font-semibold hover:bg-[#EBF6FC]/50 transition-all"
                >
                  <span>Explore Catalog</span>
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols): Showroom Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-[#E2EBF2]">
                <Image
                  src="/banners/hero-living.jpg"
                  alt="Kochuvila Showroom Display in Trivandrum"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-sm">Flagship Showroom</p>
                  <p className="text-xs text-white/80">Near Pangode Junction, Pangode P.O., Trivandrum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E2EBF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-display">
              Our Commitment to You
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Every customer relationship at Kochuvila is built on trust, transparency, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-[#E2EBF2] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-display">100% Authentic Brands</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                We never compromise on product authenticity. Every refrigerator, TV, washing machine,
                and sofa is directly sourced from certified manufacturers with official brand warranties.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-[#E2EBF2] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-display">Fair, Honest Pricing</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Clear, upfront prices with no hidden charges. We offer competitive festive pricing,
                easy zero-cost EMI plans, and reliable exchange bonuses for your older appliances.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-[#E2EBF2] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-display">Life-Long Local Support</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Our support doesn’t end when your order is delivered. From free doorstep installation
                to manufacturer warranty coordination, our local showroom team is always here for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Visit Card */}
      <section className="py-12 sm:py-16 bg-[#F8FBFE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-[#E2EBF2] p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#1A1A1A] font-display">
                Experience Kochuvila in Person
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] max-w-lg">
                Step into our expansive showrooms in Pangode &amp; Kallara, Trivandrum to test appliances, feel
                premium wood finishes, and consult our experienced product specialists.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-[#333333] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#0097F3]" /> Near Pangode Junction, Trivandrum (Branch: Kallara)
                </span>
                <a href="tel:+919745111141" className="flex items-center gap-1.5 font-medium hover:text-[#0097F3]">
                  <Phone className="w-4 h-4 text-[#0097F3]" /> +91 97451 11141
                </a>
              </div>
            </div>
            <a
              href="https://share.google/q4d6GZbN1tKeH5T91"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0097F3] text-white text-xs font-semibold hover:bg-[#017ED0] transition-all shrink-0"
            >
              <span>Get Directions on Google</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
