// ============================================================================
// src/components/shared/page-language-selector.tsx - OPTIMIZED with smart refresh
// ============================================================================

'use client'

import { Languages, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocaleStore, useCurrentLocale, useIsRTL, useIsTransitioning } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { LocaleCode } from '@/types/locale'

export function PageLanguageSelector() {
    const t = useTranslations('locale')
    const router = useRouter()
    const { locales, setLocaleAsync, direction } = useLocaleStore()

    // Use optimized selectors
    const current = useCurrentLocale()
    const isRTL = useIsRTL()
    const isTransitioning = useIsTransitioning()

    // Memoize current locale data
    const currentLocale = React.useMemo(() =>
            locales.find(l => l.code === current),
        [locales, current]
    )

    // Smart locale change handler
    const handleLocaleChange = React.useCallback(async (newLocale: LocaleCode) => {
        if (current === newLocale || isTransitioning) return

        try {
            const newDirection = locales.find(l => l.code === newLocale)?.direction || 'ltr'
            const needsRefresh = direction !== newDirection

            // Use async method only if direction changes
            if (needsRefresh) {
                await setLocaleAsync(newLocale)
                // Wait for transition to complete before refreshing
                setTimeout(() => {
                    router.refresh()
                }, 250)
            } else {
                // For same-direction changes, just update the locale synchronously
                useLocaleStore.getState().setLocale(newLocale)
                // No refresh needed for same direction
            }
        } catch (error) {
            console.error('Failed to change locale:', error)
        }
    }, [current, isTransitioning, setLocaleAsync, direction, locales, router])

    // Prepare button content with stable references
    const buttonContent = React.useMemo(() => (
        <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
        )}>
            <Languages className="h-4 w-4" />
            <span className="text-sm whitespace-nowrap">
        {currentLocale?.flag} {currentLocale?.nativeName}
      </span>
        </div>
    ), [currentLocale, isRTL])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-9 min-w-[120px]",
                        isTransitioning && "opacity-70 pointer-events-none",
                        isRTL && "flex-row-reverse"
                    )}
                    disabled={isTransitioning}
                    aria-label={t('changeLanguage')}
                >
                    {isTransitioning ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span className="text-sm">Switching...</span>
                        </div>
                    ) : (
                        buttonContent
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="min-w-[150px]"
                sideOffset={8}
            >
                {locales.map((locale) => {
                    const isSelected = current === locale.code
                    const willCauseRefresh = direction !== locale.direction

                    return (
                        <DropdownMenuItem
                            key={locale.code}
                            onClick={() => handleLocaleChange(locale.code)}
                            className={cn(
                                'flex items-center gap-2 cursor-pointer',
                                isSelected && 'bg-accent',
                                isRTL && 'flex-row-reverse',
                                isTransitioning && 'opacity-50 pointer-events-none'
                            )}
                            disabled={isTransitioning}
                        >
                            <span className="text-base">{locale.flag}</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-sm">{locale.nativeName}</span>
                                {willCauseRefresh && (
                                    <span className="text-xs text-muted-foreground">
                    (page refresh)
                  </span>
                                )}
                            </div>
                            {isSelected && (
                                <Check className="h-3 w-3 text-primary" />
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}