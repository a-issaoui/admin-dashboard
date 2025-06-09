// ============================================================================
// src/components/shared/page-language-selector.tsx - STANDARD REACT PATTERNS
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
import {
    useCurrentLocale,
    useDirection,
    useIsRTL,
    useIsTransitioning,
    useLocales,
    useSetLocaleAsync,
    useSetLocale
} from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { LocaleCode } from '@/types/locale'

export function PageLanguageSelector() {
    const t = useTranslations('locale')
    const router = useRouter()

    // Store selectors
    const current = useCurrentLocale()
    const direction = useDirection()
    const isRTL = useIsRTL()
    const isTransitioning = useIsTransitioning()
    const locales = useLocales()
    const setLocaleAsync = useSetLocaleAsync()
    const setLocale = useSetLocale()

    // Memoize current locale lookup
    const currentLocale = React.useMemo(() =>
            locales.find(l => l.code === current),
        [locales, current]
    )

    // Memoize locale options with computed properties
    const localeOptions = React.useMemo(() =>
            locales.map(locale => ({
                ...locale,
                isSelected: current === locale.code,
                willCauseRefresh: direction !== locale.direction
            })),
        [locales, current, direction]
    )

    // Locale change handler with error handling
    const handleLocaleChange = React.useCallback(async (newLocale: LocaleCode) => {
        if (current === newLocale || isTransitioning) return

        try {
            const newDirection = locales.find(l => l.code === newLocale)?.direction || 'ltr'
            const needsRefresh = direction !== newDirection

            // Use async method for direction changes
            if (needsRefresh) {
                await setLocaleAsync(newLocale)
                setTimeout(() => {
                    router.refresh()
                }, 250)
            } else {
                // Synchronous update for same-direction changes
                setLocale(newLocale)
                setTimeout(() => {
                    router.refresh()
                }, 100)
            }
        } catch (error) {
            console.error('Failed to change locale:', error)
            // Fallback to synchronous update
            try {
                setLocale(newLocale)
                router.refresh()
            } catch (fallbackError) {
                console.error('Fallback locale change also failed:', fallbackError)
            }
        }
    }, [current, isTransitioning, setLocaleAsync, setLocale, direction, locales, router])

    // Memoize button content
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

    // Memoize loading content
    const loadingContent = React.useMemo(() => (
        <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Switching...</span>
        </div>
    ), [])

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
                    {isTransitioning ? loadingContent : buttonContent}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="min-w-[150px]"
                sideOffset={8}
            >
                {localeOptions.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            locale.isSelected && 'bg-accent',
                            isRTL && 'flex-row-reverse',
                            isTransitioning && 'opacity-50 pointer-events-none'
                        )}
                        disabled={isTransitioning}
                    >
                        <span className="text-base">{locale.flag}</span>
                        <div className="flex flex-col flex-1">
                            <span className="text-sm">{locale.nativeName}</span>
                            {locale.willCauseRefresh && (
                                <span className="text-xs text-muted-foreground">
                                    (page refresh)
                                </span>
                            )}
                        </div>
                        {locale.isSelected && (
                            <Check className="h-3 w-3 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}