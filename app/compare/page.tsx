import React from 'react';
import { Metadata } from 'next';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Products | Kochuvila Agencies',
  description: 'Side-by-side specification and price comparison for home appliances and solid teakwood furniture.',
};

export default function ComparePage() {
  return <CompareClient />;
}
