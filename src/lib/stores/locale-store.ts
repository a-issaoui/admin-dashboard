// ============================================================================
// src/lib/stores/locale-store.ts - FIXED unused variable
// ============================================================================

import { setCookie } from 'cookies-next'
import { create } from 'zustand'
import { persist , subscribeWithSelector } from 'zustand/middleware'
import { notifications } from '@/components/ui/notification-system'
import { errorManager } from '@/lib/error-management'
import type { LocaleCode, LocaleConfig } from '@/types/locale'
import { TypedError } from '@/types/common';

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

interface LocaleState {
    current: LocaleCode
    direction: 'ltr' | 'rtl'
    isLoading: boolean
    isTransitioning: boolean
    lastError: string | null
    locales: LocaleConfig[]
    messageCache: Map<LocaleCode, Record<string, unknown>>
    pendingLocale: LocaleCode | null
}

interface LocaleActions {
    setLocale: (locale: LocaleCode, options?: { silent?: boolean }) => Promise<void>
    setLocaleSync: (locale: LocaleCode) => void
    preloadLocale: (locale: LocaleCode) => Promise<void>
    clearError: () => void
    getCurrentLocale: () => LocaleConfig
    isRTL: () => boolean
    getAvailableLocales: () => LocaleConfig[]
    validateLocale: (locale: string) => LocaleCode | null
}

type LocaleStore = LocaleState & LocaleActions

const COOKIE_CONFIG = {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
}

export const useLocaleStore = create<LocaleStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                current: 'en',
                direction: 'ltr',
                isLoading: false,
                isTransitioning: false,
                lastError: null,
                locales: LOCALES,
                messageCache: new Map(),
                pendingLocale: null,

                setLocale: async (locale: LocaleCode, options = {}) => {
                    const state = get()

                    const validatedLocale = state.validateLocale(locale)
                    if (!validatedLocale) {
                        const error = `Invalid locale: ${locale}`
                        set({ lastError: error })
                        if (!options.silent) {
                            notifications.error('Language change failed', {
                                description: 'The selected language is not supported.'
                            })
                        }
                        throw new Error(error)
                    }

                    if (validatedLocale === state.current && !state.isTransitioning) {
                        return
                    }

                    set({
                        isTransitioning: true,
                        pendingLocale: validatedLocale,
                        lastError: null
                    })

                    try {
                        await state.preloadLocale(validatedLocale)

                        const localeConfig = LOCALES.find(l => l.code === validatedLocale)!
                        const newDirection = localeConfig.direction

                        try {
                            setCookie('locale', validatedLocale, COOKIE_CONFIG)
                        } catch (cookieError: unknown) {
                            console.warn('Failed to set locale cookie:', (cookieError as Error).message)
                        }

                        if (typeof document !== 'undefined') {
                            document.documentElement.lang = validatedLocale
                            document.documentElement.dir = newDirection
                            document.documentElement.setAttribute('data-locale', validatedLocale)
                            document.documentElement.setAttribute('data-direction', newDirection)
                        }

                        set({
                            current: validatedLocale,
                            direction: newDirection,
                            isTransitioning: false,
                            pendingLocale: null,
                            lastError: null
                        })

                        if (!options.silent) {
                            const localeConfig = LOCALES.find(l => l.code === validatedLocale)
                            notifications.success('Language changed', {
                                description: `Switched to ${localeConfig?.nativeName || validatedLocale}`,
                                duration: 2000
                            })
                        }

                    } catch (error: unknown) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

                        set({
                            isTransitioning: false,
                            pendingLocale: null,
                            lastError: errorMessage
                        })

                        await errorManager.handleError(
                            new TypedError(
                                `Failed to set locale to ${validatedLocale}: ${errorMessage}`,
                                'LOCALE_CHANGE_FAILED',
                                500,
                                errorManager.createErrorContext('LocaleStore', 'setLocale', {
                                    targetLocale: validatedLocale,
                                    currentLocale: state.current
                                })
                            )
                        )

                        if (!options.silent) {
                            notifications.error('Language change failed', {
                                description: 'Please try again or contact support if the problem persists.',
                                action: {
                                    label: 'Retry',
                                    onClick: () => state.setLocale(validatedLocale, options)
                                }
                            })
                        }

                        throw error
                    }
                },

                setLocaleSync: (locale: LocaleCode) => {
                    const state = get()
                    const validatedLocale = state.validateLocale(locale)

                    if (!validatedLocale) {
                        console.warn(`Invalid locale for sync operation: ${locale}`)
                        return
                    }

                    const localeConfig = LOCALES.find(l => l.code === validatedLocale)!

                    try {
                        setCookie('locale', validatedLocale, COOKIE_CONFIG)
                    } catch (error: unknown) {
                        console.warn('Failed to set locale cookie during sync:', (error as Error).message)
                    }

                    set({
                        current: validatedLocale,
                        direction: localeConfig.direction,
                        lastError: null
                    })
                },

                preloadLocale: async (locale: LocaleCode) => {
                    const state = get()

                    if (state.messageCache.has(locale)) {
                        return
                    }

                    try {
                        set({ isLoading: true })

                        const timeoutPromise = new Promise((_, reject) => {
                            setTimeout(() => reject(new Error('Locale loading timeout')), 5000)
                        })

                        const loadPromise = import(`@/i18n/messages/${locale}.json`)

                        const messages = await Promise.race([loadPromise, timeoutPromise])

                        const newCache = new Map(state.messageCache)
                        newCache.set(locale, (messages as any).default || messages)

                        set({
                            messageCache: newCache,
                            isLoading: false
                        })

                    } catch (error: unknown) {
                        set({ isLoading: false })

                        const errorMessage = error instanceof Error ? error.message : 'Failed to load locale'
                        await errorManager.handleError(
                            new TypedError(
                                `Failed to preload locale ${locale}: ${errorMessage}`,
                                'LOCALE_PRELOAD_FAILED',
                                500,
                                errorManager.createErrorContext('LocaleStore', 'preloadLocale', { locale })
                            )
                        )

                        throw error
                    }
                },

                clearError: () => set({ lastError: null }),

                getCurrentLocale: () => {
                    const state = get()
                    return LOCALES.find(l => l.code === state.current) || LOCALES[0]!
                },

                isRTL: () => get().direction === 'rtl',

                getAvailableLocales: () => [...LOCALES],

                validateLocale: (locale: string): LocaleCode | null => {
                    const validLocales = LOCALES.map(l => l.code)
                    return validLocales.includes(locale as LocaleCode) ? locale as LocaleCode : null
                }
            }),
            {
                name: 'production-locale-store',
                partialize: (state) => ({
                    current: state.current,
                    direction: state.direction,
                    messageCache: Array.from(state.messageCache.entries())
                }),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        const cacheArray = state.messageCache as unknown
                        if (Array.isArray(cacheArray)) {
                            state.messageCache = new Map(cacheArray as [LocaleCode, Record<string, unknown>][])
                        } else {
                            state.messageCache = new Map()
                        }
                    }
                },
                version: 2
            }
        )
    )
)

// Exported hooks for component consumption
export const useCurrentLocale = () => useLocaleStore(state => state.current)
export const useDirection = () => useLocaleStore(state => state.direction)
export const useIsRTL = () => useLocaleStore(state => state.direction === 'rtl')
export const useIsTransitioning = () => useLocaleStore(state => state.isTransitioning)
export const useLocaleError = () => useLocaleStore(state => state.lastError)
export const useLocales = () => useLocaleStore(state => state.locales)
export const useSetLocaleAsync = () => useLocaleStore(state => state.setLocale)
export const useSetLocale = () => useLocaleStore(state => state.setLocaleSync)
export const usePreloadLocale = () => useLocaleStore(state => state.preloadLocale)
export const useClearLocaleError = () => useLocaleStore(state => state.clearError)