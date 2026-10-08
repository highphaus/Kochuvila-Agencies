import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export default function Logo({ className = '', isLight = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 sm:gap-3.5 group flex-shrink-0 ${className}`}>
      {/* Official Brand Logo Image (Enlarged for stronger presence) */}
      <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Logo/Kochuvila Logo.png"
          alt="Kochuvila Agencies Logo"
          className="w-full h-full object-contain filter drop-shadow-xs"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-2xl sm:text-3xl md:text-[28px] font-black tracking-tight leading-none font-display ${
            isLight ? 'text-white' : 'text-slate-900 group-hover:text-brand-primary'
          } transition-colors`}
        >
          KOCHUVILA
        </span>
        <span
          className={`text-[9.5px] sm:text-[11px] md:text-[11.5px] font-extrabold tracking-wider sm:tracking-widest uppercase mt-1 ${
            isLight ? 'text-brand-lightBlue' : 'text-brand-primary'
          }`}
        >
          AGENCIES • APPLIANCES &amp; FURNITURE
        </span>
      </div>
    </Link>
  );
}
