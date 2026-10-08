import React from 'react';
import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login & Sign Up | Kochuvila Agencies',
  description: 'Sign in or register for Kochuvila Agencies to track orders, warranties, and manage delivery addresses in Kerala.',
};

export default function LoginPage() {
  return <LoginClient />;
}
