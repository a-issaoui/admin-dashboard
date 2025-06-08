// ============================================================================
// src/lib/stores/locale-store.ts - OPTIMIZED for smooth transitions
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

const DEFAULT_LOCALE: LocaleCode = 'en'
const LOCALE_COOKIE = 'locale'

interface LocaleStore extends LocaleState {
    locales: LocaleConfig[]
    isTransitioning: boolean
    setLocale: (locale: LocaleCode) => void
    setLocaleAsync: (locale: LocaleCode) => Promise<void>
    getCurrentLocale: () => LocaleConfig
    isRTL: () => boolean
    startTransition: () => void
    endTransition: () => void
}

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set, get) => ({
            // State
            current: DEFAULT_LOCALE,
            direction: 'ltr',
            isLoading: false,
            isTransitioning: false,
            locales: LOCALES,

            // Synchronous setter for immediate updates
            setLocale: (locale: LocaleCode) => {
                const localeConfig = LOCALES.find(l => l.code === locale)
                if (!localeConfig) return

                // Update store immediately
                set({
                    current: locale,
                    direction: localeConfig.direction,
                    isLoading: false,
                    isTransitioning: false
                })

                // Set cookie
                setCookie(LOCALE_COOKIE, locale, {
                    maxAge: 365 * 24 * 60 * 60,
                    path: '/',
                    sameSite: 'lax'
                })

                // Update document attributes immediately
                if (typeof document !== 'undefined') {
                    const root = document.documentElement
                    root.lang = locale
                    root.dir = localeConfig.direction
                    root.setAttribute('data-locale', locale)
                    root.setAttribute('data-direction', localeConfig.direction)
                }
            },

            // Async setter for transitions (only when needed)
            setLocaleAsync: async (locale: LocaleCode) => {
                const currentLocale = get().current
                if (currentLocale === locale) return

                const localeConfig = LOCALES.find(l => l.code === locale)
                if (!localeConfig) throw new Error(`Locale ${locale} not supported`)

                // Only show transition if direction is changing
                const currentDirection = get().direction
                const needsTransition = currentDirection !== localeConfig.direction

                if (needsTransition) {
                    set({ isTransitioning: true })
                }

                try {
                    // Set cookie first
                    setCookie(LOCALE_COOKIE, locale, {
                        maxAge: 365 * 24 * 60 * 60,
                        path: '/',
                        sameSite: 'lax'
                    })

                    // Update document with transition class only if needed
                    if (typeof document !== 'undefined') {
                        const root = document.documentElement

                        if (needsTransition) {
                            root.classList.add('locale-transitioning')
                        }

                        // Update attributes
                        root.lang = locale
                        root.dir = localeConfig.direction
                        root.setAttribute('data-locale', locale)
                        root.setAttribute('data-direction', localeConfig.direction)

                        // Remove transition class after a shorter duration
                        if (needsTransition) {
                            setTimeout(() => {
                                root.classList.remove('locale-transitioning')
                                set({ isTransitioning: false })
                            }, 200) // Reduced from 300ms
                        }
                    }

                    // Update state
                    set({
                        current: locale,
                        direction: localeConfig.direction,
                        isLoading: false,
                        isTransitioning: needsTransition ? get().isTransitioning : false
                    })

                } catch (error) {
                    console.error('Failed to set locale:', error)
                    set({ isLoading: false, isTransitioning: false })
                    throw error
                }
            },

            getCurrentLocale: () => {
                const { current } = get()
                return LOCALES.find(l => l.code === current) || LOCALES[0]!
            },

            isRTL: () => get().direction === 'rtl',
            startTransition: () => set({ isTransitioning: true }),
            endTransition: () => set({ isTransitioning: false })
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

// Optimized selectors
export const useCurrentLocale = () => useLocaleStore(state => state.current)
export const useDirection = () => useLocaleStore(state => state.direction)
export const useIsRTL = () => useLocaleStore(state => state.direction === 'rtl')
export const useIsTransitioning = () => useLocaleStore(state => state.isTransitioning)