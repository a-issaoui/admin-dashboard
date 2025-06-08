import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isAnalyze = process.env.ANALYZE === 'true';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,

  // Image optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: isProd ? 86400 : 60, // 24h in prod, 1m in dev
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental optimizations
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

    // Performance features
    optimizeCss: isProd,
    webVitalsAttribution: ['CLS', 'LCP'],

    // Build optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    // Remove bundlePagesRouterDependencies as it doesn't exist in Next.js 15
    optimizeServerReact: true,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@phosphor-icons|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 20,
            },
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'animations',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }

    // Bundle analyzer for client-side only
    if (!isServer && isAnalyze) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-analyzer-report.html',
          })
      );
    }

    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Headers for performance and security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // Redirects for better UX
  redirects: async () => [
    {
      source: '/dashboard',
      destination: '/admin',
      permanent: true,
    },
  ],

  // Type checking in build
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint in build
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
};

// Bundle analyzer plugin
const bundleAnalyzerPlugin = withBundleAnalyzer({
  enabled: isAnalyze,
  openAnalyzer: false,
});

// Apply plugins conditionally
const configWithPlugins = isAnalyze
    ? bundleAnalyzerPlugin(withNextIntl(nextConfig))
    : withNextIntl(nextConfig);

export default configWithPlugins;