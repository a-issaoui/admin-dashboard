// ============================================================================
// src/components/layout/admin/header.tsx - Optimized Header Component
// ============================================================================

'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageSelector } from '@/components/ui/language-selector'
import { useIsRTL } from '@/stores/locale-store'
import { cn } from '@/lib/utils'

export function AdminHeader() {
    const isRTL = useIsRTL()

    return (
        <header className={cn(
            "sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4",
            isRTL && "flex-row-reverse"
        )}>
            {/* Left side - Sidebar trigger and breadcrumbs */}
            <div className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
            )}>
                <SidebarTrigger />
                {/* Breadcrumbs would go here */}
            </div>

            {/* Right side - Actions */}
            <div className={cn(
                "ml-auto flex items-center gap-2",
                isRTL && "ml-0 mr-auto flex-row-reverse"
            )}>
                {/* Search button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Search"
                >
                    <Icon name="MagnifyingGlass" size={18} />
                </Button>

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 relative"
                    aria-label="Notifications"
                >
                    <Icon name="Bell" size={18} />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
                </Button>

                {/* Language selector */}
                <LanguageSelector />

                {/* Theme toggle */}
                <ThemeToggle />
            </div>
        </header>
    )
}