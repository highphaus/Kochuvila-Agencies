'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Navigation,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'appliances',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Visit & Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-dark font-display mt-1">
            Kochuvila Agencies Showroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Have questions about an appliance model, custom teakwood furniture, delivery timelines, or bulk orders? We're here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Showroom Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
              <h2 className="text-lg font-bold text-brand-dark border-b border-brand-border pb-3">
                Showroom Location & Contact
              </h2>

              <div className="space-y-5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-blue-50 text-brand-primary rounded-xl flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Showroom Address</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Kochuvila Agencies, Main Road, Kochuvila Junction,
                      Kerala 695001, India.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      (Opposite Main Bus Stand, Ample Customer Parking Available)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-blue-50 text-brand-primary rounded-xl flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Visiting Hours</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Monday to Saturday: 9:30 AM – 8:30 PM
                    </p>
                    <p className="text-xs text-slate-600">
                      Sunday: 10:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-blue-50 text-brand-primary rounded-xl flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Retail Helpline</h4>
                    <a
                      href="tel:+919447000000"
                      className="text-xs text-brand-primary font-bold hover:underline"
                    >
                      +91 94470 00000
                    </a>
                    <p className="text-[11px] text-slate-400">Available 9:00 AM - 9:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-blue-50 text-brand-primary rounded-xl flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Inquiries</h4>
                    <a
                      href="mailto:contact@kochuvilaagencies.com"
                      className="text-xs text-brand-primary font-bold hover:underline"
                    >
                      contact@kochuvilaagencies.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-button transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Directly on WhatsApp
                </a>
              </div>
            </div>

            {/* Parking & Showroom amenities */}
            <div className="bg-brand-dark text-white rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-sm text-brand-sky">
                Showroom Amenities
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• Free customer car parking inside premises</li>
                <li>• Air-conditioned multi-floor display</li>
                <li>• Live testing stations for audio, TVs & fridges</li>
                <li>• Teak wood finish samples & catalog customizer</li>
              </ul>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-card">
              <div className="border-b border-brand-border pb-4 mb-6">
                <h2 className="text-lg sm:text-xl font-black text-brand-dark font-display">
                  Send a Message to Our Retail Team
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details and model requirements. We will respond with availability and current offer prices.
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you, {formValues.name || 'valued customer'}. Our showroom representative will contact you via phone or WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Nair"
                        value={formValues.name}
                        onChange={(e) =>
                          setFormValues({ ...formValues, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Phone Number (WhatsApp preferred) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98470 12345"
                        value={formValues.phone}
                        onChange={(e) =>
                          setFormValues({ ...formValues, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formValues.email}
                        onChange={(e) =>
                          setFormValues({ ...formValues, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Department / Interest *
                      </label>
                      <select
                        value={formValues.inquiryType}
                        onChange={(e) =>
                          setFormValues({ ...formValues, inquiryType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 bg-white"
                      >
                        <option value="appliances">Home Appliances (Fridges, Washers, TVs)</option>
                        <option value="furniture">Furniture (Sofas, Dining, Beds, Wardrobes)</option>
                        <option value="corporate">Bulk / Wedding / Builder Order</option>
                        <option value="service">Warranty & Installation Service</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Message or Model Requirement *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know which appliance model or furniture dimension you are interested in..."
                      value={formValues.message}
                      onChange={(e) =>
                        setFormValues({ ...formValues, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
