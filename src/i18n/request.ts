// ============================================================================
// src/i18n/request.ts - Server-side i18n setup (FIXED)
// ============================================================================

import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALES } from './config'

export default getRequestConfig(async () => {
    // Get locale from headers (set by middleware)
    const headersList = await headers()
    const locale = headersList.get('x-locale') || DEFAULT_LOCALE

    // Validate locale
    const validLocale = LOCALES.includes(locale as any) ? locale : DEFAULT_LOCALE

    return {
        locale: validLocale,
        messages: (await import(`./messages/${validLocale}.json`)).default,
        timeZone: 'Africa/Tunis', // Tunisia timezone
        now: new Date()
    }
})