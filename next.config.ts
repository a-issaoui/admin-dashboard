// ============================================================================
// next.config.ts - Updated with next-intl
// ============================================================================

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
};

export default withNextIntl(nextConfig);
