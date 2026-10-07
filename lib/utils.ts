import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function calculateEMI(price: number, months: number = 6): number {
  // Approximate standard 13% annual interest or no-cost calculation
  const monthly = Math.round(price / months);
  return monthly;
}

export function generateWhatsAppEnquiryLink(product: {
  name: string;
  price: number;
  slug: string;
  sku?: string;
}): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919447000000';
  const url = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `https://kochuvilaagencies.com/product/${product.slug}`;
  
  const text = `Hello Kochuvila Agencies,\n\nI am interested in:\n*${product.name}*\nPrice: ${formatINR(product.price)}${product.sku ? `\nSKU: ${product.sku}` : ''}\n\nProduct Link: ${url}\n\nPlease let me know the availability, current offers, and delivery details.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralWhatsAppLink(): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919447000000';
  const text = `Hello Kochuvila Agencies, I would like to inquire about appliances and furniture available at your showroom.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
