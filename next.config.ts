// ============================================================================
// next.config.ts - OPTIMIZED for better performance
// ============================================================================

import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isAnalyze = process.env.ANALYZE === 'true';

const bundleAnalyzerPlugin = withBundleAnalyzer({
  enabled: isAnalyze,
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  output: 'standalone',

  // OPTIMIZED: Better performance settings
  poweredByHeader: false,
  compress: true,

  // OPTIMIZED: Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 86400 : 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // OPTIMIZED: Add unoptimized for development
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // OPTIMIZED: Turbopack configurations
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // OPTIMIZED: Experimental features for performance
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
      'framer-motion',
      'next-intl',
      'zustand'
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
    // OPTIMIZED: Enable optimizations (removed ppr for stable version)
    optimizeCss: true,
    optimizeServerReact: true,
    // Note: ppr requires Next.js canary - removed for stable version
  },

  // OPTIMIZED: Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // SVG loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // OPTIMIZED: Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // OPTIMIZED: Better caching headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
    },
    {
      source: '/_next/static/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    // OPTIMIZED: Cache fonts and icons
    {
      source: '/fonts/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/icons/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    },
  ],

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },

  // OPTIMIZED: Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default bundleAnalyzerPlugin(withNextIntl(nextConfig));