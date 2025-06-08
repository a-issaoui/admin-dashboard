// ============================================================================
// src/i18n/request.ts - Server-side i18n setup
// ============================================================================

import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE } from './config'
import type { LocaleCode } from '@/types/locale'

export default getRequestConfig(async () => {
    const cookieStore = await cookies()
    const locale = (cookieStore.get('locale')?.value as LocaleCode) || DEFAULT_LOCALE

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
        timeZone: 'Africa/Tunis', // Tunisia timezone
        now: new Date()
    }
})