// ============================================================================
// src/components/layout/admin/sidebar/components/locale-selector.tsx
// ============================================================================

'use client'

import { Languages, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocaleStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { LocaleCode } from '@/types/locale'

export function LocaleSelector() {
  const t = useTranslations('locale')
  const { current, locales, setLocale, isLoading } = useLocaleStore()

  const currentLocale = locales.find(l => l.code === current)

  const handleLocaleChange = React.useCallback(async (newLocale: LocaleCode) => {
    try {
      await setLocale(newLocale)
      // Refresh page to apply new locale
      window.location.reload()
    } catch (error) {
      console.error('Failed to change locale:', error)
    }
  }, [setLocale])

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-8"
              disabled={isLoading}
              aria-label={t('changeLanguage')}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">
            {currentLocale?.flag} {currentLocale?.nativeName}
          </span>
            <span className="sm:hidden text-lg">
            {currentLocale?.flag}
          </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          {locales.map((locale) => (
              <DropdownMenuItem
                  key={locale.code}
                  onClick={() => handleLocaleChange(locale.code)}
                  className={cn(
                      'flex items-center gap-2 cursor-pointer',
                      current === locale.code && 'bg-accent'
                  )}
              >
                <span className="text-base">{locale.flag}</span>
                <span className="flex-1 text-sm">{locale.nativeName}</span>
                {current === locale.code && (
                    <Check className="h-3 w-3 text-primary" />
                )}
              </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}