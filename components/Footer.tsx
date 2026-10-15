import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
} from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06121E] text-[#94A3B8] pt-14 pb-8 border-t border-[#102A45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#102A45]">
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo isLight />
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm pt-2">
              Kochuvila Agencies is Kerala’s premier destination for genuine home appliances
              and handcrafted furniture. Discover comfort, elegance, and durability built for everyday living.
            </p>
            <div className="pt-2 text-xs text-[#CBD5E1] space-y-1.5">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9FD8F1]" />
                <span>100% Genuine Manufacturer Warranties</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9FD8F1]" />
                <span>Safe Doorstep Delivery across Kerala</span>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#9FD8F1] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/appliances" className="hover:text-[#9FD8F1] transition-colors">
                  Appliances
                </Link>
              </li>
              <li>
                <Link href="/furniture" className="hover:text-[#9FD8F1] transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#9FD8F1] transition-colors">
                  Our Brands
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#9FD8F1] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#9FD8F1] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-[#9FD8F1] transition-colors">
                  Frequently Asked Questions (FAQs)
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#9FD8F1] transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#9FD8F1] transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#9FD8F1] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#9FD8F1] transition-colors">
                  Dedicated Customer Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#9FD8F1] transition-colors">
                  Privacy Policy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get In Touch (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Get In Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#94A3B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9FD8F1] shrink-0 mt-0.5" />
                <span>KK Building, Kazhakuttam, Trivandrum, Kerala - 695582</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9FD8F1] shrink-0" />
                <a href="mailto:highphaus@gmail.com" className="hover:text-[#9FD8F1] transition-colors">
                  highphaus@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9FD8F1] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#9FD8F1] transition-colors font-medium">
                  +91 98765 43210
                </a>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-[#102A45] text-[#9FD8F1] text-[11px] px-3 py-1 rounded-full font-medium">
                  Mon – Sat: 9:30 AM – 8:30 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-3">
          <p>All rights reserved © Kochuvila {currentYear}</p>
          <div className="flex items-center gap-6">
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
