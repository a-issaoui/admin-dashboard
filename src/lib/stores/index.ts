// ============================================================================
// src/lib/stores/index.ts - FINAL PRODUCTION VERSION
// ============================================================================

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