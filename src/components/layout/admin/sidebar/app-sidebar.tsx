// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - OPTIMIZED
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

export function AppSidebar({
                               variant = 'sidebar',
                               collapsible = 'icon',
                               className
                           }: AppSidebarProps) {
    const { setData, data } = useSidebarStore()

    // Use optimized selectors
    const direction = useDirection()
    const isRTL = useIsRTL()

    // Memoize side calculation
    const sidebarSide = React.useMemo(() => {
        return isRTL ? 'right' : 'left'
    }, [isRTL])

    // Memoize sorted groups - only recalculate when data changes
    const sortedGroups = React.useMemo(() => {
        return [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
    }, [data])

    // Initialize data immediately without conditional check
    React.useLayoutEffect(() => {
        setData(sidebarData)
    }, [setData])

    // Prepare CSS custom properties for smooth transitions
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
                className={cn(
                    // Remove transition to prevent flashing
                    className
                )}
                data-locale-direction={direction}
            >
                <SidebarHeader className={cn(
                    "p-2",
                    isRTL && "flex-row-reverse"
                )}>
                    <OrgProfile org={orgData} />
                </SidebarHeader>

                <SidebarContent>
                    {sortedGroups.map((group) => (
                        <SidebarGroupComponent
                            key={group.id}
                            group={group}
                        />
                    ))}
                </SidebarContent>

                <SidebarFooter className="p-2">
                    <UserMenu user={userData} />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </div>
    )
}