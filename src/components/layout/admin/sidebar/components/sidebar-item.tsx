// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-item.tsx - OPTIMIZED
// ============================================================================

'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icon, IconProps } from '@/components/icons'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@/components/ui/collapsible'
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from '@/components/ui/sidebar'
import { useIsRTL } from '@/lib/stores/locale-store'
import { useSidebarStore } from '@/lib/stores/sidebar-store'
import { cn } from '@/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemType, SidebarSubmenu, MenuAction, Badge } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarBadge } from './sidebar-badge'

interface SidebarItemProps {
    item: SidebarMenuItemType
    className?: string
}

// Simple icon component
const ItemIcon = React.memo(function ItemIcon({
                                                  icon,
                                                  className
                                              }: {
    icon?: IconProps | undefined
    className?: string
}) {
    if (!icon) return null
    return <Icon {...icon} className={cn("shrink-0", className)} />
})

// Badge component with notification indicator support
const ItemBadge = React.memo(function ItemBadge({
                                                    badge,
                                                    hasActions,
                                                    className
                                                }: {
    badge?: Badge | undefined
    hasActions?: boolean
    className?: string
}) {
    if (!badge) return null

    return (
        <SidebarBadge
            badge={badge}
            className={cn(
                hasActions && "mr-6",
                className
            )}
        />
    )
})

// Actions component
const ItemActions = React.memo(function ItemActions({
                                                        actions,
                                                        title
                                                    }: {
    actions: MenuAction[]
    title: string
}) {
    return (
        <SidebarActions
            actions={actions}
            itemTitle={title}
        />
    )
})

// Submenu component - simplified
const SubmenuItems = React.memo(function SubmenuItems({
                                                          submenu
                                                      }: {
    submenu: SidebarSubmenu[]
}) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const isRTL = useIsRTL()

    return (
        <SidebarMenuSub
            className={cn(
                "group-data-[collapsible=icon]:hidden",
                isRTL && "border-r border-l-0 mr-3.5 ml-0 pr-2.5 pl-0"
            )}
        >
            {submenu.map((subItem) => {
                const isSubActive = subItem.url === pathname
                const subTitle = t(subItem.titleKey)
                const hasSubActions = Boolean(subItem.actions?.length)

                return (
                    <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                                isRTL && "flex-row-reverse"
                            )}
                        >
                            <Link
                                href={subItem.url}
                                className="flex items-center gap-2 w-full"
                                {...(subItem.external && {
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                                })}
                            >
                                <ItemIcon icon={subItem.icon} />
                                <span className="flex-1 truncate">{subTitle}</span>
                                <ItemBadge
                                    badge={subItem.badge}
                                    hasActions={hasSubActions}
                                />
                            </Link>
                        </SidebarMenuSubButton>

                        {hasSubActions && subItem.actions && (
                            <ItemActions
                                actions={subItem.actions}
                                title={subTitle}
                            />
                        )}
                    </SidebarMenuSubItem>
                )
            })}
        </SidebarMenuSub>
    )
})

export const SidebarItem = React.memo(function SidebarItem({
                                                               item,
                                                               className
                                                           }: SidebarItemProps) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const isRTL = useIsRTL()
    const { toggleCollapsed, collapsedStates } = useSidebarStore()

    // Simple state calculations
    const hasSubmenu = Boolean(item.submenu?.length)
    const hasActions = Boolean(item.actions?.length)
    const isActive = item.url === pathname
    const hasActiveChild = hasSubmenu && item.submenu!.some(sub => sub.url === pathname)
    const title = t(item.titleKey)
    const isCollapsed = collapsedStates[item.id] ?? !item.defaultExpanded

    const handleToggle = React.useCallback(() => {
        toggleCollapsed(item.id)
    }, [toggleCollapsed, item.id])

    // Link content
    const linkContent = (
        <div className={cn(
            "flex items-center gap-2 w-full",
            isRTL && "flex-row-reverse"
        )}>
            <ItemIcon icon={item.icon} />
            <span className="flex-1 truncate">{title}</span>
            <ItemBadge
                badge={item.badge}
                hasActions={hasActions}
            />
        </div>
    )

    // Trigger content for collapsible items
    const triggerContent = (
        <div className={cn(
            "flex items-center gap-2 w-full",
            isRTL && "flex-row-reverse"
        )}>
            <ItemIcon icon={item.icon} />
            <span className="flex-1 truncate">{title}</span>
            <ChevronRight
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    'group-data-[state=open]/collapsible:rotate-90',
                    isRTL && 'group-data-[state=open]/collapsible:-rotate-90',
                    hasActions && 'mr-6'
                )}
            />
        </div>
    )

    // Submenu item
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
                            className="w-full"
                        >
                            {triggerContent}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {hasActions && item.actions && (
                        <ItemActions
                            actions={item.actions}
                            title={title}
                        />
                    )}

                    <CollapsibleContent>
                        <SubmenuItems submenu={item.submenu!} />
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    // Regular item
    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild={!!item.url}
                isActive={isActive}
                disabled={item.disabled}
            >
                {item.url ? (
                    <Link
                        href={item.url}
                        className={cn(
                            "flex items-center gap-2 w-full",
                            isRTL && "flex-row-reverse"
                        )}
                        {...(item.external && {
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        })}
                    >
                        {linkContent}
                    </Link>
                ) : (
                    <div className={cn(
                        "flex items-center gap-2 w-full",
                        isRTL && "flex-row-reverse"
                    )}>
                        {linkContent}
                    </div>
                )}
            </SidebarMenuButton>

            {hasActions && item.actions && (
                <ItemActions
                    actions={item.actions}
                    title={title}
                />
            )}
        </SidebarMenuItem>
    )
})