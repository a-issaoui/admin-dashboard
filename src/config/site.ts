// src/config/site.ts
import { env } from './env'

export const siteConfig = {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: 'Comprehensive education management system',
    url: env.NEXT_PUBLIC_APP_URL,
    ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
    links: {
        github: 'https://github.com/yourusername/educasoft',
    },
    api: {
        baseUrl: env.NEXT_PUBLIC_API_URL,
        version: 'v1',
    },
}

export type SiteConfig = typeof siteConfig