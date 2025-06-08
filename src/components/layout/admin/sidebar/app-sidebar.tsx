'use client'

import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { SidebarGroupComponent } from './components/sidebar-group'
import { OrgProfile } from './org-profile'
import { UserMenu } from './user-menu'
import { useSidebarStore, useLocaleStore } from '@/lib/stores'
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

    // Subscribe to the entire locale store to ensure reactivity
    const localeStore = useLocaleStore()

    // Force component to re-render when locale changes
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    React.useEffect(() => {
        setData(sidebarData)
    }, [setData])

    // Listen for locale changes and force update
    React.useEffect(() => {
        const unsubscribe = useLocaleStore.subscribe((state, prevState) => {
            if (state.current !== prevState.current || state.direction !== prevState.direction) {
                forceUpdate()
            }
        })
        return unsubscribe
    }, [])

    // Calculate side based on current locale state
    const isRTL = localeStore.direction === 'rtl'
    const sidebarSide = isRTL ? 'right' : 'left'

    const sortedGroups = React.useMemo(() => {
        return [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
    }, [data])

    return (
        <Sidebar
            variant={variant}
            side={sidebarSide}
            collapsible={collapsible}
            className={cn(className)}
            data-locale={localeStore.current}
            data-direction={localeStore.direction}
            key={`sidebar-${localeStore.current}-${localeStore.direction}`} // Force re-mount on locale change
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
    )
}