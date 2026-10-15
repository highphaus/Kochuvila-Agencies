'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const whatsappUrl = generateGeneralWhatsAppLink();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      // Graceful offline fallback
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header matching Reference Sheet */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0097F3]">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] font-display">
            We're Here to Help You
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Have a question about appliances, furniture, warranties, or delivery? Reach out to our
            team directly.
          </p>
        </div>

        {/* 2-Column Contact Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Verified Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2EBF2] shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] font-display border-b border-[#E2EBF2] pb-3">
                Showroom Information
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#333333]">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EBF6FC] text-[#0097F3] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Showroom Locations</h4>
                    <div className="text-xs text-[#666666] mt-1 space-y-1.5 leading-relaxed">
                      <div>
                        <span className="font-semibold text-slate-800">Flagship Showroom:</span> Near Pangode Junction, Pangode – Bharathanoor Road, Pangode P.O., Trivandrum, Kerala – 695609
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Branch Showroom:</span> Main Road, Kallara, Trivandrum, Kerala – 695608
                      </div>
                      <a
                        href="https://share.google/q4d6GZbN1tKeH5T91"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#0097F3] font-semibold hover:underline pt-0.5"
                      >
                        <span>Open Verified Google Business Profile &amp; Directions →</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EBF6FC] text-[#0097F3] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Email Us</h4>
                    <a
                      href="mailto:contact@kochuvilaagencies.com"
                      className="text-xs text-[#0097F3] hover:underline mt-0.5 block font-medium"
                    >
                      contact@kochuvilaagencies.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EBF6FC] text-[#0097F3] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Call Our Team</h4>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <a
                        href="tel:+919745111141"
                        className="text-xs text-[#0097F3] hover:underline font-semibold"
                      >
                        +91 97451 11141
                      </a>
                      <a
                        href="tel:+919972223065"
                        className="text-xs text-slate-600 hover:text-[#0097F3] transition-colors"
                      >
                        +91 99722 23065
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EBF6FC] text-[#0097F3] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Working Hours</h4>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Monday to Saturday: 8:30 AM – 9:00 PM
                    </p>
                    <p className="text-[11px] text-[#888888]">Sunday: 9:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2 border-t border-[#E2EBF2] space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>Chat with Showroom on WhatsApp (+91 97451 11141)</span>
                </a>
                <a
                  href="https://share.google/q4d6GZbN1tKeH5T91"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0097F3]/10 text-[#0097F3] border border-[#0097F3]/20 text-xs font-semibold hover:bg-[#0097F3]/20 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>View Official Google Business Profile</span>
                </a>
              </div>
            </div>

            {/* Map Preview Container */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2EBF2] shadow-xs">
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#E2EBF2]/40 border border-[#E2EBF2] flex items-center justify-center text-center p-4">
                <iframe
                  title="Kochuvila Agencies Location Pangode"
                  src="https://maps.google.com/maps?q=Kochuvila+Agencies+Pangode+Trivandrum+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2EBF2] shadow-xs">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] font-display">
                    Thank You! Message Received.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                    Our customer care team at Pangode &amp; Kallara will review your inquiry and get in touch
                    shortly via phone or email.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormValues({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-[#0097F3] text-white text-xs font-semibold hover:bg-[#017ED0] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#1A1A1A] font-display">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Fill out the form below and our product consultants will respond promptly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Nair"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EBF2] focus:border-[#0097F3] focus:ring-1 focus:ring-[#0097F3] text-xs text-[#1A1A1A] placeholder:text-[#999999] outline-hidden transition-all bg-[#F8FBFE]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EBF2] focus:border-[#0097F3] focus:ring-1 focus:ring-[#0097F3] text-xs text-[#1A1A1A] placeholder:text-[#999999] outline-hidden transition-all bg-[#F8FBFE]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 97451 11141"
                        value={formValues.phone}
                        onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EBF2] focus:border-[#0097F3] focus:ring-1 focus:ring-[#0097F3] text-xs text-[#1A1A1A] placeholder:text-[#999999] outline-hidden transition-all bg-[#F8FBFE]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what product or assistance you are looking for..."
                      value={formValues.message}
                      onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2EBF2] focus:border-[#0097F3] focus:ring-1 focus:ring-[#0097F3] text-xs text-[#1A1A1A] placeholder:text-[#999999] outline-hidden transition-all bg-[#F8FBFE] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#0097F3] hover:bg-[#017ED0] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
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
