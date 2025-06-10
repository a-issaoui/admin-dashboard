import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      '@radix-ui/react-avatar'
    ],
    optimizeCss: true,
    serverComponentsExternalPackages: ['@phosphor-icons/react']
  },

  // Simplified headers for security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ]
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ]
    }
  ],

  // TypeScript and ESLint configuration
  typescript: {
    ignoreBuildErrors: false
  },

  eslint: {
    ignoreDuringBuilds: false
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },

  // Output configuration
  output: 'standalone',

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  }
}

export default withNextIntl(nextConfig)