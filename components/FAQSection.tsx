'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: 'delivery' | 'warranty' | 'furniture' | 'emi';
}

const FAQS: FAQItem[] = [
  {
    question: 'Do you deliver across all 14 districts in Kerala?',
    answer:
      'Yes, absolutely! Kochuvila Agencies operates a dedicated logistics fleet covering all 14 districts—from Thiruvananthapuram and Kollam up to Kozhikode and Kasaragod. Large appliances and solid teak furniture are safely transported in air-cushioned transit vehicles to prevent any scratch or transit damage.',
    category: 'delivery',
  },
  {
    question: 'Is in-home installation and demo free for TVs, ACs, and Washers?',
    answer:
      'Yes. For all major appliances (4K Smart TVs, Split ACs, Refrigerators, and Washing Machines), certified manufacturer service engineers from LG, Samsung, Sony, or Bosch will visit your residence to handle unboxing, installation, leveling, wall-mounting, and a full operational walkthrough.',
    category: 'warranty',
  },
  {
    question: 'How is your solid teakwood furniture protected against Kerala monsoons?',
    answer:
      'All our solid teakwood undergoes rigorous vacuum kiln-drying to bring moisture content down to 10–12%, ideal for Kerala tropical humidity. This prevents swelling, joint loosening, and fungal growth. Furthermore, each piece receives multi-layer polyurethane heat and water-resistant sealing.',
    category: 'furniture',
  },
  {
    question: 'How does 0% Interest EMI financing work at Kochuvila?',
    answer:
      'We offer zero-cost EMI plans up to 12 months with leading banks including HDFC, ICICI, SBI, Axis, Federal Bank, and Bajaj Finserv. You can activate this directly during online checkout or at our showroom counter with instant paperless verification.',
    category: 'emi',
  },
  {
    question: 'What if I need service or warranty support after purchase?',
    answer:
      'Because Kochuvila Agencies is an authorized direct dealer, all products carry 100% genuine manufacturer warranties (up to 10 years on inverter compressors and motors, and lifetime structural guarantees on teak frames). You can either contact the brand customer care directly or call our showroom desk for priority escalation.',
    category: 'warranty',
  },
  {
    question: 'Can I inspect the products at your showroom before buying?',
    answer:
      'Yes! We warmly invite you to visit our 25,000+ sq.ft. showroom at Kochuvila Junction. You can test live audio-visual setups, sit on the teak living sofas, check storage capacities, and speak with our advisors before ordering in-person or online.',
    category: 'furniture',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsappUrl = generateGeneralWhatsAppLink();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lightBlueSoft text-brand-deepBlue text-xs font-bold uppercase tracking-wider border border-brand-lightBlue">
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black font-display uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear answers about doorstep delivery, brand warranties, solid teakwood care, and zero-cost financing across Kerala.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-brand-lightBlueSoft/40 border-brand-primary shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-black">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand-primary text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-brand-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-8 p-5 rounded-2xl bg-[#F5F7F9] border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-black">
              Have a specific question about an appliance or teak dimensions?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Chat directly with our Kerala customer team on WhatsApp for instant assistance.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-sm flex-shrink-0 active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
