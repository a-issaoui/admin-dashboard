// ============================================================================
// src/stores/locale-store.ts - Simplified Locale Management
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setCookie } from 'cookies-next'
import type { LocaleCode, LocaleConfig } from '@/types'

// Static locale configurations
const LOCALES: LocaleConfig[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇹🇳', direction: 'rtl' }
]

interface LocaleState {
    current: LocaleCode
    direction: 'ltr' | 'rtl'
    locales: LocaleConfig[]
}

interface LocaleActions {
    setLocale: (locale: LocaleCode) => void
    getCurrentConfig: () => LocaleConfig
    isRTL: () => boolean
}

type LocaleStore = LocaleState & LocaleActions

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set, get) => ({
            // State
            current: 'en',
            direction: 'ltr',
            locales: LOCALES,

            // Actions
            setLocale: (locale: LocaleCode) => {
                const config = LOCALES.find(l => l.code === locale)
                if (!config) {
                    console.warn(`Invalid locale: ${locale}`)
                    return
                }

                // Update store
                set({
                    current: locale,
                    direction: config.direction
                })

                // Update cookie
                try {
                    setCookie('locale', locale, {
                        maxAge: 365 * 24 * 60 * 60, // 1 year
                        path: '/',
                        sameSite: 'lax'
                    })
                } catch (error) {
                    console.warn('Failed to set locale cookie:', error)
                }

                // Update document attributes
                if (typeof document !== 'undefined') {
                    document.documentElement.lang = locale
                    document.documentElement.dir = config.direction
                    document.documentElement.setAttribute('data-locale', locale)
                }
            },

            getCurrentConfig: () => {
                const { current } = get()
                return LOCALES.find(l => l.code === current) || LOCALES[0]!
            },

            isRTL: () => get().direction === 'rtl'
        }),
        {
            name: 'locale-store',
            partialize: (state) => ({
                current: state.current,
                direction: state.direction
            })
        }
    )
)

// Simplified selectors
export const useCurrentLocale = () => useLocaleStore(state => state.current)
export const useDirection = () => useLocaleStore(state => state.direction)
export const useIsRTL = () => useLocaleStore(state => state.direction === 'rtl')
export const useLocales = () => useLocaleStore(state => state.locales)
export const useSetLocale = () => useLocaleStore(state => state.setLocale)