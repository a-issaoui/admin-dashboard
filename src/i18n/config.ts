// ============================================================================
// src/i18n/config.ts - i18n configuration
// ============================================================================

import type { LocaleCode } from '@/types/locale'

export const LOCALES: LocaleCode[] = ['en', 'fr', 'ar']
export const DEFAULT_LOCALE: LocaleCode = 'en'

export const LOCALE_LABELS = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية'
} as const