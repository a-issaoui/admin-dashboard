// ============================================================================
// src/providers/store-provider.tsx - OPTIMIZED with performance monitoring (FIXED)
// ============================================================================

'use client'

import { useLocale } from 'next-intl'
import * as React from 'react'
import { useRenderPerformance } from '@/hooks/use-performance'
import { useLocaleStore, useThemeStore } from '@/lib/stores'
import type { LocaleCode } from '@/types/locale'

interface StoreProviderProps {
  children: React.ReactNode
}

function StoreProviderInner({ children }: StoreProviderProps) {
  useRenderPerformance('StoreProvider')

  const locale = useLocale() as LocaleCode
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Get stable references to prevent unnecessary re-renders
  const setLocale = React.useCallback(
      (locale: LocaleCode) => useLocaleStore.getState().setLocale(locale),
      []
  )

  const setTheme = React.useCallback(
      (theme: 'light' | 'dark' | 'system') => useThemeStore.getState().setTheme(theme),
      []
  )

  // Initialize stores only once
  React.useEffect(() => {
    if (isInitialized) return

    const initializeStores = async () => {
      try {
        // Initialize locale from next-intl
        await setLocale(locale)

        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme-store')
        if (savedTheme) {
          try {
            const parsed = JSON.parse(savedTheme)
            await setTheme(parsed.state?.theme || 'system')
          } catch {
            await setTheme('system')
          }
        } else {
          await setTheme('system')
        }

        // Update document attributes for better CSS support
        const direction = locale === 'ar' ? 'rtl' : 'ltr'
        const root = document.documentElement

        // Use batch updates to prevent layout thrashing
        requestAnimationFrame(() => {
          root.lang = locale
          root.dir = direction
          root.setAttribute('data-locale', locale)
          root.setAttribute('data-direction', direction)
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize stores:', error)
        // Set initialized anyway to prevent infinite loops
        setIsInitialized(true)
      }
    }

    initializeStores()
  }, [locale, setLocale, setTheme, isInitialized])

  // Show loading state while initializing
  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    )
  }

  return children
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }>
        <StoreProviderInner>
          {children}
        </StoreProviderInner>
      </React.Suspense>
  )
}