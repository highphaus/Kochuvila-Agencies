import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageSquare,
  Award,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';
import Logo from './Logo';

export default function Footer() {
  const whatsappUrl = generateGeneralWhatsAppLink();

  return (
    <footer className="bg-[#051329] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800/80 text-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-lightBlue">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Kerala-Wide Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">
                Safe doorstep handling for major appliances and heavy furniture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-lightBlue">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Brands</h4>
              <p className="text-xs text-slate-400 mt-1">
                Official manufacturer brand warranties with authorized local service.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-lightBlue">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Flexible Payments & EMI</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero-cost EMI plans, online UPI, cards, and Cash on Delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-lightBlue">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Showroom Experience</h4>
              <p className="text-xs text-slate-400 mt-1">
                Visit our physical showroom at Kochuvila Junction for live demos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer main links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo isLight />
            <p className="text-xs text-slate-400 leading-relaxed pr-6 mt-3">
              Kochuvila Agencies is Kerala's trusted retail destination for world-class
              refrigerators, washing machines, 4K smart TVs, air conditioners, and solid
              teakwood & modern ergonomic furniture. Experience transparent pricing, verified
              warranties, and dedicated doorstep delivery.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-700"
              >
                <MapPin className="w-4 h-4 text-brand-lightBlue" />
                Get Directions
              </Link>
            </div>
          </div>

          {/* Appliances links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-2">
              Appliances
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products?category=appliances&subcategory=refrigerators" className="hover:text-brand-lightBlue transition-colors">
                  Side-by-Side & Double Door Fridges
                </Link>
              </li>
              <li>
                <Link href="/products?category=appliances&subcategory=washing-machines" className="hover:text-brand-lightBlue transition-colors">
                  Front & Top Load Washing Machines
                </Link>
              </li>
              <li>
                <Link href="/products?category=appliances&subcategory=televisions" className="hover:text-brand-lightBlue transition-colors">
                  4K Ultra HD & OLED Smart TVs
                </Link>
              </li>
              <li>
                <Link href="/products?category=appliances&subcategory=air-conditioners" className="hover:text-brand-lightBlue transition-colors">
                  Inverter Split Air Conditioners
                </Link>
              </li>
              <li>
                <Link href="/products?category=appliances&subcategory=kitchen-appliances" className="hover:text-brand-lightBlue transition-colors">
                  Mixer Grinders & Microwaves
                </Link>
              </li>
            </ul>
          </div>

          {/* Furniture links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-2">
              Furniture
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products?category=furniture&subcategory=sofas" className="hover:text-brand-lightBlue transition-colors">
                  Solid Wood & Sectional Sofas
                </Link>
              </li>
              <li>
                <Link href="/products?category=furniture&subcategory=beds" className="hover:text-brand-lightBlue transition-colors">
                  King & Queen Beds with Storage
                </Link>
              </li>
              <li>
                <Link href="/products?category=furniture&subcategory=dining" className="hover:text-brand-lightBlue transition-colors">
                  6-Seater & 4-Seater Dining Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=furniture&subcategory=wardrobes" className="hover:text-brand-lightBlue transition-colors">
                  Engineered & Solid Wood Wardrobes
                </Link>
              </li>
              <li>
                <Link href="/products?isDeal=true" className="text-brand-lightBlue hover:text-white font-bold transition-colors">
                  Special Clearance & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Location & Timings */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-2">
              Showroom Visit
            </h5>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-lightBlue flex-shrink-0 mt-0.5" />
                <span>
                  Kochuvila Junction, Main Road, Kerala, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-lightBlue flex-shrink-0" />
                <span>Mon - Sat: 9:30 AM - 8:30 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-lightBlue flex-shrink-0" />
                <span>Sun: 10:00 AM - 7:00 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-lightBlue flex-shrink-0" />
                <a href="tel:+919447023456" className="hover:text-white">
                  +91 94470 23456
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-lightBlue flex-shrink-0" />
                <a href="mailto:contact@kochuvilaagencies.com" className="hover:text-white">
                  contact@kochuvilaagencies.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Kochuvila Agencies. All rights reserved. Trusted Retailers in Kerala.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:text-brand-lightBlue">
              Track Order
            </Link>
            <Link href="/contact" className="hover:text-brand-lightBlue">
              Contact Us
            </Link>
            <Link href="/admin" className="text-brand-lightBlue hover:text-white font-semibold">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
