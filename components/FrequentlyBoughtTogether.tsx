'use client';

import React, { useState } from 'react';
import { Plus, Check, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [includeAddon, setIncludeAddon] = useState(true);
  const [added, setAdded] = useState(false);

  // Complementary addon based on category
  const addon =
    currentProduct.category === 'appliances'
      ? {
          name: 'V-Guard 4kVA Smart Voltage Stabilizer with Digital Display',
          brand: 'V-Guard',
          price: 2490,
          mrp: 3200,
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
        }
      : {
          name: 'Hardwood Care Kit: Teakwood Polish & Natural Beeswax Cream',
          brand: 'Royal Teak',
          price: 1190,
          mrp: 1800,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
        };

  const bundleDiscount = 600;
  const totalPrice = includeAddon
    ? currentProduct.price + addon.price - bundleDiscount
    : currentProduct.price;

  const handleAddBundle = () => {
    addItem(currentProduct, 1);
    if (includeAddon) {
      addItem(
        {
          _id: `addon-${currentProduct._id}`,
          name: addon.name,
          slug: `addon-${currentProduct.slug}`,
          brand: addon.brand,
          price: addon.price - bundleDiscount,
          mrp: addon.mrp,
          images: [addon.image],
          category: currentProduct.category,
          subcategory: currentProduct.subcategory,
          description: 'Essential complementary protection accessory.',
          stock: 50,
          rating: 4.8,
          reviewCount: 42,
          discountPercentage: 25,
          isFeatured: false,
          isDeal: false,
          warranty: '2 Years Manufacturer Warranty',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Product,
        1
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
          Amazon-Style Value Package
        </span>
        <h3 className="text-lg sm:text-xl font-black text-black font-display uppercase tracking-tight mt-0.5">
          Frequently Bought Together
        </h3>
        <p className="text-xs text-slate-500">
          Bundle the original product with its most recommended protection accessory and save extra.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Images with Plus Icon */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Main Item */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F5F7F9] p-2 border border-brand-border flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentProduct.images[0]}
              alt={currentProduct.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
            <Plus className="w-4 h-4" />
          </div>

          {/* Addon Item */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F5F7F9] p-2 border border-brand-border flex items-center justify-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={addon.image}
              alt={addon.name}
              className="w-full h-full object-contain"
            />
            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
              Save ₹600
            </span>
          </div>
        </div>

        {/* Item Checkboxes & Details */}
        <div className="flex-1 space-y-2 text-xs">
          <label className="flex items-start gap-2 cursor-pointer font-bold text-black">
            <input type="checkbox" checked readOnly className="mt-0.5 rounded text-brand-primary" />
            <span>
              <strong>This item:</strong> {currentProduct.name} —{' '}
              <span className="text-brand-deepBlue">{formatINR(currentProduct.price)}</span>
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer font-bold text-slate-800">
            <input
              type="checkbox"
              checked={includeAddon}
              onChange={(e) => setIncludeAddon(e.target.checked)}
              className="mt-0.5 rounded text-brand-primary"
            />
            <span>
              <strong>Recommended Add-on:</strong> {addon.name} —{' '}
              <span className="text-brand-deepBlue">
                {formatINR(addon.price - (includeAddon ? bundleDiscount : 0))}
              </span>
              <span className="text-slate-400 line-through text-[11px] ml-1">
                {formatINR(addon.mrp)}
              </span>
            </span>
          </label>
        </div>

        {/* Price and Add Bundle Button */}
        <div className="text-center lg:text-right shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-brand-border lg:pl-6 space-y-2">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Bundle Price</span>
            <span className="text-xl sm:text-2xl font-black text-black font-display">
              {formatINR(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleAddBundle}
            className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold text-xs rounded-xl shadow-button transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Bundle Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add Both to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
