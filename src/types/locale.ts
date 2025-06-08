// ============================================================================
// src/types/locale.ts - Internationalization types
// ============================================================================

export type LocaleCode = 'en' | 'fr' | 'ar'

export interface LocaleConfig {
    code: LocaleCode
    name: string
    nativeName: string
    flag: string
    direction: 'ltr' | 'rtl'
}

export interface LocaleState {
    current: LocaleCode
    direction: 'ltr' | 'rtl'
    isLoading: boolean
}