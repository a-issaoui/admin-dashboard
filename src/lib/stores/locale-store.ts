import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setCookie } from 'cookies-next'
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
    setLocale: (locale: LocaleCode) => Promise<void>
    getCurrentLocale: () => LocaleConfig
    isRTL: () => boolean
}

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set, get) => ({
            // State
            current: DEFAULT_LOCALE,
            direction: 'ltr',
            isLoading: false,
            locales: LOCALES,

            // Actions
            setLocale: async (locale: LocaleCode) => {
                set({ isLoading: true })

                try {
                    const localeConfig = LOCALES.find(l => l.code === locale)
                    if (!localeConfig) {
                        throw new Error(`Locale ${locale} not supported`)
                    }

                    // Only set cookie - let middleware and next-intl handle the rest
                    setCookie(LOCALE_COOKIE, locale, {
                        maxAge: 365 * 24 * 60 * 60,
                        path: '/',
                        sameSite: 'lax'
                    })

                    // Update state
                    set({
                        current: locale,
                        direction: localeConfig.direction,
                        isLoading: false
                    })
                } catch (error) {
                    console.error('Failed to set locale:', error)
                    set({ isLoading: false })
                    throw error
                }
            },

            getCurrentLocale: () => {
                const { current } = get()
                return LOCALES.find(l => l.code === current) || LOCALES[0]
            },

            isRTL: () => {
                return get().direction === 'rtl'
            }
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