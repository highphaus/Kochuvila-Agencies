import React from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { fetchOrderById } from '@/lib/api';
import { formatINR } from '@/lib/utils';

interface OrderSuccessProps {
  searchParams: { orderNumber?: string };
}

export const revalidate = 0;

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const orderNumber = searchParams.orderNumber || 'KCH-2026-CONFIRMED';
  const order = await fetchOrderById(orderNumber);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919447000000';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hello Kochuvila Agencies, I have just placed order ${orderNumber}. Please share the dispatch and delivery updates.`
  )}`;

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border shadow-elevated text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs animate-fade-in">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Order Confirmed & Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display">
              Thank You for Shopping with Kochuvila Agencies!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your order has been recorded. Our showroom logistics team will inspect the items
              and initiate doorstep delivery to your address in Kerala.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-brand-sky/40 inline-block max-w-sm mx-auto text-center w-full">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Order Reference Number
            </p>
            <p className="text-xl font-black text-brand-primary tracking-wider mt-0.5">
              {orderNumber}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Estimated Delivery: 24 to 48 Hours Across Kerala
            </p>
          </div>

          {order && (
            <div className="text-left border border-brand-border rounded-2xl p-5 bg-slate-50/50 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                <span>Customer: {order.customer.fullName}</span>
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="text-slate-600">
                <p><strong>Deliver To:</strong> {order.customer.address.street}, {order.customer.address.city}, {order.customer.address.district} - {order.customer.address.pincode}</p>
                <p className="mt-1"><strong>Phone:</strong> {order.customer.phone}</p>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-brand-dark">
                <span>Total Amount:</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/track-order?orderNumber=${orderNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Status</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Notify Showroom on WhatsApp</span>
            </a>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
