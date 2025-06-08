import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isAnalyze = process.env.ANALYZE === 'true';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
  },
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
    ],
  },
};

const bundleAnalyzerPlugin = withBundleAnalyzer({
  enabled: isAnalyze,
});

// Apply plugins
const configWithPlugins = isAnalyze
    ? bundleAnalyzerPlugin(withNextIntl(nextConfig))
    : withNextIntl(nextConfig);

export default configWithPlugins;