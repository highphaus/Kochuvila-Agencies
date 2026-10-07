import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileBottomNav from '@/components/MobileBottomNav';
import CompareDrawer from '@/components/CompareDrawer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Kochuvila Agencies | Home Appliances & Furniture Showroom Kerala',
  description:
    'Kerala’s premier destination for genuine refrigerators, washing machines, 4K TVs, split ACs, living sofas, and teak wood beds. Doorstep delivery across Kerala, manufacturer warranties, and easy EMI.',
  keywords: [
    'Kochuvila Agencies',
    'Kerala home appliances',
    'appliances showroom Kerala',
    'furniture store Kerala',
    'refrigerator price Kerala',
    'teak wood sofa Kerala',
    'smart TV deals Kerala',
  ],
  openGraph: {
    title: 'Kochuvila Agencies | Home Appliances & Furniture Showroom',
    description: 'Explore the finest appliances and furniture with fast doorstep delivery across Kerala.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F5F7F9] text-black selection:bg-brand-primary selection:text-white font-sans antialiased pb-14 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileBottomNav />
        <CompareDrawer />
      </body>
    </html>
  );
}
