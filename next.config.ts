import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
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
      '@radix-ui/react-tooltip'
    ]
  },

  // Enable static optimization
  output: 'standalone',

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
  },

  // Bundle analyzer (optional)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
          new (require('@next/bundle-analyzer'))({
            enabled: true,
          })
      )
      return config
    },
  }),
};

export default withNextIntl(nextConfig);