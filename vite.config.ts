import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
      'next/image': path.resolve(__dirname, './src/shims/next-image.tsx'),
      'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.ts'),
      'next/dynamic': path.resolve(__dirname, './src/shims/next-dynamic.tsx'),
      'next/font/google': path.resolve(__dirname, './src/shims/next-font.ts'),
    },
  },
  define: {
    'process.env': {
      NEXT_PUBLIC_API_URL: '/api',
      NEXT_PUBLIC_WHATSAPP_NUMBER: '919745111141',
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify('/api'),
    'process.env.NEXT_PUBLIC_WHATSAPP_NUMBER': JSON.stringify('919745111141'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});
