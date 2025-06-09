// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - FIXED HMR ISSUES
// ============================================================================

'use client'

import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { orgData } from '@/data/org-data'
import { sidebarData } from '@/data/sidebar-data'
import { userData } from '@/data/user-data'
import { useDirection, useIsRTL } from '@/lib/stores'
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

// Static data - no client-side loading needed
const STATIC_SIDEBAR_DATA = sidebarData
const STATIC_ORG_DATA = orgData
const STATIC_USER_DATA = userData

// Memoized group components for performance
const MemoizedGroupComponents = React.memo(function MemoizedGroupComponents() {
    // Sort groups by order
    const sortedGroups = React.useMemo(() => {
        return [...STATIC_SIDEBAR_DATA].sort((a, b) => (a.order || 0) - (b.order || 0))
    }, [])

    return (
        <>
            {sortedGroups.map((group) => (
                <SidebarGroupComponent
                    key={group.id}
                    group={group}
                />
            ))}
        </>
    )
})

// Memoized header component
const MemoizedSidebarHeader = React.memo(function MemoizedSidebarHeader({
                                                                            isRTL
                                                                        }: {
    isRTL: boolean
}) {
    return (
        <SidebarHeader className={cn(
            "p-2",
            isRTL && "flex-row-reverse"
        )}>
            <OrgProfile org={STATIC_ORG_DATA} />
        </SidebarHeader>
    )
})

// Memoized footer component
const MemoizedSidebarFooter = React.memo(function MemoizedSidebarFooter() {
    return (
        <SidebarFooter className="p-2">
            <UserMenu user={STATIC_USER_DATA} />
        </SidebarFooter>
    )
})

export function AppSidebar({
                               variant = 'sidebar',
                               collapsible = 'icon',
                               className
                           }: AppSidebarProps) {
    const direction = useDirection()
    const isRTL = useIsRTL()

    // Memoize side calculation
    const sidebarSide = React.useMemo(() => {
        return isRTL ? 'right' : 'left'
    }, [isRTL])

    // Memoize CSS custom properties
    const sidebarStyle = React.useMemo(() => ({
        '--sidebar-direction': direction,
        '--sidebar-transform-origin': isRTL ? 'right' : 'left'
    } as React.CSSProperties), [direction, isRTL])

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
                <MemoizedSidebarHeader isRTL={isRTL} />

                <SidebarContent>
                    <MemoizedGroupComponents />
                </SidebarContent>

                <MemoizedSidebarFooter />

                <SidebarRail />
            </Sidebar>
        </div>
    )
}