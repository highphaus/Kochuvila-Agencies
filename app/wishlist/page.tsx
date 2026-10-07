import React from 'react';
import { Metadata } from 'next';
import WishlistClient from './WishlistClient';

export const metadata: Metadata = {
  title: 'My Wishlist | Kochuvila Agencies',
  description: 'View and manage your saved appliances and handcrafted furniture at Kochuvila Agencies.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
