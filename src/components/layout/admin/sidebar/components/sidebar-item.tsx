// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-item.tsx - FIXED
// ============================================================================

'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icon } from '@/components/icons'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@/components/ui/collapsible'
import {
    SidebarMenuItem,
    SidebarMenuButton
} from '@/components/ui/sidebar'
import { useSidebarStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemType } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarBadge } from './sidebar-badge'
import { SidebarSubmenuComponent } from './sidebar-submenu'

interface SidebarItemProps {
    item: SidebarMenuItemType
    className?: string
}

// Memoized item content to prevent unnecessary re-renders
const ItemContent = React.memo(function ItemContent({
                                                        item,
                                                        hasActions,
                                                        title
                                                    }: {
    item: SidebarMenuItemType
    hasActions: boolean
    title: string
}) {
    return (
        <>
            {item.icon && <Icon {...item.icon} className="shrink-0" />}
            <span className="flex-1 truncate">{title}</span>
            {item.badge && (
                <SidebarBadge
                    badge={item.badge}
                    className={hasActions ? 'mr-6' : ''}
                />
            )}
        </>
    )
})

// Memoized submenu component
const MemoizedSubmenu = React.memo(SidebarSubmenuComponent)

export const SidebarItem = React.memo(function SidebarItem({ item, className }: SidebarItemProps) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const { collapsedStates, toggleCollapsed } = useSidebarStore()

    // Memoize expensive computations
    const computedState = React.useMemo(() => {
        const hasSubmenu = Boolean(item.submenu?.length)
        const hasActions = Boolean(item.actions?.length)
        const isActive = item.url === pathname
        const hasActiveChild = hasSubmenu && item.submenu!.some(sub => sub.url === pathname)
        const isCollapsed = collapsedStates[item.id] ?? !item.defaultExpanded
        const title = t(item.titleKey)

        const hasNotifications = hasSubmenu && item.submenu!.some(sub => {
            if (!sub.badge?.count) return false
            const count = typeof sub.badge.count === 'string'
                ? parseInt(sub.badge.count, 10)
                : sub.badge.count
            return !isNaN(count) && count > 0
        })

        return {
            hasSubmenu,
            hasActions,
            isActive,
            hasActiveChild,
            isCollapsed,
            hasNotifications,
            title
        }
    }, [item, pathname, collapsedStates, t])

    // Memoize toggle function
    const handleToggleCollapsed = React.useCallback(() => {
        toggleCollapsed(item.id)
    }, [toggleCollapsed, item.id])

    if (computedState.hasSubmenu) {
        return (
            <Collapsible
                open={!computedState.isCollapsed}
                onOpenChange={handleToggleCollapsed}
                className="group/collapsible"
            >
                <SidebarMenuItem className={className}>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={Boolean(computedState.isActive || computedState.hasActiveChild)}
                            disabled={item.disabled || false}
                            className={cn(
                                'group focus-visible:ring-2 focus-visible:ring-offset-2 will-change-auto',
                                !computedState.hasActions && 'group-has-data-[sidebar=menu-action]/menu-item:pr-2'
                            )}
                        >
                            {item.icon && <Icon {...item.icon} className="shrink-0" />}
                            <span className="flex-1 truncate">{computedState.title}</span>
                            {computedState.hasNotifications && (
                                <div className="h-2 w-2 bg-red-500 rounded-full shrink-0" />
                            )}
                            <ChevronRight
                                className={cn(
                                    'ml-auto h-4 w-4 shrink-0 transition-transform duration-200',
                                    'group-data-[state=open]/collapsible:rotate-90'
                                )}
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {computedState.hasActions && item.actions && (
                        <SidebarActions
                            actions={item.actions}
                            itemTitle={computedState.title}
                        />
                    )}

                    <CollapsibleContent>
                        <MemoizedSubmenu submenu={item.submenu!} />
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild={!!item.url}
                isActive={Boolean(computedState.isActive)}
                disabled={item.disabled || false}
                className={cn(
                    'group focus-visible:ring-2 focus-visible:ring-offset-2 will-change-auto',
                    !computedState.hasActions && 'group-has-data-[sidebar=menu-action]/menu-item:pr-2'
                )}
            >
                {item.url ? (
                    <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                        {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                        <ItemContent
                            item={item}
                            hasActions={computedState.hasActions}
                            title={computedState.title}
                        />
                    </Link>
                ) : (
                    <ItemContent
                        item={item}
                        hasActions={computedState.hasActions}
                        title={computedState.title}
                    />
                )}
            </SidebarMenuButton>

            {computedState.hasActions && item.actions && (
                <SidebarActions
                    actions={item.actions}
                    itemTitle={computedState.title}
                />
            )}
        </SidebarMenuItem>
    )
})