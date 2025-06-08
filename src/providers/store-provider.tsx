// ============================================================================
// src/providers/store-provider.tsx
// ============================================================================

'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import { useLocaleStore, useThemeStore } from '@/lib/stores'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const locale = useLocale()
  const setLocale = useLocaleStore(state => state.setLocale)
  const setTheme = useThemeStore(state => state.setTheme)

  React.useEffect(() => {
    // Initialize locale from next-intl
    setLocale(locale as any)

    // Initialize theme
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

    // Update document attributes for better CSS support
    const direction = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    document.documentElement.dir = direction
    document.documentElement.setAttribute('data-locale', locale)
    document.documentElement.setAttribute('data-direction', direction)
  }, [locale, setLocale, setTheme])

  return <>{children}</>
}