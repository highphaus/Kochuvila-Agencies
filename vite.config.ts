import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || env.NEXT_PUBLIC_API_URL || '/api';
  const whatsappNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919745111141';

  return {
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
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(apiUrl),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
      'process.env.NEXT_PUBLIC_WHATSAPP_NUMBER': JSON.stringify(whatsappNumber),
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
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
  };
});
