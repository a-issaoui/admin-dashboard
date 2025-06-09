// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - STANDARD REACT PATTERNS
// ============================================================================

'use client'

import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { orgData } from '@/data/org-data'
import { sidebarData } from '@/data/sidebar-data'
import { userData } from '@/data/user-data'
import { useRenderPerformance } from '@/hooks/use-performance'
import { useSidebarStore, useDirection, useIsRTL } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { SidebarGroupComponent } from './components/sidebar-group'
import { OrgProfile } from './org-profile'
import { UserMenu } from './user-menu'

interface AppSidebarProps {
    variant?: 'sidebar' | 'floating' | 'inset'
    side?: 'left' | 'right'
    collapsible?: 'offcanvas' | 'icon' | 'none'
    className?: string
}

export function AppSidebar({
                               variant = 'sidebar',
                               collapsible = 'icon',
                               className
                           }: AppSidebarProps) {
    // Monitor render performance in development
    useRenderPerformance('AppSidebar')

    const { setData, data } = useSidebarStore()
    const direction = useDirection()
    const isRTL = useIsRTL()

    // Memoize side calculation
    const sidebarSide = React.useMemo(() => {
        return isRTL ? 'right' : 'left'
    }, [isRTL])

    // Memoize sorted groups
    const sortedGroups = React.useMemo(() => {
        if (!data.length) return []
        return [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
    }, [data])

    // Memoize CSS custom properties
    const sidebarStyle = React.useMemo(() => ({
        '--sidebar-direction': direction,
        '--sidebar-transform-origin': isRTL ? 'right' : 'left'
    } as React.CSSProperties), [direction, isRTL])

    // Initialize data on mount
    React.useLayoutEffect(() => {
        if (data.length === 0) {
            setData(sidebarData)
        }
    }, [setData, data.length])

    // Memoize header content
    const headerContent = React.useMemo(() => (
        <SidebarHeader className={cn(
            "p-2",
            isRTL && "flex-row-reverse"
        )}>
            <OrgProfile org={orgData} />
        </SidebarHeader>
    ), [isRTL])

    // Memoize footer content
    const footerContent = React.useMemo(() => (
        <SidebarFooter className="p-2">
            <UserMenu user={userData} />
        </SidebarFooter>
    ), [])

    // Memoize group components
    const groupComponents = React.useMemo(() =>
            sortedGroups.map((group) => (
                <SidebarGroupComponent
                    key={group.id}
                    group={group}
                />
            )),
        [sortedGroups]
    )

    // Loading state with skeleton
    if (!data.length) {
        return (
            <div className="sidebar-container animate-pulse">
                <Sidebar
                    variant={variant}
                    side={sidebarSide}
                    collapsible={collapsible}
                    className={cn("opacity-50", className)}
                >
                    <SidebarHeader className="p-2">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                    </SidebarHeader>
                    <SidebarContent className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-2 space-y-1">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                                <div className="h-8 bg-muted rounded animate-pulse" />
                                <div className="h-6 bg-muted rounded animate-pulse ml-4" />
                            </div>
                        ))}
                    </SidebarContent>
                    <SidebarFooter className="p-2">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                    </SidebarFooter>
                </Sidebar>
            </div>
        )
    }

    return (
        <div
            className="sidebar-container"
            style={sidebarStyle}
            data-direction={direction}
        >
            <Sidebar
                variant={variant}
                side={sidebarSide}
                collapsible={collapsible}
                className={className}
                data-locale-direction={direction}
            >
                {headerContent}

                <SidebarContent>
                    {groupComponents}
                </SidebarContent>

                {footerContent}

                <SidebarRail />
            </Sidebar>
        </div>
    )
}