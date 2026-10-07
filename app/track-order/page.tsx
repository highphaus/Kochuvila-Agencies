import React from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { fetchOrderById } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { OrderStatus } from '@/types';

interface TrackOrderProps {
  searchParams: { orderNumber?: string };
}

export const revalidate = 0;

export default async function TrackOrderPage({ searchParams }: TrackOrderProps) {
  const query = searchParams.orderNumber?.trim();
  const order = query ? await fetchOrderById(query) : null;

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919447000000';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hello Kochuvila Agencies, I am inquiring about the delivery timeline of order: ${query || ''}`
  )}`;

  return (
    <div className="bg-[#f8fbfe] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Doorstep Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-display mt-1">
            Track Your Kochuvila Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Enter your order reference number (e.g. KCH-2026-9041) to view real-time delivery status across Kerala.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card mb-8">
          <form method="GET" action="/track-order" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                name="orderNumber"
                defaultValue={query}
                placeholder="Enter Order Number (e.g. KCH-2026-9041)"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 font-medium uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold rounded-xl shadow-button transition-all"
            >
              Track Order
            </button>
          </form>

          <div className="mt-3 text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold">Sample order ID to test:</span>
            <Link
              href="/track-order?orderNumber=KCH-2026-9041"
              className="font-mono text-brand-primary font-bold hover:underline bg-blue-50 px-2 py-0.5 rounded"
            >
              KCH-2026-9041
            </Link>
          </div>
        </div>

        {/* Results Container */}
        {query && !order && (
          <div className="bg-white rounded-3xl p-10 border border-brand-border text-center shadow-card space-y-4">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              Order "{query}" Not Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please double check the order number from your receipt or contact our showroom helpline for manual verification.
            </p>
            <a
              href="tel:+919447000000"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
            >
              <Phone className="w-4 h-4" />
              Call Showroom Helpline: +91 94470 00000
            </a>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Order Reference
                  </span>
                  <p className="text-xl font-black text-brand-dark font-display">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current Status:</span>
                  <span className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full shadow-xs">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                  Delivery Timeline
                </h4>
                <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-primary/30 space-y-8 my-4">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-brand-primary text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            {event.status}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(event.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                          {event.notes && (
                            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">Order placed and confirmed.</p>
                  )}
                </div>
              </div>

              {/* Destination & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-border text-xs">
                <div>
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    Delivery Destination
                  </h5>
                  <p className="text-slate-700 font-medium">{order.customer.fullName}</p>
                  <p className="text-slate-500">{order.customer.address.street}</p>
                  <p className="text-slate-500">
                    {order.customer.address.city}, {order.customer.address.district} - {order.customer.address.pincode}
                  </p>
                  <p className="text-slate-700 mt-1">Phone: {order.customer.phone}</p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    Order Summary
                  </h5>
                  <p className="text-slate-500">
                    Payment Method: <strong className="text-slate-800">{order.paymentMethod.toUpperCase()}</strong> ({order.paymentStatus})
                  </p>
                  <p className="text-slate-500">
                    Items Count: {order.items.length} units
                  </p>
                  <p className="text-slate-900 font-bold text-sm mt-1">
                    Total: {formatINR(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-emerald-950 font-medium text-center sm:text-left">
                Need urgent delivery coordination or time scheduling?
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold shadow-xs transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Showroom Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
