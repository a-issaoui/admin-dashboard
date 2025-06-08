// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - OPTIMIZED (FIXED)
// ============================================================================

'use client'

import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { SidebarGroupComponent } from './components/sidebar-group'
import { OrgProfile } from './org-profile'
import { UserMenu } from './user-menu'
import { useSidebarStore, useDirection, useIsRTL } from '@/lib/stores'
import { sidebarData } from '@/data/sidebar-data'
import { userData } from '@/data/user-data'
import { orgData } from '@/data/org-data'
import { cn } from '@/lib/utils'

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

    // Initialize data only once
    React.useEffect(() => {
        if (data.length === 0) {
            setData(sidebarData)
        }
    }, [setData, data.length])

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
                    'transition-transform duration-300 ease-in-out',
                    className
                )}
                data-locale-direction={direction}
            >
                <SidebarHeader className={cn(
                    "p-2 transition-all duration-300",
                    isRTL && "flex-row-reverse"
                )}>
                    <OrgProfile org={orgData} />
                </SidebarHeader>

                <SidebarContent className="transition-all duration-300">
                    {sortedGroups.map((group) => (
                        <SidebarGroupComponent
                            key={group.id}
                            group={group}
                        />
                    ))}
                </SidebarContent>

                <SidebarFooter className="p-2 transition-all duration-300">
                    <UserMenu user={userData} />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </div>
    )
}

// Preload component to improve initial render - FIXED display name
export const AppSidebarPreloader = React.memo(function AppSidebarPreloader() {
    const { setData } = useSidebarStore()

    React.useEffect(() => {
        // Preload sidebar data
        setData(sidebarData)
    }, [setData])

    return null
})