import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export default function Logo({ className = '', isLight = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 ${className}`}>
      {/* Brand Icon / Monogram - Reduced compact size */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative select-none">
        <Image
          src="/Logo/kochuvila-logo.png"
          alt="Kochuvila Agencies"
          width={40}
          height={40}
          priority
          className="w-full h-full object-contain filter drop-shadow-xs select-none"
        />
      </div>

      {/* Brand Typography - Name: 'Kochuvila Agencies' with reduced refined size */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight leading-tight font-display whitespace-nowrap ${
            isLight ? 'text-white' : 'text-[#000000]'
          } transition-colors`}
        >
          Kochuvila Agencies
        </span>
      </div>
    </Link>
  );
}
