// ============================================================================
// src/components/ui/language-selector.tsx - Simplified Language Selector
// ============================================================================

"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentLocale, useLocales, useSetLocale, useIsRTL } from "@/stores/locale-store"
import { cn } from "@/lib/utils"

export function LanguageSelector() {
    const currentLocale = useCurrentLocale()
    const locales = useLocales()
    const setLocale = useSetLocale()
    const isRTL = useIsRTL()

    const currentConfig = locales.find(l => l.code === currentLocale)

    const handleLocaleChange = (localeCode: string) => {
        setLocale(localeCode as any) // Type assertion for now
        // Refresh the page to apply new locale
        setTimeout(() => window.location.reload(), 100)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 gap-2 px-2",
                        isRTL && "flex-row-reverse"
                    )}
                    aria-label="Change language"
                >
                    <Icon name="Translate" size={16} />
                    <span className="text-xs font-medium">
            {currentConfig?.flag} {currentConfig?.code.toUpperCase()}
          </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse",
                            currentLocale === locale.code && "bg-accent"
                        )}
                    >
                        <span className="text-lg">{locale.flag}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{locale.nativeName}</span>
                            <span className="text-xs text-muted-foreground">{locale.name}</span>
                        </div>
                        {currentLocale === locale.code && (
                            <Icon name="Check" size={16} className="ml-auto text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}