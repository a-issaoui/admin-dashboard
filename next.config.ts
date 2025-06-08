import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isAnalyze = process.env.ANALYZE === 'true';

// Note: withBundleAnalyzer is a Webpack plugin and will not run with Turbopack.
// To analyze your bundle, you must build with Webpack (e.g., 'pnpm build').
const bundleAnalyzerPlugin = withBundleAnalyzer({
  enabled: isAnalyze,
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  output: 'standalone',

  // swcMinify is true by default in Next.js 15.
  // compress is true by default for production builds.
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 86400 : 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Turbopack-specific configurations for development (`next dev --turbopack`)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features
  experimental: {
    // optimizeCss is now default. optimizeServerReact is also default.
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
  },

  // Add SVGR loader for Webpack builds (e.g., `next build`)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

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
  ],

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
};

// Apply plugins. Bundle Analyzer is only applied for Webpack builds.
export default bundleAnalyzerPlugin(withNextIntl(nextConfig));