// ============================================================================
// src/lib/stores/index.ts - FIXED with all exports
// ============================================================================

import { getCookie } from 'cookies-next'
import * as React from 'react'
import { useLocaleStore } from './locale-store'
import { useThemeStore } from './theme-store'

// Export all stores and their hooks
export { useLocaleStore } from './locale-store'
export { useSidebarStore } from './sidebar-store'
export { useThemeStore } from './theme-store'

// Export optimized locale hooks
export {
    useCurrentLocale,
    useDirection,
    useIsRTL,
    useIsTransitioning
} from './locale-store'

// Export optimized sidebar hooks
export {
    useSidebarData,
    useSidebarProcessedData,
    useSidebarCollapsedStates,
    useIsSidebarDataLoaded
} from './sidebar-store'

export type { LocaleCode, LocaleConfig } from '@/types/locale'
export type { SidebarData, SidebarMenuItem, SidebarGroup } from '@/types/sidebar'

// Store initialization hook
export function useStoreInitialization() {
    const setTheme = useThemeStore(state => state.setTheme)
    const setLocale = useLocaleStore(state => state.setLocale)

    React.useEffect(() => {
        // Initialize theme from system preference
        const savedTheme = localStorage.getItem('theme-store')
        if (savedTheme) {
            try {
                const parsed = JSON.parse(savedTheme)
                setTheme(parsed.state?.theme || 'system')
            } catch {
                setTheme('system')
            }
        } else {
            setTheme('system')
        }

        // Initialize locale from cookie
        const cookieLocale = getCookie('locale') as string
        if (cookieLocale) {
            setLocale(cookieLocale as Parameters<typeof setLocale>[0])
        }
    }, [setTheme, setLocale])
}