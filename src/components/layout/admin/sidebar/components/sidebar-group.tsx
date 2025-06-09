// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-group.tsx - OPTIMIZED
// ============================================================================

'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    useSidebar
} from '@/components/ui/sidebar'
import { useSidebarStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { SidebarGroup as SidebarGroupType } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarItem } from './sidebar-item'

interface SidebarGroupProps {
    group: SidebarGroupType
    className?: string
}

// Memoized menu items wrapper
const MenuItems = React.memo(function MenuItems({
                                                    menuItems
                                                }: {
    menuItems: SidebarGroupType['menu']
}) {
    return (
        <>
            {menuItems.map((item) => (
                <SidebarItem key={item.id} item={item} />
            ))}
        </>
    )
})

export const SidebarGroupComponent = React.memo(function SidebarGroupComponent({
                                                                                   group,
                                                                                   className
                                                                               }: SidebarGroupProps) {
    const t = useTranslations('nav')
    const { state } = useSidebar()
    const { collapsedStates, toggleCollapsed } = useSidebarStore()

    // Simple state calculations without excessive memoization
    const isCollapsed = state === 'collapsed'
    const hasActions = Boolean(group.actions?.length)
    const isGroupCollapsed = collapsedStates[`group-${group.id}`] ?? !group.defaultOpen
    const showTitle = group.titleKey && !isCollapsed
    const title = group.titleKey ? t(group.titleKey) : ''

    const handleToggle = React.useCallback(() => {
        toggleCollapsed(`group-${group.id}`)
    }, [toggleCollapsed, group.id])

    // Collapsible group implementation
    if (group.collapsible && showTitle) {
        return (
            <Collapsible
                open={!isGroupCollapsed}
                onOpenChange={handleToggle}
                className="group/collapsible-group"
            >
                <SidebarGroup className={className}>
                    <SidebarGroupLabel asChild className="flex-1">
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2">
                            <span className="truncate">{title}</span>
                            <ChevronRight
                                className={cn(
                                    'h-4 w-4 shrink-0 transition-transform duration-200',
                                    'group-data-[state=open]/collapsible-group:rotate-90',
                                    hasActions && 'mr-6'
                                )}
                            />
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    {hasActions && group.actions && (
                        <SidebarActions
                            actions={group.actions}
                            itemTitle={title}
                        />
                    )}

                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <MenuItems menuItems={group.menu} />
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        )
    }

    // Standard group implementation
    return (
        <SidebarGroup className={className}>
            {showTitle && (
                <div className="flex items-center">
                    <SidebarGroupLabel className="flex-1">
                        {title}
                    </SidebarGroupLabel>
                    {hasActions && group.actions && (
                        <SidebarActions
                            actions={group.actions}
                            itemTitle={title}
                        />
                    )}
                </div>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    <MenuItems menuItems={group.menu} />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
})