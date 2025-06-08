// ============================================================================
// src/lib/stores/locale-store.ts - OPTIMIZED
// ============================================================================

import { setCookie } from 'cookies-next'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
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
    setLocale: (locale: LocaleCode) => Promise<void>
    getCurrentLocale: () => LocaleConfig
    isRTL: () => boolean
    startTransition: () => void
    endTransition: () => void
}

export const useLocaleStore = create<LocaleStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // State
                current: DEFAULT_LOCALE,
                direction: 'ltr',
                isLoading: false,
                isTransitioning: false,
                locales: LOCALES,

                // Actions
                setLocale: async (locale: LocaleCode) => {
                    const currentLocale = get().current
                    if (currentLocale === locale) return

                    set({ isLoading: true, isTransitioning: true })

                    try {
                        const localeConfig = LOCALES.find(l => l.code === locale)
                        if (!localeConfig) {
                            throw new Error(`Locale ${locale} not supported`)
                        }

                        // Set cookie immediately
                        setCookie(LOCALE_COOKIE, locale, {
                            maxAge: 365 * 24 * 60 * 60,
                            path: '/',
                            sameSite: 'lax'
                        })

                        // Update document attributes immediately for CSS
                        if (typeof document !== 'undefined') {
                            const root = document.documentElement

                            // Add transition class
                            root.classList.add('locale-transitioning')

                            // Update attributes
                            root.lang = locale
                            root.dir = localeConfig.direction
                            root.setAttribute('data-locale', locale)
                            root.setAttribute('data-direction', localeConfig.direction)

                            // Remove transition class after animation
                            setTimeout(() => {
                                root.classList.remove('locale-transitioning')
                                set({ isTransitioning: false })
                            }, 300)
                        }

                        // Update state
                        set({
                            current: locale,
                            direction: localeConfig.direction,
                            isLoading: false
                        })

                    } catch (error) {
                        console.error('Failed to set locale:', error)
                        set({ isLoading: false, isTransitioning: false })
                        throw error
                    }
                },

                getCurrentLocale: () => {
                    const { current } = get()
                    const locale = LOCALES.find(l => l.code === current)
                    return locale || LOCALES[0]!
                },

                isRTL: () => {
                    return get().direction === 'rtl'
                },

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
)

// Optimized hooks for specific data
export const useCurrentLocale = () => useLocaleStore(state => state.current)
export const useDirection = () => useLocaleStore(state => state.direction)
export const useIsRTL = () => useLocaleStore(state => state.direction === 'rtl')
export const useIsTransitioning = () => useLocaleStore(state => state.isTransitioning)