// ============================================================================
// src/lib/stores/locale-store.ts - SIMPLIFIED APPROACH
// ============================================================================

import { setCookie } from 'cookies-next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocaleCode, LocaleConfig, LocaleState } from '@/types/locale'

const LOCALES: LocaleConfig[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        direction: 'ltr'
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        direction: 'ltr'
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇹🇳',
        direction: 'rtl'
    }
]

interface LocaleStore extends LocaleState {
    locales: LocaleConfig[]
    isTransitioning: boolean
    setLocale: (locale: LocaleCode) => void
    setLocaleAsync: (locale: LocaleCode) => Promise<void>
    getCurrentLocale: () => LocaleConfig
    isRTL: () => boolean
}

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set, get) => ({
            // State
            current: 'en',
            direction: 'ltr',
            isLoading: false,
            isTransitioning: false,
            locales: LOCALES,

            // Single, simple locale setter
            setLocale: (locale: LocaleCode) => {
                const localeConfig = LOCALES.find(l => l.code === locale)
                if (!localeConfig) return

                // Update store state only
                set({
                    current: locale,
                    direction: localeConfig.direction,
                    isLoading: false,
                    isTransitioning: false
                })

                // Handle cookie with error handling
                try {
                    setCookie('locale', locale, {
                        maxAge: 365 * 24 * 60 * 60,
                        path: '/',
                        sameSite: 'lax'
                    })
                } catch (error) {
                    console.warn('Failed to set locale cookie:', error)
                }
            },

            // Simplified async setter for compatibility
            setLocaleAsync: async (locale: LocaleCode) => {
                const { setLocale } = get()
                setLocale(locale)
                // Simple promise resolution for compatibility
                return Promise.resolve()
            },

            getCurrentLocale: () => {
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

// Simple selectors
export const useCurrentLocale = () => useLocaleStore(state => state.current)
export const useDirection = () => useLocaleStore(state => state.direction)
export const useIsRTL = () => useLocaleStore(state => state.direction === 'rtl')
export const useIsTransitioning = () => useLocaleStore(state => state.isTransitioning)
export const useLocales = () => useLocaleStore(state => state.locales)
export const useSetLocale = () => useLocaleStore(state => state.setLocale)
export const useSetLocaleAsync = () => useLocaleStore(state => state.setLocaleAsync)