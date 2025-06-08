// ============================================================================
// src/components/shared/page-language-selector.tsx - OPTIMIZED (FIXED)
// ============================================================================

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Languages, Check } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useLocaleStore, useCurrentLocale, useIsRTL, useIsTransitioning } from '@/lib/stores' // FIXED: Import from stores
import { cn } from '@/lib/utils'
import type { LocaleCode } from '@/types/locale'

export function PageLanguageSelector() {
    const t = useTranslations('locale')
    const router = useRouter()
    const { locales, setLocale, isLoading } = useLocaleStore()

    // Use optimized selectors
    const current = useCurrentLocale()
    const isRTL = useIsRTL()
    const isTransitioning = useIsTransitioning()

    // Memoize current locale data
    const currentLocale = React.useMemo(() =>
            locales.find(l => l.code === current),
        [locales, current]
    )

    // Memoize the change handler
    const handleLocaleChange = React.useCallback(async (newLocale: LocaleCode) => {
        if (current === newLocale || isLoading || isTransitioning) return

        try {
            await setLocale(newLocale)

            // Use a more subtle refresh method
            await new Promise(resolve => setTimeout(resolve, 350))
            router.refresh()
        } catch (error) {
            console.error('Failed to change locale:', error)
        }
    }, [current, isLoading, isTransitioning, setLocale, router])

    // Prepare button content with smooth transitions
    const buttonContent = React.useMemo(() => (
        <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
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
                        "h-9 min-w-[120px] transition-all duration-300",
                        isTransitioning && "opacity-70 pointer-events-none",
                        isRTL && "flex-row-reverse"
                    )}
                    disabled={isLoading || isTransitioning}
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
                className={cn(
                    "min-w-[150px] transition-all duration-300",
                    isTransitioning && "opacity-70"
                )}
                sideOffset={8}
            >
                {locales.map((locale) => {
                    const isSelected = current === locale.code
                    const isDisabled = isLoading || isTransitioning

                    return (
                        <DropdownMenuItem
                            key={locale.code}
                            onClick={() => !isDisabled && handleLocaleChange(locale.code)}
                            className={cn(
                                'flex items-center gap-2 cursor-pointer transition-all duration-200',
                                isSelected && 'bg-accent',
                                isRTL && 'flex-row-reverse',
                                isDisabled && 'opacity-50 pointer-events-none'
                            )}
                            disabled={isDisabled}
                        >
                            <span className="text-base">{locale.flag}</span>
                            <span className="flex-1 text-sm">{locale.nativeName}</span>
                            {isSelected && (
                                <Check className="h-3 w-3 text-primary" />
                            )}
                        </DropdownMenuItem>
                    )
                })}

                {isTransitioning && (
                    <div className="px-2 py-1 text-xs text-muted-foreground border-t">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Applying changes...
                        </div>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}