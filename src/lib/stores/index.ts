// ============================================================================
// src/lib/stores/index.ts - Store exports
// ============================================================================

export { useLocaleStore } from './locale-store'
export { useSidebarStore } from './sidebar-store'
export { useThemeStore } from './theme-store'

// Export types
export type { LocaleCode, LocaleConfig } from '@/types/locale'
export type { SidebarData, SidebarMenuItem, SidebarGroup } from '@/types/sidebar'

// Store initialization hook
export function useStoreInitialization() {
    const setTheme = useThemeStore(state => state.setTheme)
    const setLocale = useLocaleStore(state => state.setLocale)

    React.useEffect(() => {
        // Initialize theme from system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'

        // Get saved theme or use system
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
        const cookieLocale = getCookie('locale') as LocaleCode
        if (cookieLocale) {
            setLocale(cookieLocale)
        }
    }, [setTheme, setLocale])
}