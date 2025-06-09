// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-item.tsx - SIMPLIFIED
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

export function SidebarItem({ item, className }: SidebarItemProps) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const { collapsedStates, toggleCollapsed } = useSidebarStore()

    // Simple, clear computations - no over-engineering
    const hasSubmenu = Boolean(item.submenu?.length)
    const hasActions = Boolean(item.actions?.length)
    const isActive = item.url === pathname
    const hasActiveChild = hasSubmenu && item.submenu!.some(sub => sub.url === pathname)
    const isCollapsed = collapsedStates[item.id] ?? !item.defaultExpanded
    const title = t(item.titleKey)

    const handleToggle = () => toggleCollapsed(item.id)

    if (hasSubmenu) {
        return (
            <Collapsible
                open={!isCollapsed}
                onOpenChange={handleToggle}
                className="group/collapsible"
            >
                <SidebarMenuItem className={className}>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={isActive || hasActiveChild}
                            disabled={item.disabled}
                            className="group focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                            {item.icon && <Icon {...item.icon} className="shrink-0" />}
                            <span className="flex-1 truncate">{title}</span>
                            <ChevronRight
                                className={cn(
                                    'ml-auto h-4 w-4 shrink-0 transition-transform duration-200',
                                    'group-data-[state=open]/collapsible:rotate-90'
                                )}
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {hasActions && item.actions && (
                        <SidebarActions
                            actions={item.actions}
                            itemTitle={title}
                        />
                    )}

                    <CollapsibleContent>
                        <SidebarSubmenuComponent submenu={item.submenu!} />
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild={!!item.url}
                isActive={isActive}
                disabled={item.disabled}
                className="group focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                {item.url ? (
                    <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                        {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                        {item.icon && <Icon {...item.icon} className="shrink-0" />}
                        <span className="flex-1 truncate">{title}</span>
                        {item.badge && <SidebarBadge badge={item.badge} />}
                    </Link>
                ) : (
                    <>
                        {item.icon && <Icon {...item.icon} className="shrink-0" />}
                        <span className="flex-1 truncate">{title}</span>
                        {item.badge && <SidebarBadge badge={item.badge} />}
                    </>
                )}
            </SidebarMenuButton>

            {hasActions && item.actions && (
                <SidebarActions
                    actions={item.actions}
                    itemTitle={title}
                />
            )}
        </SidebarMenuItem>
    )
}