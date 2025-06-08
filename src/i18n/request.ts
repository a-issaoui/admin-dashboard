// ============================================================================
// src/i18n/request.ts - Server-side i18n setup
// ============================================================================

import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import type { LocaleCode } from '@/types/locale'
import { DEFAULT_LOCALE } from './config'

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