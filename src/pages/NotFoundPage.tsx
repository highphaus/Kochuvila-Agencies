import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFDFD] px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2EBF2] p-8 sm:p-12 shadow-xs space-y-5">
        {/* Subtle 404 badge / illustration */}
        <div className="w-20 h-20 rounded-full bg-[#EBF6FC] text-[#0097F3] flex items-center justify-center mx-auto text-3xl font-black font-display">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-display">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another section.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0097F3] text-white text-xs sm:text-sm font-semibold hover:bg-[#017ED0] transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
