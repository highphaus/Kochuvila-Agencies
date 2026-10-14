import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export default function Logo({ className = '', isLight = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 ${className}`}>
      {/* Brand Icon / Monogram */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden bg-[#EBF6FC] border border-[#9FD8F1]">
        <Image
          src="/Logo/Kochuvila Logo.png"
          alt="Kochuvila Home & Living"
          width={44}
          height={44}
          priority
          className="w-full h-full object-contain filter drop-shadow-xs select-none"
        />
      </div>

      {/* Brand Typography matching the visual reference */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-xl sm:text-2xl font-black tracking-tight leading-none font-display ${
            isLight ? 'text-white' : 'text-[#0097F3] group-hover:text-[#017ED0]'
          } transition-colors`}
        >
          KOCHUVILA
        </span>
        <span
          className={`text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase mt-0.5 ${
            isLight ? 'text-[#9FD8F1]' : 'text-[#017ED0]'
          }`}
        >
          HOME &amp; LIVING
        </span>
      </div>
    </Link>
  );
}
