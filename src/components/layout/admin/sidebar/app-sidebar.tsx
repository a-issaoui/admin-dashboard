// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - PERFORMANCE OPTIMIZED
// ============================================================================

'use client'

import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { orgData } from '@/data/org-data'
import { sidebarData } from '@/data/sidebar-data'
import { userData } from '@/data/user-data'
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

// Memoized group component to prevent unnecessary re-renders
const MemoizedSidebarGroup = React.memo(SidebarGroupComponent)

// Memoized static components
const MemoizedOrgProfile = React.memo(OrgProfile)
const MemoizedUserMenu = React.memo(UserMenu)

export const AppSidebar = React.memo(function AppSidebar({
                                                             variant = 'sidebar',
                                                             collapsible = 'icon',
                                                             className
                                                         }: AppSidebarProps) {
    const { setData, data } = useSidebarStore()
    const direction = useDirection()
    const isRTL = useIsRTL()

    // Initialize data only once on mount - moved to useEffect to prevent render blocking
    React.useEffect(() => {
        if (data.length === 0) {
            // Use startTransition to make this non-blocking
            React.startTransition(() => {
                setData(sidebarData)
            })
        }
    }, [setData, data.length])

    // Memoize sidebar side calculation
    const sidebarSide = React.useMemo(() => isRTL ? 'right' : 'left', [isRTL])

    // Pre-sort and memoize groups with stable reference
    const sortedGroups = React.useMemo(() => {
        if (!data.length) return []

        // Use a more efficient sorting approach
        const sorted = data.slice().sort((a, b) => (a.order || 0) - (b.order || 0))
        return sorted
    }, [data])

    // Memoize CSS custom properties with stable reference
    const sidebarStyle = React.useMemo(() => ({
        '--sidebar-direction': direction,
        '--sidebar-transform-origin': isRTL ? 'right' : 'left'
    } as React.CSSProperties), [direction, isRTL])

    // Early return for loading state with minimal skeleton
    if (!data.length) {
        return (
            <div className="sidebar-container">
                <Sidebar
                    variant={variant}
                    side={sidebarSide}
                    collapsible={collapsible}
                    className={cn("opacity-50", className)}
                >
                    <SidebarHeader className="p-2">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="p-2 space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-8 bg-muted rounded animate-pulse" />
                            <div className="h-6 bg-muted rounded animate-pulse ml-4" />
                        </div>
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
                <SidebarHeader className={cn("p-2", isRTL && "flex-row-reverse")}>
                    <MemoizedOrgProfile org={orgData} />
                </SidebarHeader>

                <SidebarContent>
                    {sortedGroups.map((group) => (
                        <MemoizedSidebarGroup
                            key={group.id}
                            group={group}
                        />
                    ))}
                </SidebarContent>

                <SidebarFooter className="p-2">
                    <MemoizedUserMenu user={userData} />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </div>
    )
})

AppSidebar.displayName = 'AppSidebar'