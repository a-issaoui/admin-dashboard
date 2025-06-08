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
import { useLocaleStore } from '@/lib/stores'
import { cn } from '@/lib/utils'

export function PageLanguageSelector() {
    const t = useTranslations('locale')
    const router = useRouter()
    const { current, locales, setLocale, isLoading, isRTL } = useLocaleStore()

    const currentLocale = locales.find(l => l.code === current)

    const handleLocaleChange = React.useCallback(async (newLocale: string) => {
        try {
            await setLocale(newLocale as any)
            // Smooth transition instead of hard reload
            router.refresh()
        } catch (error) {
            console.error('Failed to change locale:', error)
        }
    }, [setLocale, router])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "gap-2 h-9 min-w-[120px]",
                        isRTL() && "flex-row-reverse"
                    )}
                    disabled={isLoading}
                    aria-label={t('changeLanguage')}
                >
                    <Languages className="h-4 w-4" />
                    <span className="text-sm">
            {currentLocale?.flag} {currentLocale?.nativeName}
          </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={isRTL() ? "start" : "end"}
                className="min-w-[150px]"
            >
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer',
                            current === locale.code && 'bg-accent',
                            isRTL() && 'flex-row-reverse'
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