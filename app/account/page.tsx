import React from 'react';
import { Metadata } from 'next';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
  title: 'My Account | Kochuvila Agencies',
  description: 'Manage your profile, track appliance & furniture orders, view active coupons and addresses.',
};

export default function AccountPage() {
  return <AccountClient />;
}
