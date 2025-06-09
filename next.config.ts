// ============================================================================
// next.config.ts - OPTIMIZED PRODUCTION CONFIGURATION
// ============================================================================

import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Essential production settings
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Optimized image handling for business applications
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle optimization for performance
  experimental: {
    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
      'next-intl',
      'zustand',
      'framer-motion'
    ],
    optimizeCss: true
  },

  // Security and performance headers for business environments
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/(.*).css',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],

  // TypeScript configuration for business reliability
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint enforcement for code quality
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Production optimization settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'],
    } : false,
  },

  // Output configuration for deployment flexibility
  output: 'standalone',

  // Performance monitoring in production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  }
};

export default withNextIntl(nextConfig);