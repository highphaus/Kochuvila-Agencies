import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export default function Logo({ className = '', isLight = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 ${className}`}>
      {/* Prominent Logo Graphic - Large and Sharp without expanding header height */}
      <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Logo/Kochuvila Logo.png"
          alt="Kochuvila Agencies Logo"
          className="w-full h-full object-contain filter drop-shadow-xs select-none"
        />
      </div>

      {/* Brand Typography - Clean and Compact */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-xl sm:text-2xl font-black tracking-tight leading-none font-display ${
            isLight ? 'text-white' : 'text-slate-900 group-hover:text-brand-primary'
          } transition-colors`}
        >
          KOCHUVILA
        </span>
        <span
          className={`text-[8px] sm:text-[9.5px] font-extrabold tracking-wider sm:tracking-widest uppercase mt-0.5 ${
            isLight ? 'text-brand-lightBlue' : 'text-brand-primary'
          }`}
        >
          AGENCIES • APPLIANCES &amp; FURNITURE
        </span>
      </div>
    </Link>
  );
}
