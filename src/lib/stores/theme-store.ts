// ============================================================================
// src/lib/stores/theme-store.ts - Theme management
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
}

interface ThemeActions {
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            // State
            theme: 'system',
            resolvedTheme: 'light',

            // Actions
            setTheme: (theme: Theme) => {
                let resolvedTheme: 'light' | 'dark' = 'light'

                if (theme === 'system') {
                    resolvedTheme = typeof window !== 'undefined' &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light'
                } else {
                    resolvedTheme = theme
                }

                // Update document
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.remove('light', 'dark')
                    document.documentElement.classList.add(resolvedTheme)
                    document.documentElement.setAttribute('data-theme', resolvedTheme)
                }

                set({ theme, resolvedTheme })
            },

            toggleTheme: () => {
                const { resolvedTheme } = get()
                const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
                get().setTheme(newTheme)
            }
        }),
        {
            name: 'theme-store',
            partialize: (state) => ({ theme: state.theme })
        }
    )
)