import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, FileText, HelpCircle, ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'shipping' | 'return' | 'privacy' | 'terms' | 'faq';
}

export default function PolicyPage({ type }: PolicyPageProps) {
  const contentMap = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      subtitle: 'Doorstep transit across all 14 districts in Kerala.',
      sections: [
        {
          heading: 'Kerala-Wide Doorstep Delivery',
          text: 'Kochuvila Home & Living coordinates direct dispatch for heavy home appliances and solid wood furniture across all 14 districts in Kerala through our specialized fleet and regional logistics partners.',
        },
        {
          heading: 'Delivery Timelines',
          text: 'Orders within Trivandrum, Kollam, and Pathanamthitta are delivered within 24–48 hours. Orders across Central and Northern Kerala are fulfilled within 2–4 business days with live SMS tracking.',
        },
        {
          heading: 'White-Glove Handling & Installation',
          text: 'Major appliances (refrigerators, washing machines, and split air conditioners) are unboxed in your presence to verify pristine condition. Certified brand technicians coordinate free demo and installation within 24 hours of delivery.',
        },
      ],
    },
    return: {
      title: 'Returns & Exchange Policy',
      icon: RotateCcw,
      subtitle: 'Hassle-free 7-day replacement guarantee.',
      sections: [
        {
          heading: '7-Day Manufacturing Defect Replacement',
          text: 'If your appliance or furniture unit arrives with transit damage, hardware fault, or technical malfunction, our team will inspect and replace the product within 7 days at zero additional expense.',
        },
        {
          heading: 'Inspection at Time of Delivery',
          text: 'We encourage customers to inspect appliance cosmetics, panels, and furniture finishes upon arrival. Any transit scratches should be immediately noted on the delivery receipt.',
        },
        {
          heading: 'Brand Warranty Service',
          text: 'Beyond 7 days, all items are protected by comprehensive official manufacturer brand warranties (up to 10 years on inverter compressors and motor units). Contact our showroom or call brand helpline for local technician dispatch.',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      subtitle: 'How we safeguard your personal information.',
      sections: [
        {
          heading: 'Information We Collect',
          text: 'We collect your name, delivery address, phone number, and email strictly for processing your orders, providing dispatch notifications, and delivering warranty service.',
        },
        {
          heading: 'Payment Security',
          text: 'We never store sensitive credit card or net banking details on our servers. All digital transactions are securely processed through encrypted, RBI-compliant payment gateways.',
        },
        {
          heading: 'No Third-Party Sharing',
          text: 'Your personal data is never sold, traded, or shared with third-party advertisers. Information is only shared with our logistics drivers to ensure accurate doorstep delivery.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      subtitle: 'Standard terms for shopping at Kochuvila Home & Living.',
      sections: [
        {
          heading: 'Product Pricing & Availability',
          text: 'All prices listed on our website are inclusive of GST. We strive to maintain accurate inventory levels. In rare instances where an item is out of stock, full refunds or alternative options will be provided.',
        },
        {
          heading: 'Warranty Claims',
          text: 'Manufacturer warranties are governed by the respective brand policies. Kochuvila provides genuine GST tax invoices that validate warranty registration with LG, Samsung, Whirlpool, Godrej, Bosch, etc.',
        },
        {
          heading: 'Governing Law',
          text: 'All disputes are subject to the jurisdiction of the competent courts in Trivandrum, Kerala.',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      icon: HelpCircle,
      subtitle: 'Common questions answered by our showroom team.',
      sections: [
        {
          heading: 'Are the products 100% genuine?',
          text: 'Yes. Kochuvila Agencies is an authorized Tier-1 retail partner for LG, Samsung, Whirlpool, Bosch, IFB, Godrej, Nilkamal, Durian, and more. Every unit comes in original factory sealed boxes with valid brand warranty cards.',
        },
        {
          heading: 'Is installation included for ACs and Washing Machines?',
          text: 'Standard brand installation is provided for washing machines and smart TVs. Air conditioner copper piping and bracket installation are provided according to standard manufacturer charges.',
        },
        {
          heading: 'Can I choose Cash on Delivery (COD)?',
          text: 'Yes! We support Cash on Delivery (and UPI on delivery) for eligible orders across Kerala.',
        },
      ],
    },
  };

  const item = contentMap[type] || contentMap.shipping;
  const Icon = item.icon;

  return (
    <div className="bg-[#FDFDFD] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0097F3] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl border border-[#E2EBF2] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="border-b border-[#E2EBF2] pb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-display">
                {item.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">{item.subtitle}</p>
            </div>
          </div>

          <div className="space-y-6">
            {item.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="text-base font-bold text-[#1A1A1A] font-display">{sec.heading}</h2>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">{sec.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E2EBF2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
            <span>Need further assistance? Call +91 97451 11141</span>
            <Link
              href="/contact"
              className="inline-flex px-4 py-2 bg-[#0097F3] text-white rounded-lg font-semibold hover:bg-[#017ED0] transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
