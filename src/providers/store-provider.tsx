// ============================================================================
// src/providers/store-provider.tsx - OPTIMIZED for performance
// ============================================================================

'use client'

import { useLocale } from 'next-intl'
import * as React from 'react'
import { useLocaleStore, useThemeStore } from '@/lib/stores'
import type { LocaleCode } from '@/types/locale'

interface StoreProviderProps {
  children: React.ReactNode
}

// Move initialization logic outside component to prevent re-creation
const initializeTheme = () => {
  if (typeof window === 'undefined') return 'system'

  try {
    const saved = localStorage.getItem('theme-store')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.state?.theme || 'system'
    }
  } catch {
    // Fallback silently
  }
  return 'system'
}

const updateDocumentAttributes = (locale: LocaleCode, direction: 'ltr' | 'rtl') => {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Batch DOM updates in a single frame
  requestAnimationFrame(() => {
    root.lang = locale
    root.dir = direction
    root.setAttribute('data-locale', locale)
    root.setAttribute('data-direction', direction)
  })
}

export function StoreProvider({ children }: StoreProviderProps) {
  const locale = useLocale() as LocaleCode
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Get store actions as stable references
  const setLocale = useLocaleStore.getState().setLocale
  const setTheme = useThemeStore.getState().setTheme

  // Initialize stores synchronously on mount
  React.useLayoutEffect(() => {
    if (isInitialized) return

    // Initialize locale immediately
    setLocale(locale)

    // Initialize theme immediately
    const theme = initializeTheme()
    setTheme(theme)

    // Update document attributes
    const direction = locale === 'ar' ? 'rtl' : 'ltr'
    updateDocumentAttributes(locale, direction)

    setIsInitialized(true)
  }, [locale, setLocale, setTheme, isInitialized])

  // Don't show loading state - render immediately
  return <>{children}</>
}