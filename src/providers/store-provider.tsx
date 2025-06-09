// ============================================================================
// src/providers/store-provider.tsx - PRODUCTION-OPTIMIZED IMPLEMENTATION
// ============================================================================

'use client'

import { useLocale } from 'next-intl'
import * as React from 'react'
import { useLocaleStore, useThemeStore } from '@/lib/stores'
import type { LocaleCode } from '@/types/locale'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const locale = useLocale() as LocaleCode
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Direct store access for initialization
  const setLocale = useLocaleStore.getState().setLocale
  const setTheme = useThemeStore.getState().setTheme

  // Single initialization effect
  React.useLayoutEffect(() => {
    if (isInitialized) return

    // Initialize locale immediately
    setLocale(locale)

    // Initialize theme from storage or system preference
    const initializeTheme = () => {
      try {
        const saved = localStorage.getItem('theme-store')
        if (saved) {
          const parsed = JSON.parse(saved)
          return parsed.state?.theme || 'system'
        }
      } catch {
        // Silently fallback to system
      }
      return 'system'
    }

    setTheme(initializeTheme())

    // Update document attributes for RTL support
    const direction = locale === 'ar' ? 'rtl' : 'ltr'
    const root = document.documentElement

    root.lang = locale
    root.dir = direction
    root.setAttribute('data-locale', locale)
    root.setAttribute('data-direction', direction)

    setIsInitialized(true)
  }, [locale, setLocale, setTheme, isInitialized])

  // Render children immediately - no loading states
  return <>{children}</>
}