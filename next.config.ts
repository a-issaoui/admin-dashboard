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
  turbopack: {},
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
  webpack: null,
};

const bundleAnalyzerPlugin = withBundleAnalyzer({
  enabled: isAnalyze,
});

// Apply plugins and ensure deprecated turbo property is not set
const configWithPlugins = isAnalyze
    ? bundleAnalyzerPlugin(withNextIntl(nextConfig))
    : withNextIntl(nextConfig);

// Clean up any deprecated experimental.turbo property that plugins might have added
if (configWithPlugins.experimental?.turbo) {
  delete configWithPlugins.experimental.turbo;
}

export default configWithPlugins;