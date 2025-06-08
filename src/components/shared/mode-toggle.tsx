// ============================================================================
// src/components/shared/mode-toggle.tsx (UPDATED)
// ============================================================================

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/lib/stores'

export function ModeToggle() {
  const t = useTranslations('theme')
  const { resolvedTheme, toggleTheme } = useThemeStore()

  return (
      <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={t('toggleTheme')}
          className="h-8 w-8"
      >
        {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
        ) : (
            <Moon className="h-4 w-4" />
        )}
      </Button>
  )
}