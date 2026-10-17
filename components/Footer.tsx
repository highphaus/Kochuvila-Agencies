import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';
import Logo from './Logo';
import WhatsAppIcon from './WhatsAppIcon';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = generateGeneralWhatsAppLink();

  return (
    <footer className="bg-[#06121E] text-[#94A3B8] pt-12 sm:pt-14 pb-24 md:pb-8 border-t border-[#102A45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-[#102A45]">
          {/* Col 1: Brand Info & Trust (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo isLight />
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm pt-1">
              Kochuvila Agencies is Trivandrum’s premier retail showroom located in Pangode &amp; Kallara, offering 100% genuine home appliances and handcrafted solid furniture. Built on trust, quality, and lifetime care.
            </p>
            <div className="pt-1 text-xs text-[#CBD5E1] space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9FD8F1] shrink-0" />
                <span>100% Genuine Manufacturer Warranties</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9FD8F1] shrink-0" />
                <span>Safe Doorstep Delivery from Trivandrum Showroom</span>
              </p>
            </div>

            {/* Quick WhatsApp Support Action */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold transition-all group"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0 group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp (+91 97451 11141)</span>
              </a>
            </div>
          </div>

          {/* Col 2 & 3: Quick Links & Customer Service (Combined 2-column grid on mobile, separate on desktop) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-display border-b border-[#102A45]/80 pb-2">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=appliances" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Appliances
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=furniture" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Furniture
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-display border-b border-[#102A45]/80 pb-2">
                Customer Care
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/faq" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Delivery Policy
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Returns &amp; Warranty
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#9FD8F1] transition-colors flex items-center gap-1 group">
                    <span className="text-[#9FD8F1] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Privacy &amp; Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 4: Get In Touch (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-display border-b border-[#102A45]/80 pb-2">
              Showroom &amp; Contact
            </h4>
            <div className="space-y-3 text-xs text-[#94A3B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9FD8F1] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-white font-semibold">Flagship Showroom:</p>
                  <p className="leading-relaxed">Near Pangode Junction, Pangode P.O., Bharathanoor Road, Trivandrum – 695609</p>
                  <p className="text-[11px] text-[#9FD8F1]/90">Branch: Main Road, Kallara – 695608</p>
                  <a
                    href="https://share.google/q4d6GZbN1tKeH5T91"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#9FD8F1] hover:underline text-[11px] pt-1 font-semibold"
                  >
                    <span>View on Google Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-[#9FD8F1] shrink-0" />
                <a href="mailto:contact@kochuvilaagencies.com" className="hover:text-[#9FD8F1] transition-colors truncate">
                  contact@kochuvilaagencies.com
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#9FD8F1] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+919745111141" className="hover:text-[#9FD8F1] transition-colors font-bold text-white">
                    +91 97451 11141
                  </a>
                  <a href="tel:+919972223065" className="hover:text-[#9FD8F1] transition-colors text-[11px] text-slate-400">
                    +91 99722 23065
                  </a>
                </div>
              </div>

              <div className="pt-1.5">
                <span className="inline-block bg-[#102A45] text-[#9FD8F1] text-[11px] px-3 py-1.5 rounded-lg font-medium border border-[#1E3A5F]">
                  Mon – Sat: 8:30 AM – 9:00 PM <br className="sm:hidden" />
                  <span className="hidden sm:inline"> | </span>Sun: 9:00 AM – 8:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-3">
          <p className="text-center sm:text-left">
            All rights reserved © Kochuvila Agencies {currentYear}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-[#9FD8F1] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#9FD8F1] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" className="hover:text-[#9FD8F1] transition-colors">
              Store Locator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
