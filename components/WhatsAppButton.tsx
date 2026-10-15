'use client';

import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function WhatsAppButton() {
  const whatsappUrl = generateGeneralWhatsAppLink();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kochuvila Agencies on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 md:px-4 md:py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white/20 active:scale-95"
    >
      <WhatsAppIcon className="w-6 h-6 shrink-0 fill-current" />
      <span className="hidden md:inline-block max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-semibold text-xs sm:text-sm">
        WhatsApp Us
      </span>
    </a>
  );
}
