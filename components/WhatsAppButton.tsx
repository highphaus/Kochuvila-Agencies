'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils';

export default function WhatsAppButton() {
  const whatsappUrl = generateGeneralWhatsAppLink();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kochuvila Agencies on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white/20"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-medium text-sm">
        WhatsApp Us
      </span>
    </a>
  );
}
