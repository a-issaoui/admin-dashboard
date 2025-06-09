// ============================================================================
// src/lib/stores/index.ts - FIXED TypeScript and import errors
// ============================================================================

import { getCookie } from 'cookies-next'
import * as React from 'react'
import type { LocaleCode } from '@/types/locale'
import { useLocaleStore } from './locale-store'
import { useSidebarStore } from './sidebar-store'
import { useThemeStore } from './theme-store'

// Export all stores and their hooks
export { useLocaleStore } from './locale-store'
export { useSidebarStore } from './sidebar-store'
export { useThemeStore } from './theme-store'

// Export locale hooks
export {
    useCurrentLocale,
    useDirection,
    useIsRTL,
    useIsTransitioning,
    useLocales,
    useSetLocaleAsync,
    useSetLocale
} from './locale-store'

// Export sidebar hooks
export {
    useSidebarData,
    useSidebarProcessedData,
    useSidebarCollapsedStates,
    useIsSidebarDataLoaded,
    useSidebarNotifications,
    useSidebarActiveItems,
    useSidebarError,
    useSidebarLoading
} from './sidebar-store'

export type { LocaleCode, LocaleConfig } from '@/types/locale'
export type { SidebarData, SidebarMenuItem, SidebarGroup } from '@/types/sidebar'

// Store initialization hook with better performance
export function useStoreInitialization() {
    const setTheme = useThemeStore(state => state.setTheme)
    const setLocale = useLocaleStore(state => state.setLocale)
    const [isInitialized, setIsInitialized] = React.useState(false)

    React.useLayoutEffect(() => {
        if (isInitialized) return

        // Initialize theme from system preference
        const initTheme = () => {
            try {
                const savedTheme = localStorage.getItem('theme-store')
                if (savedTheme) {
                    const parsed = JSON.parse(savedTheme)
                    return parsed.state?.theme || 'system'
                }
            } catch {
                // Silently fallback
            }
            return 'system'
        }

        // Initialize locale from cookie
        const initLocale = (): LocaleCode => {
            try {
                const cookieLocale = getCookie('locale') as string
                if (cookieLocale && ['en', 'fr', 'ar'].includes(cookieLocale)) {
                    return cookieLocale as LocaleCode
                }
                return 'en'
            } catch {
                return 'en'
            }
        }

        // Set both immediately
        setTheme(initTheme())
        setLocale(initLocale())
        setIsInitialized(true)
    }, [setTheme, setLocale, isInitialized])

    return isInitialized
}

// Performance monitoring hook for stores
export function useStorePerformance() {
    const localeStore = useLocaleStore()
    const sidebarStore = useSidebarStore()
    const themeStore = useThemeStore()

    return React.useMemo(() => ({
        locale: {
            isLoading: localeStore.isLoading,
            isTransitioning: localeStore.isTransitioning,
            current: localeStore.current
        },
        sidebar: {
            isLoading: sidebarStore.isLoading,
            isDataLoaded: sidebarStore.data.length > 0,
            itemCount: sidebarStore.data.length
        },
        theme: {
            current: themeStore.theme,
            resolved: themeStore.resolvedTheme
        }
    }), [localeStore, sidebarStore, themeStore])
}

// Batch store updates for better performance
export function useBatchStoreUpdates() {
    const setLocale = useLocaleStore(state => state.setLocale)
    const setTheme = useThemeStore(state => state.setTheme)
    const setSidebarData = useSidebarStore(state => state.setData)

    return React.useCallback((updates: {
        locale?: LocaleCode
        theme?: Parameters<typeof setTheme>[0]
        sidebarData?: Parameters<typeof setSidebarData>[0]
    }) => {
        // Batch all updates in a single frame
        React.startTransition(() => {
            if (updates.locale) setLocale(updates.locale)
            if (updates.theme) setTheme(updates.theme)
            if (updates.sidebarData) setSidebarData(updates.sidebarData)
        })
    }, [setLocale, setTheme, setSidebarData])
}