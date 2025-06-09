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

// Memoized child components to prevent cascade re-renders
const MemoizedSidebarItem = React.memo(SidebarItem)
const MemoizedSidebarActions = React.memo(SidebarActions)

export const SidebarGroupComponent = React.memo(function SidebarGroupComponent({
                                                                                   group,
                                                                                   className
                                                                               }: SidebarGroupProps) {
    const t = useTranslations('nav')
    const { state } = useSidebar()

    // Optimized store subscription - only get what we need
    const isGroupCollapsed = useSidebarStore(
        React.useCallback(
            (state) => state.collapsedStates[`group-${group.id}`] ?? !group.defaultOpen,
            [group.id, group.defaultOpen]
        )
    )
    const toggleCollapsed = useSidebarStore(state => state.toggleCollapsed)

    // Pre-compute stable values to avoid recalculation
    const groupConfig = React.useMemo(() => ({
        isCollapsed: state === 'collapsed',
        hasActions: Boolean(group.actions?.length),
        showTitle: Boolean(group.titleKey && state !== 'collapsed'),
        title: group.titleKey ? t(group.titleKey) : '',
        collapsibleKey: `group-${group.id}`
    }), [state, group.actions?.length, group.titleKey, group.id, t])

    // Memoize toggle handler with stable reference
    const handleToggle = React.useCallback(() => {
        toggleCollapsed(groupConfig.collapsibleKey)
    }, [toggleCollapsed, groupConfig.collapsibleKey])

    // Optimize menu items rendering - use keys that won't change
    const menuItems = React.useMemo(() =>
            group.menu.map((item) => (
                <MemoizedSidebarItem key={item.id} item={item} />
            )),
        [group.menu]
    )

    // Memoize trigger content to prevent recreation
    const triggerContent = React.useMemo(() => (
        <>
            <span className="truncate">{groupConfig.title}</span>
            <ChevronRight
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    'group-data-[state=open]/collapsible-group:rotate-90',
                    groupConfig.hasActions && 'mr-6'
                )}
            />
        </>
    ), [groupConfig.title, groupConfig.hasActions])

    // Memoize group label content
    const groupLabelContent = React.useMemo(() => (
        <div className="flex items-center">
            <SidebarGroupLabel className="flex-1">
                {groupConfig.title}
            </SidebarGroupLabel>
            {groupConfig.hasActions && group.actions && (
                <MemoizedSidebarActions
                    actions={group.actions}
                    itemTitle={groupConfig.title}
                />
            )}
        </div>
    ), [groupConfig.title, groupConfig.hasActions, group.actions])

    // Render collapsible group
    if (group.collapsible && groupConfig.showTitle) {
        return (
            <Collapsible
                open={!isGroupCollapsed}
                onOpenChange={handleToggle}
                className="group/collapsible-group"
            >
                <SidebarGroup className={className}>
                    <SidebarGroupLabel asChild className="flex-1">
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2">
                            {triggerContent}
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    {groupConfig.hasActions && group.actions && (
                        <MemoizedSidebarActions
                            actions={group.actions}
                            itemTitle={groupConfig.title}
                        />
                    )}

                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        )
    }

    // Render standard group
    return (
        <SidebarGroup className={className}>
            {groupConfig.showTitle && groupLabelContent}
            <SidebarGroupContent>
                <SidebarMenu>
                    {menuItems}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
})

SidebarGroupComponent.displayName = 'SidebarGroupComponent'